import React from "react";
import { Tooltip } from "./Tooltip";
import type { ParameterExplainer } from "../audio/types";

interface ParameterControlProps {
  label: string;
  technicalLabel?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  defaultValue?: number;
  explainer?: ParameterExplainer;
  onChange: (val: number) => void;
  formatValue?: (val: number) => string;
}

export const ParameterControl: React.FC<ParameterControlProps> = ({
  label,
  technicalLabel,
  value,
  min,
  max,
  step = 1,
  unit = "",
  defaultValue,
  explainer,
  onChange,
  formatValue,
}) => {
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const displayValue = formatValue
    ? formatValue(value)
    : `${Number(value.toFixed(2))}${unit ? " " + unit : ""}`;

  return (
    <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-colors">
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-semibold text-slate-200 truncate">{label}</span>
          {explainer && <Tooltip explainer={explainer} />}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {technicalLabel && (
            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
              {technicalLabel}
            </span>
          )}
          <span className="text-xs font-mono font-bold text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
            {displayValue}
          </span>
        </div>
      </div>

      <div className="relative flex items-center h-5">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          onDoubleClick={() => {
            if (defaultValue !== undefined) {
              onChange(defaultValue);
            }
          }}
          title={defaultValue !== undefined ? "Double click to reset" : undefined}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          style={{
            background: `linear-gradient(to right, #00e5ff 0%, #00e5ff ${percentage}%, #1e293b ${percentage}%, #1e293b 100%)`,
          }}
        />
      </div>
    </div>
  );
};
