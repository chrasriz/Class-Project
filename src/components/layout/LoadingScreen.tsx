"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = ["R", "a", "s"];

function Rocket({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      aria-hidden="true"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Exhaust flame — slower flicker to avoid jank on high-res displays */}
      <motion.g
        animate={{ opacity: [0.7, 1, 0.7], scaleX: [0.9, 1.1, 0.9] }}
        transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "12px 32px", willChange: "transform, opacity" }}
      >
        <ellipse cx="10" cy="32" rx="10" ry="6" fill="#fbbf24" opacity="0.9" />
        <ellipse cx="6" cy="32" rx="7" ry="4" fill="#f97316" opacity="0.8" />
        <ellipse cx="2" cy="32" rx="5" ry="2.5" fill="#ef4444" opacity="0.7" />
      </motion.g>
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
      <path d="M52 32l10-4v8l-10-4z" fill="#22d3ee" />
      <path d="M26 18c10 0 22 6 24 12H26z" fill="white" opacity="0.08" />
      <circle cx="40" cy="32" r="5" fill="#050508" stroke="#22d3ee" strokeWidth="1.5" />
      <circle cx="40" cy="32" r="5" fill="url(#windowGlow)" />
      <circle cx="38.5" cy="30.5" r="1.5" fill="white" opacity="0.3" />
      <path d="M24 16l-8-10v14z" fill="#0e7490" />
      <path d="M24 48l-8 10v-14z" fill="#0e7490" />
      <path d="M24 16l-4-5v7z" fill="#06b6d4" opacity="0.3" />
      <path d="M24 48l-4 5v-7z" fill="#06b6d4" opacity="0.3" />
    </svg>
  );
}

// Pre-computed particle data outside the component to avoid impure calls during render
const PARTICLE_DATA = Array.from({ length: 8 }).map((_, i) => ({
  angle: (i / 8) * 360,
  distance: 40 + (((i * 17 + 7) % 13) / 13) * 40, // deterministic pseudo-random
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
  const [explosions, setExplosions] = useState([false, false, false]);
  const [vw] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1440
  );

  // Half the viewport width + buffer so rocket starts/exits fully offscreen
  const halfVw = vw / 2 + 100;

  useEffect(() => {
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

  const rocketStart = -halfVw;
  const rocketMid1 = -60;
  const rocketMid2 = 50;
  const rocketExit = halfVw;

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

          {/* Speed lines */}
          {phase >= 0 && phase < 3 && <SpeedLines />}

          {/* Radial glow */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{
              opacity: phase >= 3 ? 0.4 : phase >= 0 ? 0.15 : 0,
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
          {[0, 1, 2].map((i) => (
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
              phase === 3 ? { scale: [1, 1.03, 1] } : {}
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Letters */}
            <div className="flex items-baseline">
              {LETTERS.map((letter, i) => (
                <div key={letter} className="relative">
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
                  phase >= 3
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

            {/* Rocket — viewport-scaled positions */}
            <motion.div
              className="absolute"
              style={{ willChange: "transform, opacity" }}
              initial={{ x: rocketStart, y: 60, opacity: 0 }}
              animate={
                phase < 0
                  ? { x: rocketStart, y: 60, opacity: 0 }
                  : phase === 0
                  ? {
                      x: [rocketStart, rocketMid1],
                      y: [60, 0],
                      opacity: [0, 1],
                      rotate: [-15, 0],
                    }
                  : phase === 1
                  ? {
                      x: [rocketMid1, 0],
                      y: [0, -8, 0],
                      opacity: 1,
                      rotate: [0, 5, 0],
                    }
                  : phase === 2
                  ? {
                      x: [0, rocketMid2],
                      y: [0, -5, 0],
                      opacity: 1,
                      rotate: [0, 3, 0],
                    }
                  : {
                      x: [rocketMid2, rocketExit],
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
              <div
                className="absolute -inset-4 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)",
                }}
              />
              <Rocket size={56} />

              {/* Trailing glow */}
              <motion.div
                className="absolute top-1/2 right-full -translate-y-1/2 h-[2px] rounded-full"
                style={{
                  background:
                    "linear-gradient(to left, rgba(6,182,212,0.5), rgba(6,182,212,0.1), transparent)",
                  willChange: "width",
                }}
                animate={{ width: [30, 70, 30] }}
                transition={{ duration: 0.4, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>

          {/* Subtitle */}
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

          {/* Bottom tagline */}
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
