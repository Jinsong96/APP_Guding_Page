"""Generate the reading report's ink stamp and compact completion fanfare.

Uses only the Python standard library. Run from the project root with
`python3 scripts/generate_stamp_sound.py` to regenerate the WAV asset.
The stamp lands at 0.5s; the bright original celebration takes ~1.5s after it.
Sound starts together with the CSS stamp animation in ReadingReport.
"""

import math
import random
import struct
import wave
from pathlib import Path

SAMPLE_RATE = 44100
STAMP_AT = 0.50  # The CSS stamp makes contact about 72% into its 720 ms animation.
DURATION = STAMP_AT + 1.50
OUTPUT = Path(__file__).resolve().parents[1] / "public/assets/report-stamp.wav"
rng = random.Random(807)
samples = []
noise_low = 0.0


def chime(age, frequency, final=False):
    if age < 0:
        return 0.0
    attack = min(1.0, age / 0.004)
    decay = math.exp(-(3.0 if final else 7.2) * age)
    # Bright, bouncy attacks; a longer last chord makes the payoff unmistakable.
    tone = (math.sin(2 * math.pi * frequency * age)
            + 0.32 * math.sin(2 * math.pi * 2.01 * frequency * age)
            + 0.12 * math.sin(2 * math.pi * 3.02 * frequency * age))
    return attack * decay * tone


# Two rapid upward bursts after the impact, resolving into a full C-major chord.
NOTES = (
    (0.62, 523.25, 0.30),  # C5
    (0.76, 659.25, 0.30),  # E5
    (0.90, 783.99, 0.32),  # G5
    (1.06, 1046.50, 0.38), # C6 — first lift
    (1.20, 783.99, 0.23),  # G5
    (1.32, 987.77, 0.28),  # B5
    (1.44, 1174.66, 0.33), # D6
)
FINALE = (
    (1.56, 523.25, 0.19),
    (1.56, 1046.50, 0.33),
    (1.56, 1318.51, 0.28),
    (1.56, 1568.00, 0.25),
)

for index in range(round(SAMPLE_RATE * DURATION)):
    t = index / SAMPLE_RATE
    white = rng.uniform(-1, 1)
    noise_low += 0.12 * (white - noise_low)
    paper_noise = white - noise_low

    # Inked-rubber contact: wooden thud, dry edge, then a light paper release.
    after = t - STAMP_AT
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

    celebration = sum(
        level * chime(t - onset, frequency)
        for onset, frequency, level in NOTES if t >= onset
    ) + sum(
        level * chime(t - onset, frequency, final=True)
        for onset, frequency, level in FINALE if t >= onset
    )
    # A soft upward swish and two crisp accents add excitement without another stamp.
    lift_age = t - 0.60
    lift = (0.08 * math.sin(math.pi * lift_age / 0.28) ** 2 * paper_noise
            if 0 <= lift_age <= 0.28 else 0.0)
    accents = sum(
        0.09 * math.exp(-80 * (t - onset)) * paper_noise
        for onset in (1.06, 1.56) if t >= onset
    )
    final_age = t - 1.56
    pulse = (0.18 * math.exp(-12 * final_age)
             * math.sin(2 * math.pi * 261.63 * final_age)
             if final_age >= 0 else 0.0)
    fade = min(1.0, max(0.0, (DURATION - t) / 0.22))
    samples.append(impact + (celebration + lift + accents + pulse) * fade)

peak = max(abs(sample) for sample in samples)
scale = 0.78 / peak
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(OUTPUT), "wb") as audio:
    audio.setnchannels(1)
    audio.setsampwidth(2)
    audio.setframerate(SAMPLE_RATE)
    audio.writeframes(b"".join(struct.pack("<h", round(sample * scale * 32767)) for sample in samples))

print(f"Generated {OUTPUT} ({DURATION:.2f}s)")
