---
name: my-design
description: Project aesthetic and visual identity design standards for code-as-assets. Defines the visual tone, tactile sound-designer theme, palette tokens, typography, audio visualization aesthetic, and layout structure.
---

# Design System: code-as-assets Studio

## 1. Aesthetic Thesis: Precision Hardware & Digital Laboratory
`code-as-assets` is a tactile, professional-grade workstation for game creators. The interface evokes a modern hardware synthesizer / modular studio rack combined with clean, high-density scientific instrumentation:
- **Surface**: Deep obsidian and charcoal (`#0d0f12`, `#16191f`, `#1e222b`) with subtle metallic border definitions (`#2c3240`).
- **Signal Accents**:
  - **Electric Cyan** (`#00e5ff`) - Primary audio signal, active waveforms, playback playhead.
  - **Cyber Amber / Gold** (`#ffb300` / `#ff9100`) - Pitch & modulation envelopes, frequency parameters, warm resonance indicators.
  - **Neon Emerald** (`#00e676`) - Success states, export triggers, preset saving, audio output gain.
  - **Crimson / Coral** (`#ff3d71`) - Clipping/overdrive warning, distortion, delete actions.
- **Atmosphere**: Subtle dark grid background, oscilloscope phosphor glow (box-shadow / canvas blur), precise tick marks on parameter knobs and sliders.

## 2. Typography
- **Display / Headers**: High-character technical or geometric sans-serif (e.g., Space Grotesk, Syne, or JetBrains Mono for technical labels).
- **Readouts / Values**: Strict tabular monospace (`JetBrains Mono`, `Fira Code`, or `ui-monospace`) for numerical readouts (e.g., `440.0 Hz`, `+12 st`, `350 ms`, `-3.2 dB`).
- **Labels**: Compact, uppercase or small-caps micro-typography (`text-xs font-semibold tracking-wider text-slate-400`).

## 3. Visual Layout Architecture
- **Header Rack**: Project/patch title, preset selector, randomized seed generator, master volume meter, audio engine status (ready / suspended / running).
- **Central Visualizer Stage**:
  - Live oscilloscope (time-domain waveform).
  - Frequency spectrum (FFT analyzer).
  - Interactive ADSR envelope canvas.
- **Synthesis Parameter Rack (Modular Modules)**:
  - **Generator Module**: Oscillator type (Sine, Square, Triangle, Sawtooth, White/Pink Noise, FM pair), Base Frequency, Octave, Detune.
  - **Pitch Modulation**: Frequency sweep (start, end, exponential/linear curve), Vibrato (LFO rate, depth).
  - **Envelope (ADSR)**: Attack, Decay, Sustain level, Release time, Total duration.
  - **Filter & FX**: Low-pass / High-pass / Band-pass filter, Cutoff frequency, Resonance (Q), Bitcrush / Saturation.
- **Export & Asset Station**:
  - Format toggles (OGG Vorbis, WAV 16-bit PCM, MP3).
  - Sample rate (22050 Hz for retro/low-footprint, 44100 Hz, 48000 Hz).
  - One-click audition / Loop audition / Quick download / Batch generator.

## 4. What to Avoid ("No AI Generic Slop")
- Avoid plain purple gradients on pure white or generic bland gray cards.
- Avoid standard rounded-pill generic buttons with blurry shadow blobs.
- Avoid flat, unresponsive inputs: every knob, slider, and toggle must give visual feedback (drag indicator, numeric highlight, value tooltip).
