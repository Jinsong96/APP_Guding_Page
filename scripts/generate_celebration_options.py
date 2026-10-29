"""Make five comparable 2-second stamp/celebration previews, without changing the app.

The first 0.5s and ink-stamp hit are identical in every option. Each original
celebration occupies about 1.5s after the hit. Option A copies the live asset.
Run `python3 scripts/generate_celebration_options.py` from the project root.
"""

import math
import random
import struct
import wave
from pathlib import Path

RATE = 44100
DURATION = 2.0
N = round(RATE * DURATION)
ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "design-previews/celebration-sounds"
STAMP = ROOT / "public/assets/report-stamp.wav"


def load_wav(path):
    with wave.open(str(path)) as audio:
        assert audio.getframerate() == RATE and audio.getnchannels() == 1
        assert audio.getnframes() == N
        data = audio.readframes(N)
    return [v / 32768 for v in struct.unpack(f"<{N}h", data)]


def save_wav(path, samples):
    with wave.open(str(path), "wb") as audio:
        audio.setparams((1, 2, RATE, N, "NONE", "not compressed"))
        audio.writeframes(struct.pack(
            f"<{N}h", *(round(max(-1, min(1, value)) * 32767) for value in samples)
        ))


def stamp_impact():
    """Same dry stamp source and random seed as generate_stamp_sound.py."""
    rng = random.Random(807)
    noise_low = 0.0
    raw = []
    noise = []
    for i in range(N):
        t = i / RATE
        white = rng.uniform(-1, 1)
        noise_low += 0.12 * (white - noise_low)
        paper_noise = white - noise_low
        noise.append(paper_noise)
        after = t - 0.50
        impact = 0.0
        if after >= 0:
            attack = min(1.0, after / 0.006)
            pitch = 115 - 45 * min(after / 0.22, 1)
            thud = 0.46 * attack * math.exp(-15 * after) * math.sin(2 * math.pi * pitch * after)
            edge = 0.3 * attack * math.exp(-45 * after) * paper_noise
            texture = 0.24 * attack * math.exp(-17 * after) * (noise_low + 0.35 * paper_noise)
            release_at = after - 0.18
            release = 0.0
            if 0 <= release_at < 0.5:
                release = 0.055 * math.sin(math.pi * release_at / 0.5) ** 2 * paper_noise
            impact = thud + edge + texture + release
        raw.append(impact)
    # Match the currently shipped stamp's exact attack loudness for fair comparison.
    baseline = load_wav(STAMP)
    early = slice(round(.5 * RATE), round(.62 * RATE))
    scale = max(abs(v) for v in baseline[early]) / max(abs(v) for v in raw[early])
    return [v * scale for v in raw], noise


def tone(kind, age, frequency, final):
    if age < 0:
        return 0.0
    phase = 2 * math.pi * frequency * age
    if kind == "marimba":
        env = min(1, age / .003) * math.exp(-(5.8 if final else 10.0) * age)
        return env * (math.sin(phase) + .20 * math.sin(2.99 * phase) + .07 * math.sin(4.05 * phase))
    if kind == "star":
        env = min(1, age / .005) * math.exp(-(3.7 if final else 5.4) * age)
        return env * (math.sin(phase) + .32 * math.sin(2.01 * phase)
                      + .14 * math.sin(2.72 * phase) + .06 * math.sin(4.11 * phase))
    if kind == "horn":
        env = min(1, age / .014) * math.exp(-(3.6 if final else 6.1) * age)
        return env * (math.sin(phase) + .43 * math.sin(2 * phase)
                      + .19 * math.sin(3 * phase) + .07 * math.sin(4 * phase))
    # Game-like rounded triangle, rather than a loud raw square wave.
    env = min(1, age / .002) * math.exp(-(4.3 if final else 8.0) * age)
    triangle = 2 / math.pi * math.asin(math.sin(phase))
    return env * (triangle + .17 * math.sin(2 * phase))


# onset, Hz, relative strength, last/chord note
OPTIONS = {
    "b-candy-bounce": {
        "kind": "marimba",
        "events": ((.63, 523.25, .33, False), (.79, 659.25, .30, False),
                   (.95, 783.99, .36, False), (1.12, 1046.50, .38, False),
                   (1.32, 783.99, .23, False), (1.49, 523.25, .18, True),
                   (1.49, 1046.50, .30, True), (1.49, 1318.51, .26, True)),
        "clicks": ((.63, .06), (.95, .07), (1.49, .10)),
        "bass": ((.95, 261.63, .12), (1.49, 261.63, .18)),
        "echo": 0,
    },
    "c-starlight": {
        "kind": "star",
        "events": ((.64, 783.99, .26, False), (.78, 1046.50, .28, False),
                   (.92, 1318.51, .28, False), (1.08, 1568.00, .30, False),
                   (1.28, 1046.50, .20, False), (1.48, 523.25, .12, True),
                   (1.48, 1046.50, .25, True), (1.48, 1318.51, .20, True),
                   (1.48, 1568.00, .23, True)),
        "clicks": ((.64, .025), (1.08, .035), (1.48, .055)),
        "bass": ((1.48, 261.63, .11),),
        "echo": .10,
    },
    "d-little-fanfare": {
        "kind": "horn",
        "events": ((.67, 392.00, .32, False), (.86, 523.25, .34, False),
                   (1.05, 659.25, .35, False), (1.26, 783.99, .40, False),
                   (1.51, 523.25, .19, True), (1.51, 659.25, .23, True),
                   (1.51, 783.99, .22, True), (1.51, 1046.50, .24, True)),
        "clicks": ((.67, .05), (1.26, .06), (1.51, .07)),
        "bass": ((.67, 196.00, .10), (1.51, 261.63, .18)),
        "echo": 0,
    },
    "e-level-up": {
        "kind": "game",
        "events": ((.63, 523.25, .27, False), (.77, 587.33, .25, False),
                   (.90, 659.25, .27, False), (1.04, 783.99, .30, False),
                   (1.19, 1046.50, .33, False), (1.37, 783.99, .19, False),
                   (1.53, 523.25, .13, True), (1.53, 1046.50, .27, True),
                   (1.53, 1318.51, .23, True), (1.53, 1568.00, .21, True)),
        "clicks": ((.63, .07), (1.04, .08), (1.53, .10)),
        "bass": ((1.04, 261.63, .11), (1.53, 261.63, .18)),
        "echo": 0,
    },
}


def make_option(spec, impact, noise):
    events = spec["events"]
    kind = spec["kind"]
    echo = spec["echo"]
    samples = []
    for i in range(N):
        t = i / RATE
        sound = sum(level * tone(kind, t - onset, hz, final)
                    for onset, hz, level, final in events if t >= onset)
        if echo:
            sound += sum(.18 * level * tone(kind, t - onset - echo, hz, True)
                         for onset, hz, level, _ in events if t >= onset + echo)
        clicks = sum(level * math.exp(-82 * (t - onset)) * noise[i]
                     for onset, level in spec["clicks"] if t >= onset)
        bass = sum(level * math.exp(-10 * (t - onset))
                   * math.sin(2 * math.pi * hz * (t - onset))
                   for onset, hz, level in spec["bass"] if t >= onset)
        fade = min(1, max(0, (DURATION - t) / .24))
        samples.append(impact[i] + (sound + clicks + bass) * fade)

    # Similar perceived loudness to the live option, without changing the stamp hit.
    start = round(.62 * RATE)
    current = load_wav(STAMP)
    target = math.sqrt(sum(v * v for v in current[start:]) / (N - start))
    actual = math.sqrt(sum(v * v for v in samples[start:]) / (N - start))
    gain = max(.82, min(1.30, target / actual))
    samples = [impact[i] + (samples[i] - impact[i]) * gain for i in range(N)]
    # Only guard against clipping; never boost the whole waveform.
    peak = max(abs(v) for v in samples)
    if peak > .78:
        samples = [v * .78 / peak for v in samples]
    return samples


if __name__ == "__main__":
    OUTPUT.mkdir(parents=True, exist_ok=True)
    baseline = load_wav(STAMP)
    save_wav(OUTPUT / "a-current.wav", baseline)
    impact, noise = stamp_impact()
    for name, specification in OPTIONS.items():
        samples = make_option(specification, impact, noise)
        save_wav(OUTPUT / f"{name}.wav", samples)
        start = round(.62 * RATE)
        rms = math.sqrt(sum(v * v for v in samples[start:]) / (N - start))
        print(f"{name}: 2.0s, celebration RMS={rms:.3f}, peak={max(abs(v) for v in samples):.3f}")
