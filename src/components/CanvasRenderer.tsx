"use client";

import { forwardRef, useEffect } from "react";

interface CanvasProps {
  emoji: string;
  mood: string;
  title: string;
  caption: string;
}

const CanvasRenderer = forwardRef<HTMLCanvasElement, CanvasProps>(
  ({ emoji, mood, title, caption }, ref) => {
    useEffect(() => {
      const canvas = ref && "current" in ref ? ref.current : null;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = 400;
      canvas.height = 400;
      ctx.fillStyle = "#3B82F6"; // Tailwind blue-500
      ctx.fillRect(0, 0, 400, 400);
      ctx.font = "100px Arial";
      ctx.fillText(emoji, 150, 200);
      ctx.font = "20px Arial";
      ctx.fillText(title || mood, 50, 300);
      ctx.fillText(caption, 50, 350);
    }, [emoji, mood, title, caption, ref]);

    return <canvas ref={ref} className="hidden" />;
  }
);

CanvasRenderer.displayName = "CanvasRenderer";

export default CanvasRenderer;
