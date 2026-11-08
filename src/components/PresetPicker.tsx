import React from "react";
import {
  Zap,
  Coins,
  ArrowUpRight,
  Bomb,
  Sparkles,
  ShieldAlert,
  Radio,
  MousePointerClick,
  Dices,
  Shuffle,
} from "lucide-react";
import type { SoundParams } from "../audio/types";
import { PRESET_LIBRARY } from "../audio/presets";

interface PresetPickerProps {
  currentPresetId: string;
  onSelectPreset: (preset: SoundParams) => void;
  onRandomize: () => void;
  onMutate: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  laser: <Zap className="w-4 h-4 text-amber-400" />,
  coin: <Coins className="w-4 h-4 text-yellow-300" />,
  jump: <ArrowUpRight className="w-4 h-4 text-emerald-400" />,
  explosion: <Bomb className="w-4 h-4 text-red-400" />,
  powerup: <Sparkles className="w-4 h-4 text-cyan-300" />,
  hit: <ShieldAlert className="w-4 h-4 text-orange-400" />,
  synth: <Radio className="w-4 h-4 text-purple-400" />,
  custom: <MousePointerClick className="w-4 h-4 text-slate-300" />,
};

export const PresetPicker: React.FC<PresetPickerProps> = ({
  currentPresetId,
  onSelectPreset,
  onRandomize,
  onMutate,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Quick Sound Archetypes
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onMutate}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-amber-500/30 hover:border-amber-400 transition-colors shadow-sm"
            title="Mutate current sound slightly to discover variations"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Tweak / Mutate</span>
          </button>
          <button
            type="button"
            onClick={onRandomize}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-cyan-950/70 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 transition-colors shadow-sm"
            title="Generate a completely new random game sound effect"
          >
            <Dices className="w-3.5 h-3.5" />
            <span>Roll Random</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PRESET_LIBRARY.map((preset) => {
          const isActive = currentPresetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                isActive
                  ? "bg-slate-800/90 border-cyan-400 shadow-md shadow-cyan-950/30 text-white"
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <div
                className={`p-1.5 rounded-lg border ${
                  isActive
                    ? "bg-cyan-950/80 border-cyan-500/40"
                    : "bg-slate-800 border-slate-700/60"
                }`}
              >
                {CATEGORY_ICONS[preset.category] || <Zap className="w-4 h-4 text-cyan-400" />}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold truncate leading-tight">{preset.name}</span>
                <span className="text-[10px] text-slate-400 capitalize truncate">
                  {preset.category}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
