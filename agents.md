# Project Governance & Agent Instructions: code-as-assets

> **CRITICAL DIRECTIVE FOR ALL AGENTS**:
>
> 1. **STRATEGIC ALIGNMENT**: Every agent operating in this repository must align with and follow the `strategic` skill (`.agents/skills/strategic/SKILL.md`). Do not jump into unstructured code generation without phase-based planning, task breakdown, and scope boundaries.
> 2. **NO NPM / NPX DRIFT**: You MUST strictly use the Vite+ CLI (`vp`). **NEVER execute `npm`, `npx`, or plain package manager commands.** Always use `vp dev`, `vp build`, `vp check`, `vp test`, `vp install`, `vp add`, `vp remove`, and `vpx`.
> 3. **PROJECT SCOPE**: This repository (`code-as-assets`) is an **asset generation suite** for games and applications. It is NOT a game client, game engine, or multiplayer server. The initial milestone is procedural sound effect synthesis, modulation (pitch, duration, filters, ADSR envelopes), and game-compatible export (OGG Vorbis, WAV PCM, etc.).
> 4. **DESIGN SYSTEM**: Adhere to `frontend-design` (unaltered licensed skill), `my-design` (tactile digital synthesizer laboratory aesthetics), and `ui-design` (modular knobs, faders, oscilloscopes, envelopes, audio safety limiters).

---

## 1. Skill Reference Map

- **Strategic Execution**: [`.agents/skills/strategic/SKILL.md`](file:///.agents/skills/strategic/SKILL.md)
  - Phased milestone planning, MECE task breakdown, durable tracking in `TASKS.md`, zero scope creep.
- **Frontend Design Lead**: [`.agents/skills/frontend-design/SKILL.md`](file:///.agents/skills/frontend-design/SKILL.md)
  - Subject-grounded design, anti-AI-slop heuristics, intentional typography and composition.
- **Brand & Studio Aesthetic**: [`.agents/skills/my-design/SKILL.md`](file:///.agents/skills/my-design/SKILL.md)
  - Deep obsidian/charcoal surfaces, electric cyan & cyber amber signal accents, oscilloscope glows.
- **UI & Audio Interaction**: [`.agents/skills/ui-design/SKILL.md`](file:///.agents/skills/ui-design/SKILL.md)
  - Vertical-drag knobs with Shift-precision, ADSR curves, audio safety peak limiter, audio format exporter.

---

<!--VITE PLUS START-->

## 2. Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

### Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

- Development: `vp dev`
- Production Build: `vp build`
- Type Check & Lint: `vp check`
- Autofix Formatting/Lints: `vp check --fix`
- Vitest Testing: `vp test`
- Package Management: `vp install`, `vp add <package>`, `vp remove <package>`
- Script Runner: `vpx <script.ts>`

### Running Scripts

Run TypeScript and JavaScript files with `vpx <file>`, for example `vpx ./scripts/seed.ts --dry-run`. It handles enums, decorators, JSX, and tsconfig `paths`, so do not add `tsx` or `ts-node` to run scripts. `vpx --watch <file>` reruns the file when a file it uses changes, in place of `tsx watch`. `vp node <file>` runs plain Node.js.

### Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+ release. Add a tool name to select part of the graph. For example, run `vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use `vp why <package>` to show the package-manager dependency graph.

### Review Checklist Before Completing Tasks

- [ ] Run `vp install` after pulling remote changes or altering dependencies.
- [ ] Run `vp check` (and `vp check --fix` if needed) to ensure format, lint, and type check pass.
- [ ] Run `vp test` to verify all test suites pass.
- [ ] Run `vp build` to ensure production bundle compiles cleanly via Rolldown.
- [ ] Keep `TASKS.md` updated with completed items and next steps.

<!--VITE PLUS END-->
