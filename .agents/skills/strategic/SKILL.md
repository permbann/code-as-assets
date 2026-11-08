---
name: strategic
description: Strategic planning, architecture decision alignment, and milestone execution framework for the code-as-assets project. Guides agents to plan hierarchically, maintain task tracking, prevent scope creep, and enforce toolchain standards.
---

# Strategic Execution & Project Alignment

## 1. Project Identity & Scope Boundaries
- **Repository**: `permbann/code-as-assets`
- **Mission**: A modular, web-based asset creation and procedural generation suite for game developers and digital artists.
- **Initial Milestone / Core Focus**: Sound effect synthesis, parametric audio sculpting (frequency, pitch sweeps, duration, envelopes, harmonics, filters, modulation), real-time interactive preview, and game-ready asset export (OGG, WAV, etc.).
- **Boundary Warning**: This is an **asset generation tool**, not a multiplayer game client or game engine. Do not import multiplayer netcode, physics engines, or game loops unless explicitly requested for asset preview contexts. Keep the architecture modular so future asset modules (textures, sprites, shaders, 3D meshes) plug cleanly into the same studio shell.

## 2. Toolchain & Command Discipline
- **Unified Toolchain**: Vite+ (`vp`) exclusively.
- **NEVER use plain `npm` or `npx` (no "npn" drift)**.
- **Required Commands**:
  - `vp dev` - Start development server
  - `vp build` - Production build (using Rolldown)
  - `vp check` - High-speed formatting (Oxfmt), linting (Oxlint), and type checking (tsgolint)
  - `vp check --fix` - Auto-fix formatting and lint issues
  - `vp test` - Vitest test suite runner
  - `vp install` / `vp add <pkg>` / `vp remove <pkg>` - Dependency management via pnpm
  - `vpx <script>` - Execute TypeScript/JavaScript scripts directly
- Before completing any task or milestone, run `vp check` and `vp build` to ensure clean verification.

## 3. Strategic Execution Workflow
1. **Deconstruct & Phase**:
   - Break every feature into atomic, verifiable phases.
   - Maintain a living task list in `TASKS.md` (or relevant tracking doc).
2. **Clarify Constraints First**:
   - Before implementing complex audio algorithms or encoding pipelines, clarify target game engine requirements (e.g., Godot, Unity, Unreal, Phaser), performance limits, and audio latency expectations.
3. **Architect for Extensibility**:
   - Audio Engine: Separate the audio synthesis engine (Web Audio API / OfflineAudioContext / DSP algorithms) from the UI layer (React state, Canvas visualizers).
   - Export Pipeline: Abstract encoders (WAV PCM, OGG Vorbis via WebAssembly/Web Workers) behind a common `AssetExporter` interface.
   - Preset System: Serialized JSON configuration for every sound patch (enabling import/export, URL hash sharing, and seed-based reproduction).
4. **Iterative Verification**:
   - Step 1: Synthesizer core & parameter model.
   - Step 2: Real-time audio rendering & auditioning.
   - Step 3: Interactive UI (knobs, sliders, envelope graphs, visualizers).
   - Step 4: Asset export (OGG / WAV format encoding and downloading).
   - Step 5: Preset library (classic game SFX: laser, explosion, jump, coin, powerup, hit).

## 4. Quality & Context Hygiene
- Never commit broken TypeScript types or lint failures.
- Update `TASKS.md` after each milestone.
- Document audio synthesis formulas, parameter ranges (Hz, dB, seconds), and encoding specs.
