"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAME = "Rasikh";
const CIPHER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>{}[]=/\\|~^";

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
        <motion.div
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

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  // Phases: "init" → "bars" → "scramble" → "decrypt" → "done" → "glitch"
  const [phase, setPhase] = useState<"init" | "bars" | "scramble" | "decrypt" | "done" | "glitch">("init");
  const [displayText, setDisplayText] = useState("█".repeat(NAME.length));

  // Phase sequencing
  useEffect(() => {
    const decryptEnd = 2200 + NAME.length * 150 + 300;
    const glitchStart = decryptEnd + 1150; // 50ms after subtitle + tagline fully appear
    const exitTime = glitchStart + 750; // 50ms after glitch ends (700ms)

    const timers = [
      setTimeout(() => setPhase("bars"), 300),
      setTimeout(() => setPhase("scramble"), 800),
      setTimeout(() => setPhase("decrypt"), 2200),
      setTimeout(() => setPhase("done"), decryptEnd),
      setTimeout(() => setPhase("glitch"), glitchStart),
      setTimeout(() => setLoading(false), exitTime),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Scramble / decrypt text effect
  useEffect(() => {
    if (phase === "init" || phase === "bars") {
      setDisplayText("█".repeat(NAME.length));
      return;
    }

    if (phase === "scramble") {
      const interval = setInterval(() => {
        setDisplayText(
          NAME.split("")
            .map(() => CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)])
            .join("")
        );
      }, 50);
      return () => clearInterval(interval);
    }

    if (phase === "decrypt") {
      let revealed = 0;
      const interval = setInterval(() => {
        revealed++;
        if (revealed > NAME.length) {
          clearInterval(interval);
          setDisplayText(NAME);
          return;
        }
        setDisplayText(
          NAME.split("")
            .map((char, i) => {
              if (i < revealed) return char;
              return CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
            })
            .join("")
        );
      }, 150);
      return () => clearInterval(interval);
    }

    // phase === "done" or "glitch" — keep final text
    setDisplayText(NAME);
  }, [phase]);

  const showBars = phase !== "init";
  const showSpeedLines = phase === "scramble" || phase === "decrypt";
  const showSubtitle = phase === "done" || phase === "glitch";
  const isGlitching = phase === "glitch";

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.05 }}
          className="loading-screen"
          role="status"
          aria-label="Loading"
        >
          {/* Cinematic letterbox bars */}
          <motion.div
            className="absolute top-0 left-0 right-0 bg-black z-20"
            initial={{ height: "0%" }}
            animate={{ height: showBars ? "8%" : "0%" }}
            exit={{ height: "0%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-black z-20"
            initial={{ height: "0%" }}
            animate={{ height: showBars ? "8%" : "0%" }}
            exit={{ height: "0%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* Speed lines during scramble/decrypt */}
          {showSpeedLines && <SpeedLines />}

          {/* Radial glow */}
          <motion.div
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
          </motion.div>

          {/* Screen flash when decrypt starts */}
          <motion.div
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
          <motion.div
            className={`relative z-10 flex items-center justify-center ${isGlitching ? "crt-glitch" : ""}`}
            animate={showSubtitle && !isGlitching ? { scale: [1, 1.03, 1] } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex items-baseline">
              {/* Name characters — only visible once scramble starts */}
              <motion.span
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
              </motion.span>

              {/* The dot */}
              <motion.span
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
              </motion.span>
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="absolute bottom-[28%] text-xs sm:text-sm font-mono tracking-[0.4em] uppercase z-10"
            initial={{ opacity: 0, y: 15, letterSpacing: "0.6em" }}
            animate={
              showSubtitle
                ? { opacity: 1, y: 0, letterSpacing: "0.4em", color: "rgba(6,182,212,0.7)" }
                : {}
            }
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Cybersecurity Analyst
          </motion.p>

          {/* Bottom tagline */}
          <motion.div
            className="absolute bottom-[12%] flex items-center gap-3 z-10"
            initial={{ opacity: 0 }}
            animate={showSubtitle ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-cyan/40" />
            <span className="text-[10px] font-mono text-subtle tracking-widest uppercase">
              Securing what matters
            </span>
            <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-cyan/40" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
