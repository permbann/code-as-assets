import React from "react";
import { Music } from "lucide-react";

interface PitchStripProps {
  onPlayWithPitch: (semitones: number) => void;
  activePitch: number | null;
}

const PITCH_STEPS = [
  { label: "Deep (-12)", semitones: -12, desc: "1 Octave Down" },
  { label: "Low (-7)", semitones: -7, desc: "Fifth Down" },
  { label: "Minor (-3)", semitones: -3, desc: "Step Down" },
  { label: "Base (0)", semitones: 0, desc: "Normal Pitch" },
  { label: "High (+3)", semitones: 3, desc: "Step Up" },
  { label: "Crisp (+7)", semitones: 7, desc: "Fifth Up" },
  { label: "Ultra (+12)", semitones: 12, desc: "1 Octave Up" },
];

export const PitchStrip: React.FC<PitchStripProps> = ({ onPlayWithPitch, activePitch }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-300 flex items-center gap-1.5">
          <Music className="w-3.5 h-3.5 text-cyan-400" />
          Test At Different Game Pitches
        </span>
        <span className="text-[10px] text-slate-400">Click any pad to audition pitch scaling</span>
      </div>

      <div className="grid grid-cols-7 gap-1.5 p-1 bg-slate-900/60 rounded-xl border border-slate-800">
        {PITCH_STEPS.map((step) => {
          const isSelected = activePitch === step.semitones;
          const isBase = step.semitones === 0;

          return (
            <button
              key={step.semitones}
              type="button"
              onClick={() => onPlayWithPitch(step.semitones)}
              className={`group flex flex-col items-center justify-center py-2 px-1 rounded-lg border text-center transition-all ${
                isSelected
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-950/50 scale-[0.98]"
                  : isBase
                    ? "bg-slate-800/80 border-slate-700 text-amber-300 hover:border-amber-400/60 hover:bg-slate-800"
                    : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <span className="text-[11px] font-mono font-bold tracking-tight">{step.label}</span>
              <span className="text-[9px] text-slate-500 group-hover:text-slate-400">
                {step.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
