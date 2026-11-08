---
name: ui-design
description: UI component design, interaction ergonomics, audio control patterns, and layout guidelines for code-as-assets studio.
---

# UI Design System & Component Guidelines

## 1. Ergonomic Control Patterns for Audio Workstations
- **Rotary Knobs**:
  - Vertical drag interaction (drag up to increase, drag down to decrease).
  - Shift + drag for precision fine-tuning (1/10th speed).
  - Double-click to reset to default parameter value.
  - Radial SVG arc or ring indicating current value with glowing active segment.
  - Accompanying inline monospace readout with unit label (`Hz`, `ms`, `%`, `dB`).
- **Sliders & Faders**:
  - Clear track groove with active illuminated fill.
  - Tactile thumb with grab cursor and hover highlight.
- **Envelope Graph Canvas**:
  - Interactive multi-segment Bezier/linear curve editor for ADSR (Attack, Decay, Sustain, Release) and pitch envelope.
  - Draggable handle points with real-time time/amplitude tooltips.
- **Audition & Trigger**:
  - Primary "Play / Audition" button with prominent visual playhead animation.
  - Global hotkey: Space bar auditions current sound effect patch.
  - Interactive mini piano / trigger pad strip to test the sound at different pitches instantly.

## 2. Audio Safety & UX Guardrails
- **Peak Limiting / Soft Clipper**: Always run master output through a limiter node (`DynamicsCompressorNode` or soft sigmoid clipper) to prevent accidental speaker blowout or ear fatigue during synthesis experiments.
- **AudioContext Lifecycle**: Handle browser auto-play policies gracefully by resuming the Web Audio `AudioContext` on the first user interaction (click, spacebar).
- **Undo / Redo & History**: Maintain parameter change history for quick rollback of experimental tweaks.
- **URL / Seed Sharing**: Allow users to copy a shareable link or short JSON string to replicate any generated sound.

## 3. Asset Export Station
- **Format Options**:
  - **OGG Vorbis** (.ogg): Best balance of high audio fidelity and small file size for modern game engines (Godot, Unity, Unreal). Loop point metadata supported.
  - **WAV PCM** (.wav): Uncompressed 16-bit or 24-bit PCM for raw low-latency sound triggers, retro games, or DAW post-processing.
  - **MP3 / AAC**: Optional legacy formats for web applications requiring universal legacy browser support.
- **Export Controls**:
  - "Download Audio File" (with filename pattern: `sfx_[category]_[preset]_[timestamp].[ext]`).
  - "Copy as Base64 Data URI" (for instant inline web/game prototyping).
  - "Export Code Snippet" (e.g., Web Audio API code or Tone.js snippet to synthesize this sound in-engine at runtime without external asset files).
