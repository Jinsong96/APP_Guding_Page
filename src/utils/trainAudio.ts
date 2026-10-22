// Web Audio API Train Sound Synthesizer - Calm Reading Companion Edition
// Tailored for ReadPal: soothing, warm, low-volume, slow & steady glide like a night train smoothly pulling into the station.

class TrainAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private activeNodes: AudioNode[] = [];

  private getContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAll();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public stopAll() {
    this.activeNodes.forEach(node => {
      try {
        if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          (node as AudioScheduledSourceNode).stop();
        }
        node.disconnect();
      } catch {
        // ignore cleanup
      }
    });
    this.activeNodes = [];
  }

  /**
   * Plays a calm, gentle station arrival sequence (~2.3 seconds)
   * Smooth, steady deceleration with warm, peaceful harmonics fitting a bedtime reading companion.
   */
  public playTrainSequence(durationSec = 2.4) {
    if (this.isMuted) return;

    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      this.stopAll();

      // Master output with warm analog low-pass filter to prevent any harshness
      const masterFilter = ctx.createBiquadFilter();
      masterFilter.type = 'lowpass';
      masterFilter.frequency.setValueAtTime(1400, now);
      masterFilter.Q.setValueAtTime(0.7, now);

      const masterGain = ctx.createGain();
      // Low, gentle volume fitting companion reading ambience (0.16 max)
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.linearRampToValueAtTime(0.16, now + 0.15);
      masterGain.gain.setValueAtTime(0.16, now + durationSec - 0.4);
      masterGain.gain.linearRampToValueAtTime(0.0001, now + durationSec);

      masterFilter.connect(masterGain);
      masterGain.connect(ctx.destination);
      this.activeNodes.push(masterGain, masterFilter);

      // Reverb/Delay unit for cozy nighttime valley echo
      const delay = ctx.createDelay();
      delay.delayTime.setValueAtTime(0.18, now);
      const delayFeedback = ctx.createGain();
      delayFeedback.gain.setValueAtTime(0.22, now);
      const delayFilter = ctx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.setValueAtTime(900, now);

      delay.connect(delayFilter);
      delayFilter.connect(delayFeedback);
      delayFeedback.connect(delay);
      delayFilter.connect(masterFilter);
      this.activeNodes.push(delay, delayFeedback, delayFilter);

      // 1. Soft, mellow night whistle (warm flute-like station arrival greeting)
      this.playGentleWhistle(ctx, masterFilter, delay, now, durationSec);

      // 2. Slow, steady gliding wheel clicks & gentle track resonance
      this.playSteadyGlides(ctx, masterFilter, now, durationSec);

      // 3. Calming air-brake steam sigh (peaceful arrival settling)
      this.playCalmSteamSigh(ctx, masterFilter, now, durationSec);

      // Automatic node cleanup
      setTimeout(() => {
        this.stopAll();
      }, (durationSec + 0.4) * 1000);
    } catch (e) {
      console.warn('Audio playback not permitted or supported:', e);
    }
  }

  /**
   * Warm, mellow flute-like whistle chord (soft station arrival chime)
   */
  private playGentleWhistle(
    ctx: AudioContext,
    destination: AudioNode,
    echoDest: AudioNode,
    now: number,
    duration: number
  ) {
    // Warm, tranquil major chord: F4 (349.2Hz) + A4 (440.0Hz) + C5 (523.3Hz)
    // Low, soothing register, evocative of a calm storybook train
    const chordFreqs = [349.23, 440.0, 523.25];

    // Gentle 4.2Hz breath vibrato (very subtle)
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(4.2, now);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(3.2, now);
    lfo.connect(lfoGain);
    this.activeNodes.push(lfo, lfoGain);

    const whistleGain = ctx.createGain();
    // Gentle attack, sustained warm chime, smooth fade
    whistleGain.gain.setValueAtTime(0.0001, now);
    whistleGain.gain.linearRampToValueAtTime(0.18, now + 0.35); // soft slow swell
    whistleGain.gain.setValueAtTime(0.18, now + 1.2);
    whistleGain.gain.exponentialRampToValueAtTime(0.0001, now + Math.min(duration - 0.2, 1.9));

    whistleGain.connect(destination);
    whistleGain.connect(echoDest);
    this.activeNodes.push(whistleGain);

    chordFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      // Sine wave gives a pure, gentle bell/flute timbre without harsh overtones
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      lfoGain.connect(osc.frequency);

      // Relative balance between notes for harmonic warmth
      const noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(idx === 0 ? 0.9 : 0.65, now);
      osc.connect(noteGain);
      noteGain.connect(whistleGain);

      osc.start(now);
      osc.stop(now + duration);
      this.activeNodes.push(osc, noteGain);
    });

    lfo.start(now);
    lfo.stop(now + duration);

    // Warm, airy breathiness layered softly under the whistle
    const noiseBuffer = this.createNoiseBuffer(ctx, 2.0);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1100, now);
    noiseFilter.Q.setValueAtTime(3.5, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.linearRampToValueAtTime(0.045, now + 0.35);
    noiseGain.gain.setValueAtTime(0.045, now + 1.1);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(destination);

    noiseSource.start(now);
    noiseSource.stop(now + 1.9);
    this.activeNodes.push(noiseSource, noiseFilter, noiseGain);
  }

  /**
   * Slow, steady wheel glide on rails (peaceful rhythmic arrival clicks)
   */
  private playSteadyGlides(ctx: AudioContext, destination: AudioNode, now: number, _duration: number) {
    // Steady, gradually decelerating rhythm: 0.2s, 0.72s, 1.3s, 1.95s
    // Spaced out ~0.55s - 0.65s intervals, gentle and slow
    const glideTimings = [0.2, 0.72, 1.3, 1.92];

    glideTimings.forEach((tOffset, i) => {
      const t = now + tOffset;
      // Gently decreasing volume as the train eases to rest
      const vol = Math.max(0.04, 0.09 - i * 0.015);

      // Soft filtered rail whisper (pink noise burst)
      const buffer = this.createNoiseBuffer(ctx, 0.16);
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750 - i * 50, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(destination);

      noise.start(t);
      noise.stop(t + 0.16);
      this.activeNodes.push(noise, filter, gain);

      // Subtle warm low track contact resonance (wooden tie & steel track clack)
      const thud = ctx.createOscillator();
      thud.type = 'triangle';
      thud.frequency.setValueAtTime(110, t);
      thud.frequency.exponentialRampToValueAtTime(65, t + 0.05);

      const thudGain = ctx.createGain();
      thudGain.gain.setValueAtTime(vol * 0.65, t);
      thudGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

      thud.connect(thudGain);
      thudGain.connect(destination);

      thud.start(t);
      thud.stop(t + 0.06);
      this.activeNodes.push(thud, thudGain);
    });
  }

  /**
   * Soothing air-brake steam sigh as the train smoothly settles at the station
   */
  private playCalmSteamSigh(ctx: AudioContext, destination: AudioNode, now: number, _duration: number) {
    const t = now + 1.25; // gently begins as train reaches station landing
    const sighBuffer = this.createNoiseBuffer(ctx, 1.1);
    const sighSource = ctx.createBufferSource();
    sighSource.buffer = sighBuffer;

    const sighFilter = ctx.createBiquadFilter();
    sighFilter.type = 'bandpass';
    sighFilter.frequency.setValueAtTime(680, t);
    sighFilter.frequency.exponentialRampToValueAtTime(320, t + 0.9);
    sighFilter.Q.setValueAtTime(1.8, t);

    const sighGain = ctx.createGain();
    sighGain.gain.setValueAtTime(0.0001, t);
    sighGain.gain.linearRampToValueAtTime(0.055, t + 0.2); // soft sigh
    sighGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.05);

    sighSource.connect(sighFilter);
    sighFilter.connect(sighGain);
    sighGain.connect(destination);

    sighSource.start(t);
    sighSource.stop(t + 1.1);
    this.activeNodes.push(sighSource, sighFilter, sighGain);
  }

  private createNoiseBuffer(ctx: AudioContext, durationSeconds: number): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * durationSeconds);
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    // Pink noise filtering for warm, soft texture
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.04 * white) / 1.04;
      lastOut = data[i];
      data[i] *= 2.8; // gain normalization
    }
    return buffer;
  }
}

export const trainAudio = new TrainAudioEngine();
