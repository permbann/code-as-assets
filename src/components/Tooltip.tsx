import React, { useState } from "react";
import { HelpCircle } from "lucide-react";
import type { ParameterExplainer } from "../audio/types";

interface TooltipProps {
  explainer: ParameterExplainer;
  children?: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ explainer, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children ? (
        children
      ) : (
        <button
          type="button"
          className="text-slate-500 hover:text-cyan-400 p-0.5 rounded transition-colors focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={explainer.title}
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      )}

      {isOpen && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900/95 border border-cyan-500/30 rounded-lg shadow-xl shadow-cyan-950/40 text-xs backdrop-blur-md pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div className="font-semibold text-cyan-300 mb-0.5 flex items-center justify-between">
            <span>{explainer.title}</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mb-1.5 uppercase tracking-wider">
            {explainer.subtitle}
          </div>
          <p className="text-slate-200 leading-relaxed mb-2">{explainer.plainEnglish}</p>
          <div className="pt-1.5 border-t border-slate-800 text-[11px] text-amber-300/90 leading-tight">
            <span className="font-semibold text-amber-400">Game Tip: </span>
            {explainer.tip}
          </div>
          {/* Subtle triangle beak */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
};
