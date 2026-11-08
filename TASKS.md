# Project Roadmap & Task Tracking: code-as-assets

> **Strategic Governance**: All development follows `.agents/skills/strategic/SKILL.md` and executes exclusively via `vp` (Vite+). Plain `npm` or `npx` commands are strictly forbidden.

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

## 🚀 Phase 1: Sound Effect Synthesizer POC (Current Sprint)

### Milestone 1.1: Audio Synthesis Core (`src/audio/`)

- [ ] Implement `AudioEngine` singleton managing `AudioContext` and safety limiter node (`DynamicsCompressorNode`).
- [ ] Implement parametric sound patch data model (`SoundPatch`):
  - Oscillator types: Sine, Triangle, Sawtooth, Square, Pulse/PWM, Noise (White, Pink).
  - Frequency & Pitch Sweep: `startFreq`, `endFreq`, `sweepCurve` (exponential/linear), `pitchModulation` (vibrato rate & depth).
  - Envelopes: ADSR (Attack, Decay, Sustain level, Release time) for Amplitude and Filter Cutoff.
  - Filter: BiquadFilter (Lowpass, Highpass, Bandpass) with Cutoff & Resonance (Q).
  - FX: Overdrive/Distortion curve, bitcrusher.
- [ ] Offline rendering pipeline via `OfflineAudioContext` for rendering high-precision `AudioBuffer` at custom sample rates (22050, 44100, 48000 Hz).

### Milestone 1.2: Game Asset Export Engine (`src/export/`)

- [ ] **WAV PCM Exporter**:
  - Uncompressed 16-bit / 24-bit integer PCM WAV encoder.
  - Zero-latency game engine asset generation (Unity, Godot, Unreal, Web).
- [ ] **OGG Vorbis Exporter**:
  - Vorbis encoder integration (via WebAssembly or Web Worker) for compressed loopable game audio.
  - Support loop point metadata tags if needed.
- [ ] **Data Export Utilities**:
  - Export as Base64 Data URI (instant game/web prototyping).
  - Export as standalone code snippet (Web Audio API synthesis script to run without asset files).

### Milestone 1.3: Studio User Interface (`src/components/`)

- [ ] **Modular Rack Layout** (aligned with `my-design` and `ui-design`):
  - Header: Patch name, preset category, master volume meter, audio engine toggle.
  - Real-time Visualizer: Canvas-based Oscilloscope (waveform) and frequency spectrum analyzer.
  - Interactive ADSR Canvas: Draggable curve handles for attack, decay, sustain, release.
  - Rotary Knobs & Sliders: Vertical-drag knobs with `Shift` for fine-tuning and double-click to reset.
  - Quick Audition Bar: Spacebar trigger, mini chromatic audition keyboard (test pitch scaling).
  - Export Station: Format selector (OGG / WAV), sample rate selector, "Download SFX" button.

### Milestone 1.4: Preset Library & Randomizer

- [ ] Built-in game sound archetypes:
  - _Laser / Blaster_: High-to-low fast exponential frequency drop.
  - _Explosion_: Filtered noise burst with heavy decay.
  - _Jump / Bounce_: Low-to-high pitch sweep.
  - _Coin / Pickup_: Two-tone arpeggio with high sine bell timbre.
  - _Powerup_: Multi-step rising frequency sweep.
  - _Hit / Hurt_: Harsh distorted square wave with rapid decay.
- [ ] "Mutate" & "Randomize" generator with seed reproduction.

---

## 🔮 Future Phases

- **Phase 2: Sound Design Expansion**: FM synthesis pairs, polyphonic layering, wavetable synthesis, reverb impulse responses.
- **Phase 3: Visual & Texture Asset Generator**: Procedural pixel art sprites, seamless tiling textures, normal maps.
- **Phase 4: Game Engine Direct Integration**: Godot engine addon / Unity package export for live asset syncing.
