"""Generate gentle, original train-arrival audio matched to both launch videos.

Run `python3 scripts/generate_start_train_sounds.py` from the project root.
The wheel rhythm and soft whistle follow the approach; the airy brake settles
with the last video frame. No stamp/bell sounds are reused here.
"""

import math
import random
import struct
import wave
from pathlib import Path

RATE = 32000
OUTPUT = Path(__file__).resolve().parents[1] / "public/assets"
# Durations from the videos' MP4 movie headers (seconds).
CLIPS = {"night": 6.584, "day": 3.267}


def smoothstep(edge0, edge1, value):
    x = max(0.0, min(1.0, (value - edge0) / (edge1 - edge0)))
    return x * x * (3 - 2 * x)


def arrival_sound(duration, seed):
    rng = random.Random(seed)
    low_noise = air_noise = 0.0
    samples = []
    # Wheel joints are rhythmic, but slow and soft rather than a sharp click track.
    joints = [duration * (0.13 + i * 0.055) for i in range(12)]
    for index in range(round(duration * RATE)):
        t = index / RATE
        u = t / duration
        white = rng.uniform(-1, 1)
        low_noise += 0.018 * (white - low_noise)
        air_noise += 0.22 * (white - air_noise)

        approach = smoothstep(0.0, 0.18, u) * (1 - smoothstep(0.66, 0.98, u))
        rumble = approach * (0.15 * low_noise + 0.035 * math.sin(2 * math.pi * 49 * t))
        wheels = 0.0
        for joint in joints:
            age = t - joint
            if 0 <= age < 0.15:
                wheels += (0.045 * math.exp(-32 * age)
                           * (math.sin(2 * math.pi * 173 * age)
                              + 0.28 * math.sin(2 * math.pi * 311 * age)))
        wheels *= approach

        whistle_env = smoothstep(0.19, 0.25, u) * (1 - smoothstep(0.47, 0.57, u))
        vibrato = 1.8 * math.sin(2 * math.pi * 4.3 * t)
        whistle = whistle_env * (
            0.115 * math.sin(2 * math.pi * 392 * t + vibrato * 0.06)
            + 0.08 * math.sin(2 * math.pi * 494 * t + vibrato * 0.05)
            + 0.025 * math.sin(2 * math.pi * 784 * t)
        )
        # A diffuse steam/brake release instead of an impact when the engine stops.
        brake = (smoothstep(0.68, 0.79, u) * (1 - smoothstep(0.86, 1.0, u)))
        hiss = brake * 0.16 * (air_noise - low_noise)
        fade = smoothstep(0.0, 0.04, u) * (1 - smoothstep(0.96, 1.0, u))
        samples.append((rumble + wheels + whistle + hiss) * fade)

    # Leave ample headroom so the arrival stays gentler than the completion bell.
    peak = max(abs(sample) for sample in samples)
    return [sample * min(1.0, 0.58 / peak) for sample in samples]


def write_wav(path, samples):
    with wave.open(str(path), "wb") as audio:
        audio.setparams((1, 2, RATE, len(samples), "NONE", "not compressed"))
        audio.writeframes(struct.pack(
            f"<{len(samples)}h",
            *(round(max(-1, min(1, sample)) * 32767) for sample in samples)
        ))


if __name__ == "__main__":
    for mode, seconds in CLIPS.items():
        path = OUTPUT / f"start-train-arrival-{mode}.wav"
        write_wav(path, arrival_sound(seconds, 1357 if mode == "night" else 2468))
        print(f"Generated {path.name} ({seconds:.3f}s)")
