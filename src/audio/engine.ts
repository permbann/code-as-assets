import type { SoundParams } from "./types";

class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private limiter: DynamicsCompressorNode | null = null;
  private masterGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  public init(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Compressor / Peak Limiter (Protects ears & speakers from clipping)
      this.limiter = this.ctx.createDynamicsCompressor();
      this.limiter.threshold.setValueAtTime(-1.0, this.ctx.currentTime);
      this.limiter.knee.setValueAtTime(0.0, this.ctx.currentTime);
      this.limiter.ratio.setValueAtTime(20.0, this.ctx.currentTime);
      this.limiter.attack.setValueAtTime(0.001, this.ctx.currentTime);
      this.limiter.release.setValueAtTime(0.05, this.ctx.currentTime);

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

      // Analyser Node for Oscilloscope & Spectrum
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 1024;
      this.analyser.smoothingTimeConstant = 0.6;

      // Connect graph: nodes -> limiter -> masterGain -> analyser -> destination
      this.limiter.connect(this.masterGain);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Precompute 2-second white noise buffer
      const bufferSize = this.ctx.sampleRate * 2;
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    }

    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }

    return this.ctx;
  }

  public getAnalyser(): AnalyserNode | null {
    if (!this.analyser && typeof window !== "undefined") {
      this.init();
    }
    return this.analyser;
  }

  public setMasterVolume(volumePercent: number) {
    if (this.masterGain && this.ctx) {
      const vol = Math.max(0, Math.min(1, volumePercent / 100));
      this.masterGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.02);
    }
  }

  /**
   * Plays the sound effect in real time with optional pitch offset (in semitones)
   */
  public play(params: SoundParams, pitchOffsetSemitones = 0): number {
    const ctx = this.init();
    const now = ctx.currentTime;
    return this.scheduleSound(ctx, this.limiter!, now, params, pitchOffsetSemitones);
  }

  /**
   * Renders the sound patch into an offline AudioBuffer for export (WAV/OGG)
   */
  public async renderToBuffer(
    params: SoundParams,
    pitchOffsetSemitones = 0,
    sampleRate = 44100,
  ): Promise<AudioBuffer> {
    const totalDuration = Math.max(0.1, params.attack + params.decay + params.release + 0.1);
    const offlineCtx = new OfflineAudioContext(
      1,
      Math.ceil(sampleRate * totalDuration),
      sampleRate,
    );

    // Peak limiter in offline context
    const limiter = offlineCtx.createDynamicsCompressor();
    limiter.threshold.setValueAtTime(-1.0, 0);
    limiter.knee.setValueAtTime(0.0, 0);
    limiter.ratio.setValueAtTime(20.0, 0);
    limiter.attack.setValueAtTime(0.001, 0);
    limiter.release.setValueAtTime(0.05, 0);
    limiter.connect(offlineCtx.destination);

    this.scheduleSound(offlineCtx, limiter, 0, params, pitchOffsetSemitones);
    return await offlineCtx.startRendering();
  }

  private scheduleSound(
    context: BaseAudioContext,
    destination: AudioNode,
    startTime: number,
    params: SoundParams,
    pitchOffsetSemitones: number,
  ): number {
    // 1. Calculate actual starting frequency with pitch offset
    const pitchMultiplier = Math.pow(2, pitchOffsetSemitones / 12);
    const startFreq = Math.max(20, params.baseFrequency * pitchMultiplier);

    // Calculate end frequency based on pitchSlide semitones
    const slideMultiplier = Math.pow(2, params.pitchSlide / 12);
    const endFreq = Math.max(20, startFreq * slideMultiplier);

    const totalEnvelopeTime = params.attack + params.decay + params.release;
    const soundDuration = Math.max(0.05, totalEnvelopeTime);

    // 2. Filter Node
    const filter = context.createBiquadFilter();
    filter.type = params.filterType;
    filter.frequency.setValueAtTime(params.brightness, startTime);
    filter.Q.setValueAtTime(params.resonance, startTime);

    // 3. Distortion / Saturation (Grit)
    const waveshaper = context.createWaveShaper();
    if (params.grit > 0) {
      waveshaper.curve = this.makeDistortionCurve(params.grit);
      waveshaper.oversample = "4x";
    }

    // 4. Amplitude Envelope (ADSR)
    const gainNode = context.createGain();
    const targetPeak = (params.volume / 100) * 0.9;

    gainNode.gain.setValueAtTime(0.0001, startTime);
    // Attack phase
    const attackEnd = startTime + Math.max(0.001, params.attack);
    gainNode.gain.exponentialRampToValueAtTime(targetPeak, attackEnd);

    // Decay phase to sustain level
    const decayEnd = attackEnd + Math.max(0.001, params.decay);
    const sustainLevel = Math.max(0.0001, targetPeak * params.sustain);
    gainNode.gain.exponentialRampToValueAtTime(sustainLevel, decayEnd);

    // Release phase
    const releaseEnd = decayEnd + Math.max(0.001, params.release);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, releaseEnd);

    // 5. Connect Signal Chain: Source -> Waveshaper -> Filter -> Gain -> Destination
    if (params.grit > 0) {
      waveshaper.connect(filter);
    }
    filter.connect(gainNode);
    gainNode.connect(destination);

    const sourceInput: AudioNode = params.grit > 0 ? waveshaper : filter;

    // 6. Audio Generation (Noise or Oscillator)
    if (params.waveType === "noise") {
      const noiseBuffer = context.createBuffer(
        1,
        context.sampleRate * Math.ceil(soundDuration + 0.5),
        context.sampleRate,
      );
      const data = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        // Simple 1-pole lowpass to give noise texture body
        lastOut = lastOut * 0.6 + white * 0.4;
        data[i] = lastOut;
      }

      const noiseSource = context.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.connect(sourceInput);
      noiseSource.start(startTime);
      noiseSource.stop(releaseEnd + 0.05);

      // Pitch sweep on noise is applied via filter modulation
      filter.frequency.setValueAtTime(Math.min(18000, startFreq * 4), startTime);
      filter.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq * 2), decayEnd);
    } else {
      const osc = context.createOscillator();
      osc.type = params.waveType;

      // Frequency slide
      osc.frequency.setValueAtTime(startFreq, startTime);
      if (params.pitchSlideSpeed > 0 && startFreq !== endFreq) {
        const sweepDuration = Math.min(soundDuration, params.attack + params.decay);
        osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + sweepDuration);
      }

      // Wobble / Vibrato (LFO)
      if (params.wobbleSpeed > 0 && params.wobbleDepth > 0) {
        const lfo = context.createOscillator();
        const lfoGain = context.createGain();

        lfo.type = "sine";
        lfo.frequency.setValueAtTime(params.wobbleSpeed, startTime);

        // Convert semitones depth to frequency variance in Hz
        const depthHz = startFreq * (Math.pow(2, params.wobbleDepth / 12) - 1);
        lfoGain.gain.setValueAtTime(depthHz, startTime);

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        lfo.start(startTime);
        lfo.stop(releaseEnd + 0.05);
      }

      osc.connect(sourceInput);
      osc.start(startTime);
      osc.stop(releaseEnd + 0.05);
    }

    return releaseEnd - startTime;
  }

  private makeDistortionCurve(amount: number): Float32Array<ArrayBuffer> {
    const k = Math.max(1, amount * 2.5);
    const nSamples = 44100;
    const buffer = new ArrayBuffer(nSamples * Float32Array.BYTES_PER_ELEMENT);
    const curve = new Float32Array(buffer);
    const deg = Math.PI / 180;

    for (let i = 0; i < nSamples; ++i) {
      const x = (i * 2) / nSamples - 1;
      // Soft saturation sigmoid curve
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }
}

export const audioEngine = new AudioEngine();
