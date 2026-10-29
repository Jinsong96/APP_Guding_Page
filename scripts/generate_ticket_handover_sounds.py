"""Generate original, animation-aligned ticket and paw sounds.

Run `python3 scripts/generate_ticket_handover_sounds.py` from the project root.
Each clip starts on its own CSS animationstart event in ReadingReport. The
contact and retreat cues use invisible CSS timing markers at the corresponding
keyframes of rj-paw-tap, not a timer measured from the beginning of issuing.
These are soft air/fur and melodic tones; the report stamp is separate.
"""

import math
import random
import struct
import wave
from pathlib import Path

RATE = 44100
OUTPUT = Path(__file__).resolve().parents[1] / "public/assets"
COMPANIONS = {
    # Three signature notes per companion; the shared stamp resolves them in C major.
    "wick": {"notes": (784.0, 1174.66, 1568.0), "timbre": "light", "air": 1.10},
    "pal": {"notes": (523.25, 659.25, 987.77), "timbre": "pluck", "air": 0.95},
    "tuanzi": {"notes": (392.0, 523.25, 783.99), "timbre": "bubble", "air": 0.85},
}


def soft_sweep(t, start, end):
    """A movement with rounded onset and release, never an impact transient."""
    if not start <= t <= end:
        return 0.0
    return math.sin(math.pi * (t - start) / (end - start)) ** 2


def airy_samples(duration, envelope):
    rng = random.Random(1207)
    fast = slow = 0.0
    samples = []
    for index in range(round(RATE * duration)):
        t = index / RATE
        white = rng.uniform(-1, 1)
        fast += 0.32 * (white - fast)
        slow += 0.018 * (white - slow)
        # Band-limited fur/air; no bass thud or sharp paper slap.
        samples.append(2.0 * (fast - slow) * envelope(t))
    return samples


def note(age, frequency, timbre):
    if age < 0:
        return 0.0
    if timbre == "light":
        attack = min(1.0, age / 0.009)
        envelope = attack * math.exp(-4.9 * age)
        tone = (math.sin(2 * math.pi * frequency * age)
                + 0.25 * math.sin(2 * math.pi * frequency * 2.08 * age)
                + 0.08 * math.sin(2 * math.pi * frequency * 3.91 * age))
    elif timbre == "pluck":
        attack = min(1.0, age / 0.006)
        envelope = attack * math.exp(-5.8 * age)
        tone = (math.sin(2 * math.pi * frequency * age)
                + 0.31 * math.sin(2 * math.pi * frequency * 2 * age)
                + 0.12 * math.sin(2 * math.pi * frequency * 3 * age))
    else:
        attack = min(1.0, age / 0.021)
        envelope = attack * math.exp(-5.0 * age)
        pitch = frequency * (0.90 + 0.10 * min(1.0, age / 0.11))
        tone = (math.sin(2 * math.pi * pitch * age)
                + 0.12 * math.sin(2 * math.pi * pitch * 2 * age))
    return envelope * tone


def write_clip(filename, samples, peak_level):
    peak = max(abs(sample) for sample in samples)
    gain = peak_level / peak
    path = OUTPUT / filename
    with wave.open(str(path), "wb") as audio:
        audio.setnchannels(1)
        audio.setsampwidth(2)
        audio.setframerate(RATE)
        audio.writeframes(b"".join(
            struct.pack("<h", round(sample * gain * 32767)) for sample in samples
        ))
    print(f"Generated {path.name} ({len(samples) / RATE:.2f}s)")


def make_movement_sounds():
    # Each duration matches its CSS animation. The ticket delivery has a slightly
    # fuller glide; release and return are quieter than the touch celebration.
    clips = (
        ("ticket-paws-deliver.wav", 0.9,
         lambda t: 0.75 * soft_sweep(t, 0.02, 0.66)
         + 0.25 * soft_sweep(t, 0.44, 0.88), 0.52),
        ("ticket-paws-release.wav", 0.42,
         lambda t: soft_sweep(t, 0.02, 0.40), 0.38),
        ("ticket-paw-approach.wav", 0.462,
         lambda t: soft_sweep(t, 0.02, 0.462), 0.52),
        ("ticket-paw-retreat.wav", 0.308,
         lambda t: soft_sweep(t, 0.0, 0.30), 0.38),
    )
    for filename, duration, envelope, peak in clips:
        write_clip(filename, airy_samples(duration, envelope), peak)


def make_contact_sound(name, settings):
    # Three ascending signature notes, each heard once. The paw touches at
    # 1.812s into issuing; this 1s cue leaves the fuller reward to the stamp.
    duration = 1.0
    brushing = airy_samples(duration, lambda t: soft_sweep(t, 0, 0.20))
    low, middle, high = settings["notes"]
    phrase = (
        (0.00, low, 0.30),
        (0.17, middle, 0.30),
        (0.36, high, 0.34),
    )
    samples = []
    for index in range(round(RATE * duration)):
        t = index / RATE
        celebration = sum(
            level * note(t - onset, frequency, settings["timbre"])
            for onset, frequency, level in phrase if t >= onset
        )
        fade = min(1.0, max(0.0, (duration - t) / 0.28))
        samples.append((0.12 * settings["air"] * brushing[index] + celebration) * fade)
    write_clip(f"ticket-handover-{name}.wav", samples, 0.72)


if __name__ == "__main__":
    OUTPUT.mkdir(parents=True, exist_ok=True)
    make_movement_sounds()
    for companion, settings in COMPANIONS.items():
        make_contact_sound(companion, settings)
