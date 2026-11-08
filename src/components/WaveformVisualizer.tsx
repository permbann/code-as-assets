import React, { useEffect, useRef } from "react";
import { audioEngine } from "../audio/engine";

interface VisualizerProps {
  isPlaying: boolean;
}

export const WaveformVisualizer: React.FC<VisualizerProps> = ({ isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const analyser = audioEngine.getAnalyser();
    const dataArray = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Dark oscilloscope screen background with slight persistence trail
      ctx.fillStyle = "rgba(10, 14, 20, 0.35)";
      ctx.fillRect(0, 0, width, height);

      // Subtle phosphor grid lines
      ctx.strokeStyle = "rgba(40, 60, 80, 0.25)";
      ctx.lineWidth = 1;

      // Center crosshair
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();

      if (analyser && dataArray && isPlaying) {
        analyser.getByteTimeDomainData(dataArray);

        // Electric cyan glow
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#00e5ff";
        ctx.strokeStyle = "#00e5ff";
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        const sliceWidth = width / dataArray.length;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();

        // Secondary subtle amber peak trace
        ctx.shadowBlur = 4;
        ctx.shadowColor = "#ffb300";
        ctx.strokeStyle = "rgba(255, 179, 0, 0.6)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.shadowBlur = 0;
      } else {
        // Resting ambient scanline
        ctx.strokeStyle = "rgba(0, 229, 255, 0.3)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  return (
    <div className="relative w-full h-32 md:h-36 rounded-xl overflow-hidden border border-slate-800 bg-[#0a0e14] shadow-inner">
      <canvas ref={canvasRef} width={800} height={240} className="w-full h-full block" />
      <div className="absolute top-2 left-3 flex items-center gap-2 pointer-events-none">
        <span className="flex h-2 w-2 relative">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? "bg-cyan-400 opacity-75" : "bg-emerald-500 opacity-20"}`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? "bg-cyan-400" : "bg-emerald-500"}`}
          />
        </span>
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
          {isPlaying ? "Signal Live" : "Scope Standby"}
        </span>
      </div>
      <div className="absolute bottom-2 right-3 pointer-events-none text-[10px] font-mono text-slate-500">
        44.1 kHz • 16-Bit PCM Scope
      </div>
    </div>
  );
};
