"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = ["R", "a", "s"];

// Cinematic rocket SVG with detail
function Rocket({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Intense exhaust flame with flicker */}
      <motion.g
        animate={{ opacity: [0.7, 1, 0.7], scaleX: [0.85, 1.15, 0.85] }}
        transition={{ duration: 0.1, repeat: Infinity }}
        style={{ transformOrigin: "12px 32px" }}
      >
        <ellipse cx="10" cy="32" rx="10" ry="6" fill="#fbbf24" opacity="0.9" />
        <ellipse cx="6" cy="32" rx="7" ry="4" fill="#f97316" opacity="0.8" />
        <ellipse cx="2" cy="32" rx="5" ry="2.5" fill="#ef4444" opacity="0.7" />
      </motion.g>
      {/* Body with metallic gradient */}
      <defs>
        <linearGradient id="bodyGrad" x1="24" y1="16" x2="24" y2="48">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <radialGradient id="windowGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M52 32c0-6-14-16-28-16v32c14 0 28-10 28-16z" fill="url(#bodyGrad)" />
      {/* Nose cone */}
      <path d="M52 32l10-4v8l-10-4z" fill="#22d3ee" />
      {/* Highlight stripe */}
      <path d="M26 18c10 0 22 6 24 12H26z" fill="white" opacity="0.08" />
      {/* Window with glow */}
      <circle cx="40" cy="32" r="5" fill="#050508" stroke="#22d3ee" strokeWidth="1.5" />
      <circle cx="40" cy="32" r="5" fill="url(#windowGlow)" />
      <circle cx="38.5" cy="30.5" r="1.5" fill="white" opacity="0.3" />
      {/* Fins with detail */}
      <path d="M24 16l-8-10v14z" fill="#0e7490" />
      <path d="M24 48l-8 10v-14z" fill="#0e7490" />
      <path d="M24 16l-4-5v7z" fill="#06b6d4" opacity="0.3" />
      <path d="M24 48l-4 5v-7z" fill="#06b6d4" opacity="0.3" />
    </svg>
  );
}

// Particle explosion when a letter is placed
function LetterExplosion({ active }: { active: boolean }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        angle: (i / 12) * 360,
        distance: 40 + Math.random() * 50,
        size: 2 + Math.random() * 3,
        duration: 0.5 + Math.random() * 0.4,
        color: i % 3 === 0 ? "#06b6d4" : i % 3 === 1 ? "#22d3ee" : "#fbbf24",
      })),
    []
  );

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
              boxShadow: `0 0 8px ${p.color}`,
              left: "50%",
              top: "50%",
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

// Speed lines streaking past
function SpeedLines() {
  const lines = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        top: Math.random() * 100,
        width: 30 + Math.random() * 120,
        delay: Math.random() * 2,
        duration: 0.4 + Math.random() * 0.4,
        opacity: 0.1 + Math.random() * 0.2,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {lines.map((line, i) => (
        <motion.div
          key={i}
          className="absolute h-[1px] bg-gradient-to-l from-cyan/40 to-transparent"
          style={{ top: `${line.top}%`, width: line.width, right: -line.width }}
          animate={{
            x: [0, -(window?.innerWidth || 1920) - line.width * 2],
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
  const [phase, setPhase] = useState(-1); // -1 = pre, 0/1/2 = letter delivery, 3 = finale
  const [explosions, setExplosions] = useState([false, false, false]);

  useEffect(() => {
    // Cinematic timing
    const timers = [
      setTimeout(() => setPhase(0), 400),
      setTimeout(() => {
        setPhase(1);
        setExplosions((p) => [true, p[1], p[2]]);
      }, 900),
      setTimeout(() => {
        setPhase(2);
        setExplosions((p) => [p[0], true, p[2]]);
      }, 1500),
      setTimeout(() => {
        setExplosions((p) => [p[0], p[1], true]);
        setPhase(3);
      }, 2100),
      setTimeout(() => setLoading(false), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="loading-screen"
          style={{ perspective: "1000px" }}
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

          {/* Speed lines background */}
          {phase >= 0 && phase < 3 && <SpeedLines />}

          {/* Radial glow behind letters */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{
              opacity: phase >= 3 ? 0.4 : phase >= 0 ? 0.15 : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="w-[500px] h-[500px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(6,182,212,0.3) 0%, rgba(6,182,212,0.05) 40%, transparent 70%)",
              }}
            />
          </motion.div>

          {/* Screen flash on each letter drop */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`flash-${i}`}
              className="absolute inset-0 bg-cyan/10 pointer-events-none z-10"
              initial={{ opacity: 0 }}
              animate={explosions[i] ? { opacity: [0.3, 0] } : {}}
              transition={{ duration: 0.3 }}
            />
          ))}

          {/* Main content */}
          <motion.div
            className="relative z-10 flex items-center justify-center"
            animate={
              phase === 3
                ? { scale: [1, 1.05, 1] }
                : {}
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Letters */}
            <div className="flex items-baseline">
              {LETTERS.map((letter, i) => (
                <div key={letter} className="relative">
                  {/* Explosion particles */}
                  <LetterExplosion active={explosions[i]} />

                  {/* The letter itself */}
                  <AnimatePresence>
                    {phase >= i + 1 && (
                      <motion.span
                        initial={{
                          scale: 3,
                          opacity: 0,
                          filter: "blur(20px)",
                          y: 20,
                        }}
                        animate={{
                          scale: 1,
                          opacity: 1,
                          filter: "blur(0px)",
                          y: 0,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 250,
                          damping: 18,
                        }}
                        className="text-7xl sm:text-8xl md:text-9xl font-bold inline-block"
                        style={{
                          textShadow:
                            "0 0 40px rgba(6,182,212,0.4), 0 0 80px rgba(6,182,212,0.2), 0 0 120px rgba(6,182,212,0.1)",
                          color: i === 0 ? "#22d3ee" : "#e4e4e7",
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
                className="text-7xl sm:text-8xl md:text-9xl font-bold text-cyan inline-block"
                initial={{ opacity: 0, scale: 0 }}
                animate={
                  phase >= 3
                    ? { opacity: 1, scale: [0, 1.5, 1] }
                    : {}
                }
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                }}
                style={{
                  textShadow:
                    "0 0 40px rgba(6,182,212,0.6), 0 0 80px rgba(6,182,212,0.3)",
                }}
              >
                .
              </motion.span>
            </div>

            {/* Rocket */}
            <motion.div
              className="absolute"
              initial={{ x: -400, y: 60, opacity: 0 }}
              animate={
                phase < 0
                  ? { x: -400, y: 60, opacity: 0 }
                  : phase === 0
                  ? {
                      x: [-400, -60],
                      y: [60, 0],
                      opacity: [0, 1],
                      rotate: [-15, 0],
                    }
                  : phase === 1
                  ? {
                      x: [-60, 0],
                      y: [0, -8, 0],
                      opacity: 1,
                      rotate: [0, 5, 0],
                    }
                  : phase === 2
                  ? {
                      x: [0, 50],
                      y: [0, -5, 0],
                      opacity: 1,
                      rotate: [0, 3, 0],
                    }
                  : {
                      x: [50, 600],
                      y: [0, -60],
                      opacity: [1, 1, 0],
                      rotate: [0, -20],
                    }
              }
              transition={{
                duration: phase === 0 ? 0.5 : phase === 3 ? 0.7 : 0.4,
                ease: phase === 3 ? [0.4, 0, 1, 1] : "easeOut",
              }}
            >
              {/* Rocket glow aura */}
              <div
                className="absolute -inset-4 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)",
                }}
              />
              <Rocket size={56} />

              {/* Trailing glow line */}
              <motion.div
                className="absolute top-1/2 right-full -translate-y-1/2 h-[3px] rounded-full"
                style={{
                  background:
                    "linear-gradient(to left, rgba(6,182,212,0.6), rgba(6,182,212,0.2), transparent)",
                }}
                animate={{ width: [30, 80, 30] }}
                transition={{ duration: 0.2, repeat: Infinity }}
              />
              {/* Secondary thin trail */}
              <motion.div
                className="absolute top-1/2 right-full -translate-y-1/2 mt-[2px] h-[1px]"
                style={{
                  background:
                    "linear-gradient(to left, rgba(251,191,36,0.4), transparent)",
                }}
                animate={{ width: [20, 60, 20] }}
                transition={{ duration: 0.15, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>

          {/* Subtitle that appears cinematically */}
          <motion.p
            className="absolute bottom-[28%] text-xs sm:text-sm font-mono tracking-[0.4em] uppercase z-10"
            initial={{ opacity: 0, y: 15, letterSpacing: "0.6em" }}
            animate={
              phase >= 3
                ? { opacity: 1, y: 0, letterSpacing: "0.4em", color: "rgba(6,182,212,0.7)" }
                : {}
            }
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Cybersecurity Analyst
          </motion.p>

          {/* Bottom tagline / dramatic flair */}
          <motion.div
            className="absolute bottom-[12%] flex items-center gap-3 z-10"
            initial={{ opacity: 0 }}
            animate={phase >= 3 ? { opacity: 1 } : {}}
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
