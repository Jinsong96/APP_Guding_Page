"""Generate local TTS *concept previews* for all companion x cheer combinations.

Requires the macOS `say` and `afconvert` utilities. Does not change the app's
live asset. These are auditions for line choice/personality, not final VO.
"""

import math
import struct
import subprocess
import tempfile
import wave
from pathlib import Path

from generate_celebration_options import RATE, N, stamp_impact, save_wav

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "design-previews/celebration-sounds/companions/animated-held"

LINES = (
    ("woo-hoo", "Woo-hoo!"),
    ("woo", "Woo!"),
    ("hooray", "Hooray!"),
    ("hurrah", "Hurrah!"),
    ("yippee", "Yippee!"),
    ("woot-woot", "Woot! Woot!"),
    ("yahoo", "Yahoo!"),
    ("bravo", "Bravo!"),
)

# Different voices/tempos are a sketch of acting direction. We should record or
# use an expressive licensed voice for final production.
COMPANIONS = {
    "wick": {"voice": "Samantha", "rate": 235, "speed": .96, "level": .62,
             "rise": (1.0, 4.7)},
    "pal": {"voice": "Eddy (English (US))", "rate": 255, "speed": 1.00, "level": .68,
            "rise": (1.7, 5.5)},
    "tuanzi": {"voice": "Reed (English (US))", "rate": 215, "speed": .94, "level": .59,
               "rise": (.7, 4.3)},
}


def synthesize(voice, rate, text, temp_dir, slug):
    aiff = temp_dir / f"{slug}.aiff"
    wav = temp_dir / f"{slug}.wav"
    subprocess.run(["say", "-v", voice, "-r", str(rate), "-o", str(aiff), text], check=True)
    subprocess.run(["afconvert", str(aiff), str(wav), "-f", "WAVE", "-d", "LEI16"], check=True,
                   stdout=subprocess.DEVNULL)
    with wave.open(str(wav), "rb") as audio:
        assert audio.getnchannels() == 1 and audio.getsampwidth() == 2
        source_rate = audio.getframerate()
        count = audio.getnframes()
        assert count, f"No samples generated for {voice}: {text}"
        samples = struct.unpack(f"<{count}h", audio.readframes(count))
    return [sample / 32768 for sample in samples], source_rate


def clean_speech(source, source_rate, speed, level, rise):
    # Pitch starts a little higher and sweeps upwards toward the final vowel.
    # The small acceleration and crescendo turn flat TTS into an emphatic
    # *directional sketch*; final character VO should be performed naturally.
    peak = max(abs(value) for value in source)
    threshold = max(.003, peak * .025)
    active = [i for i, value in enumerate(source) if abs(value) >= threshold]
    start = max(0, active[0] - round(.018 * source_rate))
    end = min(len(source), active[-1] + round(.042 * source_rate))
    source = source[start:end]

    average_lift = 2 ** (((rise[0] + rise[1]) / 2) / 12)
    projected_duration = len(source) / source_rate / (speed * average_lift)
    if projected_duration > 1.09:
        speed *= projected_duration / 1.09

    output = []
    cursor = 0.0
    while cursor < len(source) - 1 and len(output) < round(1.17 * RATE):
        progress = cursor / (len(source) - 1)
        semitones = rise[0] + (rise[1] - rise[0]) * progress ** 1.45
        playback = speed * 2 ** (semitones / 12)
        pos = int(cursor)
        frac = cursor - pos
        sample = source[pos] * (1 - frac) + source[pos + 1] * frac
        age = len(output) / RATE
        remaining = (len(source) - cursor) / (source_rate * playback)
        envelope = min(1.0, age / .013, remaining / .028)
        crescendo = .84 + .28 * progress ** 1.5
        output.append(sample * max(0, envelope) * crescendo * level / peak)
        cursor += source_rate * playback / RATE
    return output


def hold_final_vowel(speech, extra_seconds):
    """Sustain a voiced slice of the final syllable, leaving its ending intact.

    We loop approximately one pitch period with crossfades, rather than slowing
    the entire sentence (or pitching the tail down). This is a concept-render
    technique; a performed held vowel will be more natural in final VO.
    """
    extra = round(extra_seconds * RATE)
    fade = round(.026 * RATE)
    if len(speech) < 4 * fade:
        return speech

    # Look for the strongest vowel-like 20ms window late in the utterance;
    # leave space for the final consonant/release in "Woot!", "Hurrah!", etc.
    lo = max(2 * fade, len(speech) - round(.18 * RATE))
    hi = len(speech) - round(.042 * RATE)
    width = round(.020 * RATE)
    candidates = range(lo, hi, round(.007 * RATE))
    center = max(candidates, key=lambda c: sum(
        speech[i] * speech[i] for i in range(c - width // 2, c + width // 2, 5)
    ) * (1.0 + .12 * (c - lo) / max(1, hi - lo)))

    # Autocorrelation estimates the local voice period; seek a similar-phase
    # loop rather than replaying a long chunk with an audible rhythmic pulse.
    fragment = speech[center - round(.017 * RATE):center + round(.017 * RATE)]
    best_period, best_score = 160, -1.0
    for lag in range(82, 310, 2):
        a = fragment[:len(fragment) - lag:3]
        b = fragment[lag::3]
        numerator = sum(x * y for x, y in zip(a, b))
        norm = math.sqrt(sum(x*x for x in a) * sum(y*y for y in b)) + 1e-10
        score = numerator / norm
        if score > best_score:
            best_period, best_score = lag, score

    # Find an ascending zero-crossing close to the chosen vowel center.
    starts = range(center - best_period // 2, center + best_period // 2)
    crossing = min(starts, key=lambda i: (0 if speech[i] <= 0 < speech[i + 1] else 1,
                                         abs(i - center), abs(speech[i])))
    cycle = speech[crossing:crossing + best_period]
    if len(cycle) < best_period:
        return speech
    local = speech[center - width // 2:center + width // 2]
    local_rms = math.sqrt(sum(v*v for v in local) / len(local))
    cycle_rms = math.sqrt(sum(v*v for v in cycle) / len(cycle)) + 1e-8
    gain = min(1.4, max(.7, local_rms / cycle_rms))

    insert = min(max(center, fade + 1), len(speech) - fade - 1)
    phase = 0.0
    held = []
    held_length = extra + 2 * fade
    for i in range(held_length):
        j = int(phase) % len(cycle)
        part = phase - int(phase)
        value = (cycle[j] * (1 - part) + cycle[(j + 1) % len(cycle)] * part) * gain
        # Gentle further rise on the held vowel, then let the consonant close it.
        phase += 1.0 + .045 * (i / held_length)
        contour = 1.0 + .1 * math.sin(math.pi * i / held_length)
        held.append(value * contour)

    start = insert - fade
    prefix = speech[:start]
    into = [speech[start + i] * math.cos(math.pi * i / (2 * fade))
            + held[i] * math.sin(math.pi * i / (2 * fade)) for i in range(fade)]
    sustain = held[fade:fade + extra]
    out = [held[fade + extra + i] * math.cos(math.pi * i / (2 * fade))
           + speech[insert + i] * math.sin(math.pi * i / (2 * fade)) for i in range(fade)]
    return prefix + into + sustain + out + speech[insert + fade:]


# A short "Woo!" has more room to bloom; "Woot! Woot!" already has two beats.
HOLD_SECONDS = {
    "woo-hoo": .29, "woo": .34, "hooray": .30, "hurrah": .29,
    "yippee": .28, "woot-woot": .17, "yahoo": .29, "bravo": .28,
}


def tone(age, hz, decay):
    if age < 0:
        return 0.0
    attack = min(1.0, age / .006)
    return attack * math.exp(-decay * age) * (
        math.sin(2 * math.pi * hz * age)
        + .19 * math.sin(2 * math.pi * hz * 2.01 * age)
        + .08 * math.sin(2 * math.pi * hz * 2.72 * age)
    )


def audition(speech, companion, impact):
    # The voice is the celebratory foreground. Small train-bell replies follow
    # the end of each line instead of imposing a fixed rhythm over the words.
    onset = round(.69 * RATE)
    voice_end = .69 + len(speech) / RATE
    bell_styles = {
        "wick": ((783.99, .09), (1046.50, .12), (1318.51, .13)),
        "pal": ((880.00, .10), (1174.66, .13), (1568.00, .15)),
        "tuanzi": ((659.25, .08), (987.77, .105), (1318.51, .12)),
    }
    first, second, third = bell_styles[companion]
    bells = ((.635, *first), (voice_end + .055, *second), (voice_end + .215, *third))
    result = []
    for i in range(N):
        voice = speech[i - onset] if 0 <= i - onset < len(speech) else 0.0
        t = i / RATE
        bell = sum(strength * tone(t - start, hz, 5.8) for start, hz, strength in bells)
        tail = min(1.0, max(0.0, (N - i) / (.16 * RATE)))
        result.append(impact[i] + voice + bell * tail)
    peak = max(abs(value) for value in result)
    if peak > .88:
        result = [value * (.88 / peak) for value in result]
    return result


if __name__ == "__main__":
    OUTPUT.mkdir(parents=True, exist_ok=True)
    impact, _ = stamp_impact()
    with tempfile.TemporaryDirectory(prefix="readpal-cheers-") as temp:
        tmp = Path(temp)
        for companion, settings in COMPANIONS.items():
            folder = OUTPUT / companion
            folder.mkdir(exist_ok=True)
            for slug, text in LINES:
                source, sample_rate = synthesize(settings["voice"], settings["rate"], text,
                                                 tmp, f"{companion}-{slug}")
                speech = clean_speech(source, sample_rate, settings["speed"], settings["level"], settings["rise"])
                speech = hold_final_vowel(speech, HOLD_SECONDS[slug])
                assert speech and len(speech) <= round(1.21 * RATE) + 2
                save_wav(folder / f"{slug}.wav", audition(speech, companion, impact))
                print(f"{companion:7} {text:12} voiced={len(speech)/RATE:.2f}s, clip=2.00s")
