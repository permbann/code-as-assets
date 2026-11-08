import React, { useState, useEffect, useCallback } from "react";
import {
  Play,
  Volume2,
  Sliders,
  Sparkles,
  Download,
  RotateCcw,
  AudioWaveform,
  HelpCircle,
  Layers,
  Wand2,
} from "lucide-react";
import type { SoundParams, WaveType, FilterType } from "./audio/types";
import { PARAM_EXPLAINERS } from "./audio/types";
import { PRESET_LIBRARY, generateRandomSFX, mutateSound } from "./audio/presets";
import { audioEngine } from "./audio/engine";
import { WaveformVisualizer } from "./components/WaveformVisualizer";
import { PitchStrip } from "./components/PitchStrip";
import { PresetPicker } from "./components/PresetPicker";
import { ParameterControl } from "./components/ParameterControl";
import { ExportModal } from "./components/ExportModal";
import { Tooltip } from "./components/Tooltip";

export const App: React.FC = () => {
  const [params, setParams] = useState<SoundParams>(PRESET_LIBRARY[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePitch, setActivePitch] = useState<number | null>(null);
  const [activeMode, setActiveMode] = useState<"simple" | "advanced">("simple");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [masterVolume, setMasterVolume] = useState(85);

  const handlePlay = useCallback(
    (pitchOffset = 0) => {
      setActivePitch(pitchOffset);
      setIsPlaying(true);
      const duration = audioEngine.play(params, pitchOffset);

      setTimeout(
        () => {
          setIsPlaying(false);
          setActivePitch(null);
        },
        Math.max(150, duration * 1000),
      );
    },
    [params],
  );

  // Global Keyboard shortcuts: Space to audition, 1-7 for pitch pads
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        handlePlay(0);
      } else if (e.key >= "1" && e.key <= "7") {
        const pitchOffsets = [-12, -7, -3, 0, 3, 7, 12];
        const index = parseInt(e.key, 10) - 1;
        if (pitchOffsets[index] !== undefined) {
          e.preventDefault();
          handlePlay(pitchOffsets[index]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePlay]);

  const updateParam = <K extends keyof SoundParams>(key: K, val: SoundParams[K]) => {
    setParams((prev) => ({ ...prev, [key]: val }));
  };

  const handleSelectPreset = (preset: SoundParams) => {
    setParams({ ...preset });
    // Audition immediately on preset click
    setTimeout(() => {
      audioEngine.play(preset, 0);
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), (preset.attack + preset.decay + preset.release) * 1000);
    }, 50);
  };

  const handleRandomize = () => {
    const randomPatch = generateRandomSFX();
    setParams(randomPatch);
    setTimeout(() => {
      audioEngine.play(randomPatch, 0);
      setIsPlaying(true);
      setTimeout(
        () => setIsPlaying(false),
        (randomPatch.attack + randomPatch.decay + randomPatch.release) * 1000,
      );
    }, 50);
  };

  const handleMutate = () => {
    const mutated = mutateSound(params);
    setParams(mutated);
    setTimeout(() => {
      audioEngine.play(mutated, 0);
      setIsPlaying(true);
      setTimeout(
        () => setIsPlaying(false),
        (mutated.attack + mutated.decay + mutated.release) * 1000,
      );
    }, 50);
  };

  const handleResetCurrent = () => {
    const original = PRESET_LIBRARY.find((p) => p.id === params.id);
    if (original) {
      setParams({ ...original });
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-cyan-500/30">
      {/* Top Studio Header */}
      <header className="sticky top-0 z-40 bg-[#0c1017]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Project Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-md shadow-cyan-950/50">
              <AudioWaveform className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white tracking-tight text-sm sm:text-base">
                  code-as-assets
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                  SFX Studio
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Procedural Sound Effect Synthesis & Game Asset Exporter
              </p>
            </div>
          </div>

          {/* Master Audition & Export Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Master Volume */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <Volume2 className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="range"
                min={0}
                max={100}
                value={masterVolume}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setMasterVolume(val);
                  audioEngine.setMasterVolume(val);
                }}
                className="w-16 h-1 bg-slate-800 accent-cyan-400 cursor-pointer"
                title="Master Audio Safety Output"
              />
              <span className="font-mono text-[10px] text-slate-400 w-6">{masterVolume}%</span>
            </div>

            {/* Play Button */}
            <button
              type="button"
              onClick={() => handlePlay(0)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg ${
                isPlaying
                  ? "bg-cyan-400 text-slate-950 scale-95 shadow-cyan-400/30"
                  : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 hover:shadow-cyan-500/20"
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Play</span>
              <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[9px] font-mono bg-slate-900/30 rounded border border-slate-950/20">
                Space
              </kbd>
            </button>

            {/* Export Asset Button */}
            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-semibold text-xs sm:text-sm transition-colors shadow-md shadow-black/40"
            >
              <Download className="w-4 h-4" />
              <span>Export Audio</span>
            </button>
          </div>
        </div>
      </header>

      {/* Studio Workspace Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* Top Visualizer & Pitch Audition Deck */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Waveform Scope (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Live Audio Waveform Scope
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Real-Time Web Audio Node</span>
            </div>
            <WaveformVisualizer isPlaying={isPlaying} />
          </div>

          {/* Quick Audition & Pitch Pad Deck (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full gap-3 p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/40">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                  Active Patch:{" "}
                  <span className="text-cyan-300 font-mono font-bold">{params.name}</span>
                </span>
                <button
                  type="button"
                  onClick={handleResetCurrent}
                  title="Reset to preset defaults"
                  className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 p-1 hover:bg-slate-800 rounded transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                Audition the synthesized sound across different octave pitches. Notice how the same
                sound patch creates punchy low impacts or whistling high laser effects depending on
                pitch.
              </p>
            </div>

            <PitchStrip onPlayWithPitch={handlePlay} activePitch={activePitch} />
          </div>
        </section>

        {/* Preset Archetypes Picker */}
        <section className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 shadow-sm">
          <PresetPicker
            currentPresetId={params.id}
            onSelectPreset={handleSelectPreset}
            onRandomize={handleRandomize}
            onMutate={handleMutate}
          />
        </section>

        {/* Parameter Sculpting Station */}
        <section className="flex flex-col gap-3">
          {/* Mode Switcher (Simple Beginner Controls vs Advanced DSP Rack) */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Sound Sculpting Controls
              </span>
              <span className="text-[10px] text-slate-400">
                (Hover on any <HelpCircle className="w-2.5 h-2.5 inline text-cyan-400" /> for
                plain-English explanations)
              </span>
            </div>

            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveMode("simple")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                  activeMode === "simple"
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Simple Controls</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMode("advanced")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                  activeMode === "advanced"
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Advanced Rack</span>
              </button>
            </div>
          </div>

          {/* Simple Beginner Controls View */}
          {activeMode === "simple" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Starting Tone / Pitch */}
              <ParameterControl
                label="Tone / Starting Pitch"
                technicalLabel="Base Frequency"
                value={params.baseFrequency}
                min={40}
                max={2200}
                step={10}
                unit="Hz"
                defaultValue={440}
                explainer={PARAM_EXPLAINERS.tone}
                onChange={(val) => updateParam("baseFrequency", val)}
                formatValue={(v) => `${Math.round(v)} Hz`}
              />

              {/* Pitch Slide / Direction */}
              <ParameterControl
                label="Pitch Slide / Sweep"
                technicalLabel="Pitch Delta"
                value={params.pitchSlide}
                min={-48}
                max={48}
                step={1}
                unit="st"
                defaultValue={0}
                explainer={PARAM_EXPLAINERS.pitchSlide}
                onChange={(val) => updateParam("pitchSlide", val)}
                formatValue={(v) =>
                  v > 0 ? `+${v} st (Up)` : v < 0 ? `${v} st (Down)` : "0 st (Flat)"
                }
              />

              {/* Punch / Attack */}
              <ParameterControl
                label="Punch / Snap"
                technicalLabel="Attack Time"
                value={params.attack}
                min={0.001}
                max={0.5}
                step={0.005}
                unit="s"
                defaultValue={0.005}
                explainer={PARAM_EXPLAINERS.punch}
                onChange={(val) => updateParam("attack", val)}
                formatValue={(v) => `${Math.round(v * 1000)} ms`}
              />

              {/* Length & Fade Out */}
              <ParameterControl
                label="Fade Out / Tail"
                technicalLabel="Decay Length"
                value={params.decay}
                min={0.05}
                max={2.5}
                step={0.05}
                unit="s"
                defaultValue={0.3}
                explainer={PARAM_EXPLAINERS.decay}
                onChange={(val) => updateParam("decay", val)}
                formatValue={(v) => `${v.toFixed(2)} s`}
              />

              {/* Wobble / Vibrato */}
              <ParameterControl
                label="Wobble / Vibrato"
                technicalLabel="LFO Depth"
                value={params.wobbleDepth}
                min={0}
                max={24}
                step={1}
                unit="st"
                defaultValue={0}
                explainer={PARAM_EXPLAINERS.wobble}
                onChange={(val) => {
                  updateParam("wobbleDepth", val);
                  if (val > 0 && params.wobbleSpeed === 0) {
                    updateParam("wobbleSpeed", 12);
                  }
                }}
                formatValue={(v) => (v === 0 ? "Off (Steady)" : `${v} st Wobble`)}
              />

              {/* Tone Brightness / Warmth */}
              <ParameterControl
                label="Tone Warmth / Brightness"
                technicalLabel="Filter Cutoff"
                value={params.brightness}
                min={300}
                max={16000}
                step={100}
                unit="Hz"
                defaultValue={8000}
                explainer={PARAM_EXPLAINERS.brightness}
                onChange={(val) => updateParam("brightness", val)}
                formatValue={(v) =>
                  v < 1500
                    ? `${Math.round(v)} Hz (Warm)`
                    : v > 10000
                      ? `${Math.round(v)} Hz (Crisp)`
                      : `${Math.round(v)} Hz`
                }
              />

              {/* Retro Grit */}
              <ParameterControl
                label="Retro Grit / Crunch"
                technicalLabel="Distortion"
                value={params.grit}
                min={0}
                max={100}
                step={5}
                unit="%"
                defaultValue={0}
                explainer={PARAM_EXPLAINERS.grit}
                onChange={(val) => updateParam("grit", val)}
                formatValue={(v) => (v === 0 ? "Clean (0%)" : `${Math.round(v)}% Crunch`)}
              />

              {/* Sound Output Gain */}
              <ParameterControl
                label="Patch Volume"
                technicalLabel="Gain Level"
                value={params.volume}
                min={10}
                max={100}
                step={5}
                unit="%"
                defaultValue={85}
                onChange={(val) => updateParam("volume", val)}
                formatValue={(v) => `${Math.round(v)}%`}
              />

              {/* Wave Texture Quick Switch */}
              <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-200">Voice Texture</span>
                    <Tooltip explainer={PARAM_EXPLAINERS.waveShape} />
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 capitalize bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    {params.waveType}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1 mt-1">
                  {(["sine", "square", "sawtooth", "triangle", "noise"] as WaveType[]).map((wt) => (
                    <button
                      key={wt}
                      type="button"
                      onClick={() => updateParam("waveType", wt)}
                      className={`py-1 text-[10px] font-semibold rounded capitalize transition-colors ${
                        params.waveType === wt
                          ? "bg-cyan-500 text-slate-950 font-bold"
                          : "bg-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {wt === "sawtooth" ? "Saw" : wt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Advanced DSP Rack View */
            <div className="flex flex-col gap-4">
              {/* Oscillator & Waveform Engine */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col gap-3">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>1. Sound Generator & Waveform</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate-300">Oscillator Waveform</span>
                    <select
                      value={params.waveType}
                      onChange={(e) => updateParam("waveType", e.target.value as WaveType)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="sine">Sine (Pure, Smooth tone)</option>
                      <option value="square">Square (8-Bit Retro arcade)</option>
                      <option value="sawtooth">Sawtooth (Buzzy, Aggressive)</option>
                      <option value="triangle">Triangle (Soft, Flute-like)</option>
                      <option value="noise">Noise (Rumble, Explosions)</option>
                    </select>
                  </div>

                  <ParameterControl
                    label="Frequency"
                    value={params.baseFrequency}
                    min={30}
                    max={2400}
                    step={5}
                    unit="Hz"
                    onChange={(val) => updateParam("baseFrequency", val)}
                  />

                  <ParameterControl
                    label="Pitch Slide"
                    value={params.pitchSlide}
                    min={-48}
                    max={48}
                    step={1}
                    unit="st"
                    onChange={(val) => updateParam("pitchSlide", val)}
                  />

                  <ParameterControl
                    label="Sweep Speed Curve"
                    value={params.pitchSlideSpeed}
                    min={0.1}
                    max={3.0}
                    step={0.1}
                    onChange={(val) => updateParam("pitchSlideSpeed", val)}
                  />
                </div>
              </div>

              {/* Volume ADSR Envelope */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col gap-3">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>2. ADSR Volume Envelope</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <ParameterControl
                    label="Attack Time"
                    value={params.attack}
                    min={0.001}
                    max={1.0}
                    step={0.005}
                    unit="s"
                    onChange={(val) => updateParam("attack", val)}
                  />
                  <ParameterControl
                    label="Decay Time"
                    value={params.decay}
                    min={0.01}
                    max={3.0}
                    step={0.01}
                    unit="s"
                    onChange={(val) => updateParam("decay", val)}
                  />
                  <ParameterControl
                    label="Sustain Level"
                    value={params.sustain}
                    min={0.0}
                    max={1.0}
                    step={0.05}
                    onChange={(val) => updateParam("sustain", val)}
                  />
                  <ParameterControl
                    label="Release Time"
                    value={params.release}
                    min={0.01}
                    max={2.0}
                    step={0.01}
                    unit="s"
                    onChange={(val) => updateParam("release", val)}
                  />
                </div>
              </div>

              {/* Filter & Modulation */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col gap-3">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>3. Filter & Modulation FX</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate-300">Filter Type</span>
                    <select
                      value={params.filterType}
                      onChange={(e) => updateParam("filterType", e.target.value as FilterType)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="lowpass">Low-Pass (Muffle Highs)</option>
                      <option value="highpass">High-Pass (Thin Bass)</option>
                      <option value="bandpass">Band-Pass (Resonant Whistle)</option>
                    </select>
                  </div>

                  <ParameterControl
                    label="Cutoff Freq"
                    value={params.brightness}
                    min={100}
                    max={18000}
                    step={100}
                    unit="Hz"
                    onChange={(val) => updateParam("brightness", val)}
                  />

                  <ParameterControl
                    label="Resonance (Q)"
                    value={params.resonance}
                    min={0.1}
                    max={20.0}
                    step={0.2}
                    onChange={(val) => updateParam("resonance", val)}
                  />

                  <ParameterControl
                    label="LFO Rate (Wobble)"
                    value={params.wobbleSpeed}
                    min={0}
                    max={30}
                    step={1}
                    unit="Hz"
                    onChange={(val) => updateParam("wobbleSpeed", val)}
                  />
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Export Modal */}
      <ExportModal params={params} isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />

      {/* Footer Status Bar */}
      <footer className="border-t border-slate-800/80 bg-[#080b10] px-4 sm:px-6 py-2.5 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>Audio Context Ready</span>
            <span className="text-slate-600">•</span>
            <span className="font-mono text-[11px] text-slate-400">Vite+ Unified Toolchain</span>
          </div>
          <div>Built with React 19 + TypeScript • Compatible with Godot, Unity, Unreal & Web</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
