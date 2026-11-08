import React, { useState } from "react";
import { Download, Copy, Check, Code, FileAudio, X, Sparkles } from "lucide-react";
import type { SoundParams } from "../audio/types";
import { audioEngine } from "../audio/engine";
import { audioBufferToWav } from "../export/wavEncoder";
import { audioBufferToOgg } from "../export/oggEncoder";
import { generateWebAudioSnippet, downloadBlob } from "../export/codeExport";

interface ExportModalProps {
  params: SoundParams;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ params, isOpen, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedBase64, setCopiedBase64] = useState(false);
  const [activeTab, setActiveTab] = useState<"audio" | "code">("audio");

  if (!isOpen) return null;

  const handleDownloadWav = async () => {
    try {
      setIsExporting(true);
      const buffer = await audioEngine.renderToBuffer(params);
      const blob = audioBufferToWav(buffer);
      const filename = `sfx_${params.category}_${params.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}.wav`;
      downloadBlob(blob, filename);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadOgg = async () => {
    try {
      setIsExporting(true);
      const buffer = await audioEngine.renderToBuffer(params);
      const { blob, extension } = await audioBufferToOgg(buffer);
      const filename = `sfx_${params.category}_${params.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}.${extension}`;
      downloadBlob(blob, filename);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyCode = async () => {
    const code = generateWebAudioSnippet(params);
    await navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyBase64 = async () => {
    try {
      setIsExporting(true);
      const buffer = await audioEngine.renderToBuffer(params);
      const blob = audioBufferToWav(buffer);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        await navigator.clipboard.writeText(base64);
        setCopiedBase64(true);
        setTimeout(() => setCopiedBase64(false), 2000);
      };
      reader.readAsDataURL(blob);
    } finally {
      setIsExporting(false);
    }
  };

  const codeSnippet = generateWebAudioSnippet(params);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0e131b] border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Export Game Audio Asset</h2>
              <p className="text-xs text-slate-400">
                Patch: <span className="text-cyan-300">{params.name}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800/80 bg-slate-950/40">
          <button
            type="button"
            onClick={() => setActiveTab("audio")}
            className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === "audio"
                ? "border-cyan-400 text-cyan-300 bg-slate-900/40"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileAudio className="w-4 h-4" />
            <span>Audio Files (WAV / OGG)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("code")}
            className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === "code"
                ? "border-cyan-400 text-cyan-300 bg-slate-900/40"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Code / Runtime Script</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex flex-col gap-4">
          {activeTab === "audio" ? (
            <div className="flex flex-col gap-3">
              {/* WAV Export Card */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 flex items-center justify-between hover:border-slate-700 transition-colors">
                <div className="flex flex-col pr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white text-sm">WAV PCM (.wav)</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
                      Recommended for SFX
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Uncompressed 16-bit audio. Zero decode delay, instant playback in Godot, Unity,
                    Unreal, and browsers.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={handleDownloadWav}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0 transition-colors shadow-lg shadow-cyan-950/40"
                >
                  <Download className="w-4 h-4" />
                  <span>Download WAV</span>
                </button>
              </div>

              {/* OGG Export Card */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 flex items-center justify-between hover:border-slate-700 transition-colors">
                <div className="flex flex-col pr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white text-sm">OGG / Vorbis (.ogg)</span>
                    <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.2 rounded font-mono">
                      Compact Game Audio
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    High quality compressed format. Up to 85% smaller file size, ideal for web
                    games, mobile, and ambient loops.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={handleDownloadOgg}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-bold text-xs shrink-0 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download OGG</span>
                </button>
              </div>

              {/* Base64 Data URI */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/30 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200 text-xs block mb-0.5">
                    Copy Base64 Audio Data URI
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Embed sound directly inside HTML or JS code without storing external audio
                    files.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyBase64}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs shrink-0 transition-colors border border-slate-700"
                >
                  {copiedBase64 ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy URI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Zero asset payload: play this sound using pure Web Audio API code:
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition-colors"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied Snippet!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-52 leading-relaxed">
                {codeSnippet}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-amber-400/90">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for Godot, Unity, Unreal & Web engines</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
