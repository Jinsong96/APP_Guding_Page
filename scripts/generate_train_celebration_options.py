"""Preview original, train-themed reading-completion sounds without changing the app.

Every clip is 2s: the shared stamp lands at 0.5s, then about 1.5s of
arrival-flavoured celebration. Run from the project root with
`python3 scripts/generate_train_celebration_options.py`.
"""

import math
from pathlib import Path

from generate_celebration_options import RATE, N, STAMP, load_wav, save_wav, stamp_impact

OUTPUT = Path(__file__).resolve().parents[1] / "design-previews/celebration-sounds/train"
DURATION = N / RATE


def bell(age, hz, ringing=False):
    if age < 0:
        return 0.0
    env = min(1.0, age / .004) * math.exp(-(3.2 if ringing else 6.3) * age)
    phase = 2 * math.pi * hz * age
    return env * (math.sin(phase) + .28 * math.sin(2.01 * phase)
                  + .13 * math.sin(2.72 * phase))


def pluck(age, hz, ringing=False):
    if age < 0:
        return 0.0
    env = min(1.0, age / .003) * math.exp(-(4.6 if ringing else 10.0) * age)
    phase = 2 * math.pi * hz * age
    return env * (math.sin(phase) + .17 * math.sin(2.96 * phase))


def whistle(age, start_hz, end_hz, length):
    if age < 0 or age > length:
        return 0.0
    # Short, cheerful pitch rise rather than a loud, literal train horn.
    env = max(0.0, math.sin(math.pi * age / length)) ** .85
    phase = 2 * math.pi * (start_hz * age + (end_hz - start_hz) * age * age / (2 * length))
    return env * (math.sin(phase) + .13 * math.sin(2 * phase))


# Note events: onset, frequency, strength, ring out?
OPTIONS = {
    "01-arrival-bell": {
        "bell": ((.64, 783.99, .33, False), (.88, 1046.50, .35, False),
                 (1.13, 783.99, .28, False), (1.40, 1046.50, .31, True),
                 (1.40, 1318.51, .26, True), (1.40, 1568.00, .22, True)),
        "pluck": (), "wheel": (), "whistle": (),
        "spark": ((.64, .03), (1.40, .08)),
    },
    "02-wheel-rhythm": {
        "bell": ((1.46, 1046.50, .29, True), (1.46, 1318.51, .25, True),
                 (1.46, 1568.00, .22, True)),
        "pluck": ((.67, 523.25, .28, False), (.86, 659.25, .28, False),
                  (1.04, 783.99, .31, False), (1.23, 1046.50, .31, False)),
        "wheel": ((.64, .12), (.84, .11), (1.03, .12), (1.21, .13)),
        "whistle": (), "spark": ((1.46, .08),),
    },
    "03-happy-whistle": {
        "bell": ((1.51, 1046.50, .22, True), (1.51, 1318.51, .22, True),
                 (1.51, 1568.00, .19, True)),
        "pluck": ((.68, 523.25, .14, False), (1.13, 783.99, .13, False)),
        "wheel": (),
        "whistle": ((.67, 523.25, 659.25, .36, .32),
                    (1.12, 783.99, 1046.50, .37, .43)),
        "spark": ((1.51, .07),),
    },
    "04-platform-confetti": {
        "bell": ((.63, 523.25, .26, False), (.78, 783.99, .29, False),
                 (.94, 1046.50, .31, False), (1.17, 1318.51, .32, False),
                 (1.42, 523.25, .16, True), (1.42, 1046.50, .29, True),
                 (1.42, 1318.51, .27, True), (1.42, 1568.00, .26, True)),
        "pluck": ((1.08, 783.99, .16, False),),
        "wheel": ((.64, .06), (1.42, .11)), "whistle": (),
        "spark": ((.63, .08), (.94, .09), (1.17, .08), (1.42, .14)),
    },
}


def render(spec, impact, noise, target_rms):
    samples = []
    for i in range(N):
        t = i / RATE
        music = sum(level * bell(t - at, hz, ring)
                    for at, hz, level, ring in spec["bell"] if t >= at)
        music += sum(level * pluck(t - at, hz, ring)
                     for at, hz, level, ring in spec["pluck"] if t >= at)
        music += sum(level * whistle(t - at, low, high, length)
                     for at, low, high, length, level in spec["whistle"] if t >= at)
        # Small repeated wheel joints, musical rather than realistic train rumble.
        wheels = sum(level * math.exp(-35 * (t - at))
                     * (noise[i] * .55 + math.sin(2 * math.pi * 145 * (t - at)) * .45)
                     for at, level in spec["wheel"] if t >= at)
        sparkle = sum(level * math.exp(-65 * (t - at)) * noise[i]
                      for at, level in spec["spark"] if t >= at)
        fade = min(1.0, max(0.0, (DURATION - t) / .28))
        samples.append(impact[i] + (music + wheels + sparkle) * fade)

    start = round(.62 * RATE)
    rms = math.sqrt(sum(v * v for v in samples[start:]) / (N - start))
    gain = max(.85, min(1.5, target_rms / rms))
    samples = [impact[i] + (samples[i] - impact[i]) * gain for i in range(N)]
    peak = max(abs(v) for v in samples)
    if peak > .78:
        samples = [v * .78 / peak for v in samples]
    return samples


if __name__ == "__main__":
    OUTPUT.mkdir(parents=True, exist_ok=True)
    baseline = load_wav(STAMP)
    impact, noise = stamp_impact()
    start = round(.62 * RATE)
    target_rms = math.sqrt(sum(v * v for v in baseline[start:]) / (N - start))
    for name, spec in OPTIONS.items():
        samples = render(spec, impact, noise, target_rms)
        path = OUTPUT / f"{name}.wav"
        save_wav(path, samples)
        rms = math.sqrt(sum(v * v for v in samples[start:]) / (N - start))
        print(f"{path.name}: 2.0s, celebration RMS={rms:.3f}, peak={max(abs(v) for v in samples):.3f}")
