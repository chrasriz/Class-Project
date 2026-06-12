"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const LINK_DIST = 110;
const POINTER_DIST = 160;

type Node = { x: number; y: number; vx: number; vy: number };

/**
 * Pointer-reactive network topology for the hero: drifting nodes, proximity
 * links, brighter links toward the cursor. Plain canvas (~no bundle cost),
 * animates only while on screen, and collapses to a single static frame for
 * prefers-reduced-motion. Line color follows hacked mode each frame.
 */
export function NetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let raf = 0;
    let running = false;
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    const pointer = { x: -1e4, y: -1e4 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const rgb =
        document.documentElement.getAttribute("data-hacked") === "true"
          ? "239,68,68"
          : "6,182,212";

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            ctx.strokeStyle = `rgba(${rgb},${0.14 * (1 - Math.sqrt(d2) / LINK_DIST)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        const pdx = a.x - pointer.x;
        const pdy = a.y - pointer.y;
        const pd2 = pdx * pdx + pdy * pdy;
        if (pd2 < POINTER_DIST * POINTER_DIST) {
          ctx.strokeStyle = `rgba(${rgb},${0.35 * (1 - Math.sqrt(pd2) / POINTER_DIST)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }

        ctx.fillStyle = `rgba(${rgb},0.5)`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (running || reducedMotion) return;
      running = true;
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = width < 640 ? 28 : 60;
      if (nodes.length !== count) {
        nodes = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
        }));
      }
      draw();
    };

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Animate only while the hero is on screen — a hidden rAF loop would
    // otherwise keep burning frames for the entire scroll depth of the page.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    io.observe(canvas);

    // Window-level: coordinates far outside the canvas simply never pass the
    // distance check, so no leave handler is needed.
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
    />
  );
}
