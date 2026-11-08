export type WaveType = "sine" | "square" | "sawtooth" | "triangle" | "noise";

export type FilterType = "lowpass" | "highpass" | "bandpass";

export interface SoundParams {
  id: string;
  name: string;
  category: "laser" | "coin" | "jump" | "explosion" | "powerup" | "hit" | "synth" | "custom";

  // Core Tone / Pitch
  waveType: WaveType;
  baseFrequency: number; // In Hz (30 - 2400)
  pitchSlide: number; // Pitch sweep in semitones (-48 to +48)
  pitchSlideSpeed: number; // Speed curve factor (0.1 to 3.0)

  // Volume Envelope (Punch & Length)
  attack: number; // In seconds (0.001 - 1.0)
  decay: number; // In seconds (0.01 - 3.0)
  sustain: number; // Sustain volume level (0.0 - 1.0)
  release: number; // In seconds (0.01 - 3.0)

  // Vibrato & Wobble
  wobbleSpeed: number; // LFO speed in Hz (0 - 30)
  wobbleDepth: number; // LFO depth in semitones (0 - 24)

  // Tone Warmth & Clarity (Filter)
  brightness: number; // Cutoff frequency in Hz (200 - 18000)
  resonance: number; // Filter resonance / Q (0.1 - 20)
  filterType: FilterType;

  // Retro Grit & Distortion
  grit: number; // Distortion / saturation amount (0 - 100%)
  bitcrush: number; // Bit depth reduction (1 - 16 bits, 16 = clean)

  // Output
  volume: number; // Master patch volume (0 - 100%)
}

export interface ParameterExplainer {
  title: string;
  subtitle: string;
  plainEnglish: string;
  tip: string;
}

export const PARAM_EXPLAINERS: Record<string, ParameterExplainer> = {
  tone: {
    title: "Starting Pitch / Tone",
    subtitle: "Base Frequency (Hz)",
    plainEnglish: "Controls whether the sound starts high like a whistle or deep like a bass drum.",
    tip: "High values (>800 Hz) feel sharp or magical. Low values (<200 Hz) feel heavy and punchy.",
  },
  pitchSlide: {
    title: "Pitch Slide / Sweep",
    subtitle: "Pitch Delta (Semitones)",
    plainEnglish:
      "Slides the sound up or down as it plays. Negative values drop down; positive values shoot up.",
    tip: "Slide down for laser zaps and falling drops. Slide up for jump sounds and power-ups.",
  },
  waveShape: {
    title: "Wave Shape / Timbre",
    subtitle: "Oscillator Waveform",
    plainEnglish: "The fundamental voice texture of the sound.",
    tip: "Sine is pure & smooth. Square sounds like retro 8-bit arcade. Sawtooth is buzzy & bright. Triangle is soft. Noise is roaring static (great for explosions).",
  },
  punch: {
    title: "Punch / Snap",
    subtitle: "Attack Time (ms)",
    plainEnglish: "How instantly the sound bursts to maximum loudness.",
    tip: "Keep near 0 for immediate impact (gunshots, coin clicks). Increase to make the sound swell in gently.",
  },
  decay: {
    title: "Fade Out / Tail",
    subtitle: "Decay & Release Duration",
    plainEnglish: "How long the sound rings out before going quiet.",
    tip: "Short decay (<200ms) creates tight, snappy clicks and blips. Long decay (>1s) creates deep explosions or ambient drones.",
  },
  wobble: {
    title: "Wobble / Vibrato",
    subtitle: "Pitch Modulation (LFO)",
    plainEnglish:
      "Adds a fast or slow fluttering vibration to the pitch, like a ray-gun or trembling alarm.",
    tip: "Great for sci-fi weapons, alarms, power fields, and alien creatures.",
  },
  brightness: {
    title: "Tone Warmth / Brightness",
    subtitle: "Low-Pass Filter Cutoff",
    plainEnglish:
      "Acts like a tone control on a stereo. Lower values muffle the highs for a warm underwater thud; higher values let all the crisp sizzle through.",
    tip: "Turn down to give explosions a muffled, distant feel.",
  },
  grit: {
    title: "Retro Grit / Crunch",
    subtitle: "Distortion & Saturation",
    plainEnglish: "Overdrives the audio signal to add retro arcade crunch, dirt, and aggression.",
    tip: "Add 10-30% for analog warmth, or 70%+ for gritty industrial destruction.",
  },
};
