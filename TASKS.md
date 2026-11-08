# Project Roadmap & Task Tracking: code-as-assets

> **Strategic Governance**: All development follows [`.agents/skills/strategic/SKILL.md`](file:///.agents/skills/strategic/SKILL.md) and executes exclusively via `vp` (Vite+). Plain `npm` or `npx` commands are strictly forbidden.

---

## 📌 Phase 0: Initial Foundation & Environment Setup

- [x] **Repository Scaffold**: React 19 + TypeScript template via `vp create` with pnpm.
- [x] **Toolchain Hardening**:
  - [x] Vite+ configured with Rolldown bundling (`vp build`).
  - [x] Static analysis configured (`vp check` with Oxlint, Oxfmt, tsgolint).
  - [x] Formatter ignore rules set up for external/licensed agent skills.
- [x] **Agent Skills Integration**:
  - [x] `frontend-design`: Anthropic official licensed design skill installed unaltered.
  - [x] `strategic`: Strategic execution & boundary enforcement tailored for asset generation.
  - [x] `my-design`: Digital hardware studio theme, dark obsidian palette, signal color tokens.
  - [x] `ui-design`: Tactile audio control ergonomics, safety limiters, export workflows.
- [x] **Governance**: `AGENTS.md` and `agents.md` established.

---

## 🚀 Phase 1: Sound Effect Synthesizer POC (Complete)

### Milestone 1.1: Audio Synthesis Core (`src/audio/`)

- [x] Implement `AudioEngine` singleton managing Web Audio `AudioContext` and safety limiter node (`DynamicsCompressorNode`).
- [x] Implement parametric sound patch data model (`SoundParams`) with beginner-friendly descriptions and game dev tips.
- [x] Multi-waveform oscillator support: Sine, Triangle, Sawtooth, Square, and filtered White/Pink Noise.
- [x] Frequency & pitch sweeps with customizable semitones and curve speeds.
- [x] LFO Vibrato / Wobble modulation (rate & depth).
- [x] 4-stage ADSR volume envelope (Attack, Decay, Sustain, Release).
- [x] Biquad filter (Low-pass, High-pass, Band-pass) with resonance (Q) and cutoff controls.
- [x] Retro grit & distortion waveshaper with oversampling.
- [x] Offline rendering pipeline via `OfflineAudioContext` for rendering high-precision `AudioBuffer` for instant export.

### Milestone 1.2: Game Asset Export Engine (`src/export/`)

- [x] **WAV PCM Exporter** (`src/export/wavEncoder.ts`):
  - Standard uncompressed 16-bit integer PCM WAV encoder.
  - Zero-latency game engine asset generation (Unity, Godot, Unreal, Web).
- [x] **OGG Vorbis Exporter** (`src/export/oggEncoder.ts`):
  - In-browser MediaRecorder compressed audio stream exporter (.ogg / .webm).
- [x] **Data Export Utilities** (`src/export/codeExport.ts`):
  - Export as Base64 Data URI (instant game/web prototyping).
  - Export as standalone code snippet (pure Web Audio API script to run without asset files).

### Milestone 1.3: Studio User Interface (`src/components/`)

- [x] **Tactile Studio Workstation Layout** (aligned with `my-design` and `ui-design`):
  - Header: Studio title, master volume safety limiter, Spacebar audition trigger, quick export launcher.
  - Real-time Visualizer: Canvas-based Oscilloscope with live waveform drawing and phosphor glow.
  - Pitch Audition Strip: 7 interactive pitch pads to test the effect at different musical pitches (-12st to +12st).
  - Beginner-Friendly Parameter Controls: Plain-English names, technical subtitles, and hover tooltips.
  - Mode Switcher: "Simple Controls" for accessible editing vs "Advanced Rack" for full DSP parameter access.
  - Export Modal: 1-click WAV / OGG download, Base64 copy, and runtime code snippet copy.

### Milestone 1.4: Preset Library & Randomizer (`src/audio/presets.ts`)

- [x] Built-in game sound archetypes:
  - _Laser Zap_: Fast exponential pitch drop.
  - _Coin Pickup_: Bright two-tone chime.
  - _8-Bit Jump_: Rising pitch sweep.
  - _Heavy Explosion_: Filtered noise burst with deep rumble.
  - _Power-up Rise_: Multi-step rising frequency sweep.
  - _Impact / Hurt_: Sharp square wave with rapid decay and crunch.
  - _Sci-Fi Wobble_: Resonant bandpass filter with LFO vibrato.
  - _Crisp UI Click_: High-frequency micro-click.
- [x] "Mutate" button to nudge current sound parameters slightly for easy variations.
- [x] "Roll Random" generator for one-click sound creation.

---

## 🔮 Phase 2: Sound Design Expansion (Upcoming)

- [ ] Polyphonic layering (dual oscillator blending: sub-bass + noisy attack transient).
- [ ] Wavetable synthesis for complex vocal / metallic game sound effects.
- [ ] Pitch envelope curve editor (interactive graphical bezier editor).
- [ ] Batch asset export (generate a set of 5-10 related SFX variations in a single ZIP).
- [ ] Project save / load (local storage or JSON patch file).
