"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScramble, type ScrambleMode } from "@/lib/scramble";

const NAME = "Rasikh";
const DECRYPT_INTERVAL = 110; // ms per character during the decrypt reveal
const INTRO_SEEN_KEY = "rskh:intro-seen";

// Pre-computed speed line data outside the component
const SPEED_LINE_DATA = Array.from({ length: 15 }).map((_, i) => ({
  top: ((i * 37 + 11) % 100),
  width: 40 + ((i * 23 + 7) % 100),
  delay: ((i * 19 + 3) % 15) / 10,
  duration: 0.5 + ((i * 13 + 5) % 5) / 10,
  opacity: 0.08 + ((i * 17 + 9) % 15) / 100,
}));

function SpeedLines() {
  const [screenWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  if (!screenWidth) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {SPEED_LINE_DATA.map((line, i) => (
        <m.div
          key={i}
          className="absolute h-[1px] bg-gradient-to-l from-cyan/30 to-transparent"
          style={{
            top: `${line.top}%`,
            width: line.width,
            right: -line.width,
            willChange: "transform",
          }}
          animate={{
            x: [0, -(screenWidth + line.width * 2)],
            opacity: [0, line.opacity, 0],
          }}
          transition={{
            duration: line.duration,
            repeat: Infinity,
            delay: line.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

const PHASE_MODE: Record<string, ScrambleMode> = {
  init: "blocks",
  bars: "blocks",
  scramble: "loop",
  decrypt: "decrypt",
  done: "text",
  glitch: "text",
};

export function LoadingScreen() {
  const reducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(!reducedMotion);
  // Phases: "init" → "bars" → "scramble" → "decrypt" → "done" → "glitch"
  const [phase, setPhase] = useState<"init" | "bars" | "scramble" | "decrypt" | "done" | "glitch">("init");
  const displayText = useScramble(NAME, PHASE_MODE[phase], {
    speed: phase === "decrypt" ? DECRYPT_INTERVAL : 50,
  });

  // Phase sequencing — full cinematic once per session, skipped on revisits.
  useEffect(() => {
    // try/catch: a storage failure must never leave the opaque loader stuck.
    let introSeen = false;
    try {
      introSeen = sessionStorage.getItem(INTRO_SEEN_KEY) !== null;
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      // storage unavailable — treat as first visit
    }
    if (reducedMotion || introSeen) {
      // Deferred a frame: storage can't be read during render (hydration),
      // and setState directly in an effect body is a lint error.
      const skip = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(skip);
    }
    const decryptStart = 1250;
    const decryptEnd = decryptStart + NAME.length * DECRYPT_INTERVAL + 150;
    const glitchStart = decryptEnd + 600; // brief dwell on the resolved name + subtitle
    const exitTime = glitchStart + 450; // glitch flourish, then fade out (~3.1s total)

    const timers = [
      setTimeout(() => setPhase("bars"), 200),
      setTimeout(() => setPhase("scramble"), 450),
      setTimeout(() => setPhase("decrypt"), decryptStart),
      setTimeout(() => setPhase("done"), decryptEnd),
      setTimeout(() => setPhase("glitch"), glitchStart),
      setTimeout(() => setLoading(false), exitTime),
    ];
    return () => timers.forEach(clearTimeout);
  }, [reducedMotion]);

  const showBars = phase !== "init";
  const showSpeedLines = phase === "scramble" || phase === "decrypt";
  const showSubtitle = phase === "done" || phase === "glitch";
  const isGlitching = phase === "glitch";

  return (
    <AnimatePresence>
      {loading && (
        <m.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.05 }}
          className="loading-screen"
          role="status"
          aria-label="Loading"
        >
          {/* Cinematic letterbox bars */}
          <m.div
            className="absolute top-0 left-0 right-0 bg-black z-20"
            initial={{ height: "0%" }}
            animate={{ height: showBars ? "8%" : "0%" }}
            exit={{ height: "0%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          <m.div
            className="absolute bottom-0 left-0 right-0 bg-black z-20"
            initial={{ height: "0%" }}
            animate={{ height: showBars ? "8%" : "0%" }}
            exit={{ height: "0%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* Speed lines during scramble/decrypt */}
          {showSpeedLines && <SpeedLines />}

          {/* Radial glow */}
          <m.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{
              opacity: showSubtitle ? 0.4 : phase !== "init" ? 0.15 : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="w-[min(500px,80vw)] h-[min(500px,80vw)] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(6,182,212,0.3) 0%, rgba(6,182,212,0.05) 40%, transparent 70%)",
              }}
            />
          </m.div>

          {/* Screen flash when decrypt starts */}
          <m.div
            className="absolute inset-0 bg-cyan/10 pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={phase === "decrypt" ? { opacity: [0.15, 0] } : {}}
            transition={{ duration: 0.4 }}
          />

          {/* CRT glitch overlays */}
          {isGlitching && (
            <>
              {/* Static noise overlay */}
              <div className="absolute inset-0 static-noise opacity-20 pointer-events-none z-30 mix-blend-overlay" />
              {/* Horizontal tear lines */}
              <div className="glitch-tear z-30" style={{ animationDelay: "0s" }} />
              <div className="glitch-tear z-30" style={{ animationDelay: "0.05s" }} />
              <div className="glitch-tear z-30" style={{ animationDelay: "0.1s" }} />
              {/* RGB split overlay — red and blue shifted copies */}
              <div
                className="absolute inset-0 rgb-split pointer-events-none z-20 mix-blend-screen"
                style={{
                  background: "linear-gradient(90deg, rgba(255,0,0,0.08) 0%, transparent 30%, rgba(0,0,255,0.08) 70%, transparent 100%)",
                  transform: "translateX(3px)",
                }}
              />
            </>
          )}

          {/* Main content */}
          <m.div
            className={`relative z-10 flex items-center justify-center ${isGlitching ? "crt-glitch" : ""}`}
            animate={showSubtitle && !isGlitching ? { scale: [1, 1.03, 1] } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex items-baseline">
              {/* Name characters — only visible once scramble starts */}
              <m.span
                initial={{ opacity: 0 }}
                animate={phase === "scramble" || phase === "decrypt" || phase === "done" || phase === "glitch" ? { opacity: 1 } : {}}
                transition={{ duration: 0.3 }}
                className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold font-mono inline-block tracking-tight"
                style={{
                  willChange: "transform, opacity",
                }}
              >
                {displayText.split("").map((char, i) => (
                  <span
                    key={i}
                    style={{
                      color:
                        phase === "done" || (phase === "decrypt" && char === NAME[i])
                          ? i === 0
                            ? "#22d3ee"
                            : "#e4e4e7"
                          : "rgba(6,182,212,0.6)",
                      textShadow:
                        phase === "done" || (phase === "decrypt" && char === NAME[i])
                          ? "0 0 40px rgba(6,182,212,0.4), 0 0 80px rgba(6,182,212,0.2)"
                          : "0 0 20px rgba(6,182,212,0.15)",
                      transition: "color 0.2s ease, text-shadow 0.2s ease",
                    }}
                  >
                    {char}
                  </span>
                ))}
              </m.span>

              {/* The dot */}
              <m.span
                className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-cyan inline-block"
                initial={{ opacity: 0, scale: 0 }}
                animate={showSubtitle ? { opacity: 1, scale: [0, 1.3, 1] } : {}}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{
                  textShadow:
                    "0 0 40px rgba(6,182,212,0.6), 0 0 80px rgba(6,182,212,0.3)",
                }}
              >
                .
              </m.span>
            </div>
          </m.div>

          {/* Subtitle */}
          <m.p
            className="absolute bottom-[28%] text-xs sm:text-sm font-mono tracking-[0.4em] uppercase z-10"
            initial={{ opacity: 0, y: 15, letterSpacing: "0.6em" }}
            animate={
              showSubtitle
                ? { opacity: 1, y: 0, letterSpacing: "0.4em", color: "rgba(6,182,212,0.7)" }
                : {}
            }
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            Cybersecurity Analyst
          </m.p>

          {/* Bottom tagline */}
          <m.div
            className="absolute bottom-[12%] flex items-center gap-3 z-10"
            initial={{ opacity: 0 }}
            animate={showSubtitle ? { opacity: 1 } : {}}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-cyan/40" />
            <span className="text-[10px] font-mono text-subtle tracking-widest uppercase">
              Securing what matters
            </span>
            <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-cyan/40" />
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
