"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = ["R", "a", "s", "i", "k", "h"];

// Pre-computed particle data outside the component to avoid impure calls during render
const PARTICLE_DATA = Array.from({ length: 8 }).map((_, i) => ({
  angle: (i / 8) * 360,
  distance: 40 + (((i * 17 + 7) % 13) / 13) * 40,
  size: 2 + (((i * 11 + 3) % 7) / 7) * 2,
  duration: 0.5 + (((i * 13 + 5) % 11) / 11) * 0.3,
  color: i % 2 === 0 ? "#06b6d4" : "#22d3ee",
}));

function LetterExplosion({ active }: { active: boolean }) {
  const particles = PARTICLE_DATA;

  return (
    <AnimatePresence>
      {active &&
        particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 6px ${p.color}`,
              left: "50%",
              top: "50%",
              willChange: "transform, opacity",
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
              y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: p.duration, ease: "easeOut" }}
          />
        ))}
    </AnimatePresence>
  );
}

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

  const lines = SPEED_LINE_DATA;

  if (!screenWidth) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {lines.map((line, i) => (
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
  const [phase, setPhase] = useState(-1);
  const [explosions, setExplosions] = useState(LETTERS.map(() => false));

  useEffect(() => {
    const timers = [
      // Phase 0: cinematic bars + speed lines appear
      setTimeout(() => setPhase(0), 300),
      // Phases 1-6: each letter drops in with explosion
      ...LETTERS.map((_, i) =>
        setTimeout(() => {
          setPhase(i + 1);
          setExplosions((prev) => prev.map((v, j) => (j === i ? true : v)));
        }, 600 + i * 350)
      ),
      // Final phase: subtitle + tagline appear
      setTimeout(() => setPhase(LETTERS.length + 1), 600 + LETTERS.length * 350 + 100),
      // Stay visible for 2.5s after subtitle so it's readable
      setTimeout(() => setLoading(false), 600 + LETTERS.length * 350 + 2800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const finalPhase = LETTERS.length + 1;

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="loading-screen"
          role="status"
          aria-label="Loading"
        >
          {/* Cinematic letterbox bars */}
          <motion.div
            className="absolute top-0 left-0 right-0 bg-black z-20"
            initial={{ height: "0%" }}
            animate={{ height: phase >= 0 ? "8%" : "0%" }}
            exit={{ height: "0%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-black z-20"
            initial={{ height: "0%" }}
            animate={{ height: phase >= 0 ? "8%" : "0%" }}
            exit={{ height: "0%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* Speed lines during letter drops */}
          {phase >= 0 && phase < finalPhase && <SpeedLines />}

          {/* Radial glow */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{
              opacity: phase >= finalPhase ? 0.4 : phase >= 0 ? 0.15 : 0,
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

          {/* Screen flash on each letter drop */}
          {LETTERS.map((_, i) => (
            <motion.div
              key={`flash-${i}`}
              className="absolute inset-0 bg-cyan/10 pointer-events-none z-10"
              initial={{ opacity: 0 }}
              animate={explosions[i] ? { opacity: [0.2, 0] } : {}}
              transition={{ duration: 0.3 }}
            />
          ))}

          {/* Main content */}
          <motion.div
            className="relative z-10 flex items-center justify-center"
            animate={
              phase === finalPhase ? { scale: [1, 1.03, 1] } : {}
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Letters */}
            <div className="flex items-baseline">
              {LETTERS.map((letter, i) => (
                <div key={`${letter}-${i}`} className="relative">
                  <LetterExplosion active={explosions[i]} />
                  <AnimatePresence>
                    {phase >= i + 1 && (
                      <motion.span
                        initial={{
                          scale: 2.5,
                          opacity: 0,
                          filter: "blur(12px)",
                          y: 15,
                        }}
                        animate={{
                          scale: 1,
                          opacity: 1,
                          filter: "blur(0px)",
                          y: 0,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 20,
                        }}
                        className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold inline-block"
                        style={{
                          textShadow:
                            "0 0 40px rgba(6,182,212,0.4), 0 0 80px rgba(6,182,212,0.2)",
                          color: i === 0 ? "#22d3ee" : "#e4e4e7",
                          willChange: "transform, opacity, filter",
                        }}
                      >
                        {letter}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* The dot */}
              <motion.span
                className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-cyan inline-block"
                initial={{ opacity: 0, scale: 0 }}
                animate={
                  phase >= finalPhase
                    ? { opacity: 1, scale: [0, 1.3, 1] }
                    : {}
                }
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
              phase >= finalPhase
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
            animate={phase >= finalPhase ? { opacity: 1 } : {}}
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
