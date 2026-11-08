import type { SoundParams } from "./types";

export const PRESET_LIBRARY: SoundParams[] = [
  {
    id: "laser_zap",
    name: "Laser Zap",
    category: "laser",
    waveType: "sawtooth",
    baseFrequency: 880,
    pitchSlide: -24,
    pitchSlideSpeed: 1.5,
    attack: 0.005,
    decay: 0.18,
    sustain: 0.0,
    release: 0.05,
    wobbleSpeed: 0,
    wobbleDepth: 0,
    brightness: 8000,
    resonance: 3.5,
    filterType: "lowpass",
    grit: 15,
    bitcrush: 16,
    volume: 85,
  },
  {
    id: "coin_pickup",
    name: "Coin Pickup",
    category: "coin",
    waveType: "sine",
    baseFrequency: 987, // B5
    pitchSlide: 12,
    pitchSlideSpeed: 0.8,
    attack: 0.002,
    decay: 0.25,
    sustain: 0.1,
    release: 0.1,
    wobbleSpeed: 18,
    wobbleDepth: 2,
    brightness: 12000,
    resonance: 1.0,
    filterType: "lowpass",
    grit: 0,
    bitcrush: 16,
    volume: 90,
  },
  {
    id: "arcade_jump",
    name: "8-Bit Jump",
    category: "jump",
    waveType: "square",
    baseFrequency: 160,
    pitchSlide: 18,
    pitchSlideSpeed: 1.2,
    attack: 0.01,
    decay: 0.22,
    sustain: 0.05,
    release: 0.08,
    wobbleSpeed: 0,
    wobbleDepth: 0,
    brightness: 6000,
    resonance: 2.0,
    filterType: "lowpass",
    grit: 10,
    bitcrush: 12,
    volume: 85,
  },
  {
    id: "heavy_explosion",
    name: "Heavy Explosion",
    category: "explosion",
    waveType: "noise",
    baseFrequency: 90,
    pitchSlide: -18,
    pitchSlideSpeed: 1.0,
    attack: 0.01,
    decay: 0.85,
    sustain: 0.1,
    release: 0.4,
    wobbleSpeed: 4,
    wobbleDepth: 6,
    brightness: 1800,
    resonance: 4.0,
    filterType: "lowpass",
    grit: 55,
    bitcrush: 8,
    volume: 95,
  },
  {
    id: "powerup_rise",
    name: "Power-up Rise",
    category: "powerup",
    waveType: "sawtooth",
    baseFrequency: 220,
    pitchSlide: 28,
    pitchSlideSpeed: 0.9,
    attack: 0.02,
    decay: 0.45,
    sustain: 0.3,
    release: 0.15,
    wobbleSpeed: 12,
    wobbleDepth: 4,
    brightness: 9500,
    resonance: 2.5,
    filterType: "lowpass",
    grit: 5,
    bitcrush: 16,
    volume: 80,
  },
  {
    id: "damage_impact",
    name: "Impact / Hurt",
    category: "hit",
    waveType: "square",
    baseFrequency: 240,
    pitchSlide: -14,
    pitchSlideSpeed: 2.0,
    attack: 0.003,
    decay: 0.14,
    sustain: 0.0,
    release: 0.04,
    wobbleSpeed: 0,
    wobbleDepth: 0,
    brightness: 4500,
    resonance: 5.0,
    filterType: "lowpass",
    grit: 40,
    bitcrush: 10,
    volume: 90,
  },
  {
    id: "alien_chatter",
    name: "Sci-Fi Wobble",
    category: "synth",
    waveType: "triangle",
    baseFrequency: 440,
    pitchSlide: 0,
    pitchSlideSpeed: 1.0,
    attack: 0.05,
    decay: 0.6,
    sustain: 0.4,
    release: 0.2,
    wobbleSpeed: 16,
    wobbleDepth: 14,
    brightness: 7000,
    resonance: 8.0,
    filterType: "bandpass",
    grit: 20,
    bitcrush: 16,
    volume: 85,
  },
  {
    id: "ui_click",
    name: "Crisp UI Click",
    category: "custom",
    waveType: "sine",
    baseFrequency: 1200,
    pitchSlide: -6,
    pitchSlideSpeed: 2.5,
    attack: 0.001,
    decay: 0.04,
    sustain: 0.0,
    release: 0.01,
    wobbleSpeed: 0,
    wobbleDepth: 0,
    brightness: 14000,
    resonance: 0.5,
    filterType: "lowpass",
    grit: 0,
    bitcrush: 16,
    volume: 75,
  },
];

export function getRandomElement<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

export function generateRandomSFX(category?: SoundParams["category"]): SoundParams {
  const chosenCat =
    category ||
    getRandomElement<SoundParams["category"]>([
      "laser",
      "coin",
      "jump",
      "explosion",
      "powerup",
      "hit",
      "synth",
    ]);

  const waves: SoundParams["waveType"][] = ["sine", "square", "sawtooth", "triangle", "noise"];

  let waveType = getRandomElement(waves);
  let baseFreq = Math.round(100 + Math.random() * 1200);
  let pitchSlide = Math.round((Math.random() - 0.5) * 48);
  let attack = 0.002 + Math.random() * 0.05;
  let decay = 0.05 + Math.random() * 0.5;
  let wobbleSpeed = Math.random() > 0.6 ? Math.round(Math.random() * 20) : 0;
  let wobbleDepth = wobbleSpeed > 0 ? Math.round(1 + Math.random() * 12) : 0;
  let grit = Math.random() > 0.5 ? Math.round(Math.random() * 40) : 0;
  let brightness = Math.round(2000 + Math.random() * 10000);

  if (chosenCat === "laser") {
    waveType = getRandomElement(["sawtooth", "square"]);
    baseFreq = 600 + Math.random() * 1000;
    pitchSlide = -16 - Math.random() * 24;
    decay = 0.08 + Math.random() * 0.2;
  } else if (chosenCat === "explosion") {
    waveType = "noise";
    baseFreq = 60 + Math.random() * 80;
    pitchSlide = -12 - Math.random() * 16;
    decay = 0.4 + Math.random() * 0.8;
    grit = 30 + Math.random() * 40;
    brightness = 1000 + Math.random() * 2500;
  } else if (chosenCat === "coin") {
    waveType = getRandomElement(["sine", "triangle"]);
    baseFreq = 800 + Math.random() * 600;
    pitchSlide = 8 + Math.random() * 16;
    decay = 0.15 + Math.random() * 0.25;
  } else if (chosenCat === "jump") {
    waveType = getRandomElement(["square", "triangle"]);
    baseFreq = 140 + Math.random() * 150;
    pitchSlide = 12 + Math.random() * 20;
    decay = 0.15 + Math.random() * 0.25;
  } else if (chosenCat === "hit") {
    waveType = getRandomElement(["square", "noise"]);
    baseFreq = 180 + Math.random() * 200;
    pitchSlide = -8 - Math.random() * 20;
    decay = 0.06 + Math.random() * 0.15;
    grit = 25 + Math.random() * 40;
  }

  return {
    id: `random_${Date.now()}`,
    name: `Random ${chosenCat.toUpperCase()}`,
    category: chosenCat,
    waveType,
    baseFrequency: Math.round(baseFreq),
    pitchSlide: Math.round(pitchSlide),
    pitchSlideSpeed: Number((0.6 + Math.random() * 1.5).toFixed(2)),
    attack: Number(attack.toFixed(3)),
    decay: Number(decay.toFixed(2)),
    sustain: Number((Math.random() * 0.2).toFixed(2)),
    release: Number((0.02 + Math.random() * 0.15).toFixed(2)),
    wobbleSpeed,
    wobbleDepth,
    brightness,
    resonance: Number((1 + Math.random() * 4).toFixed(1)),
    filterType: "lowpass",
    grit,
    bitcrush: 16,
    volume: 85,
  };
}

export function mutateSound(current: SoundParams): SoundParams {
  const nudge = (val: number, percent: number, min: number, max: number) => {
    const delta = val * percent * (Math.random() * 2 - 1);
    return Math.max(min, Math.min(max, Math.round(val + delta)));
  };

  return {
    ...current,
    id: `mutated_${Date.now()}`,
    name: `${current.name} (Tweaked)`,
    baseFrequency: nudge(current.baseFrequency, 0.15, 40, 2400),
    pitchSlide: Math.max(
      -48,
      Math.min(48, Math.round(current.pitchSlide + (Math.random() * 6 - 3))),
    ),
    decay: Number(
      Math.max(0.02, Math.min(3.0, current.decay + (Math.random() * 0.1 - 0.05))).toFixed(2),
    ),
    grit: Math.max(0, Math.min(100, Math.round(current.grit + (Math.random() * 20 - 10)))),
    brightness: nudge(current.brightness, 0.2, 300, 16000),
  };
}
