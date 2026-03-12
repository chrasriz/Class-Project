"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SITE_CONFIG } from "@/lib/constants";
import { fadeUp } from "@/lib/animations";

// Characters used for the scramble effect
const CIPHER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>{}[]=/\\|~^";

// Matrix rain column
function MatrixColumn({ delay, duration, left }: { delay: number; duration: number; left: string }) {
  const chars = useRef(
    Array.from({ length: 12 }, () => CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)])
  ).current;

  return (
    <div
      className="matrix-column absolute top-0 text-[10px] font-mono leading-[14px] text-cyan/30 pointer-events-none select-none"
      style={{
        left,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      {chars.map((char, i) => (
        <div key={i} style={{ opacity: 1 - i * 0.08 }}>
          {char}
        </div>
      ))}
    </div>
  );
}

// Scramble text hook — decrypts text character by character
// scrambleCycles = how many random-character ticks to show before the whole string starts resolving
function useScrambleText(target: string, active: boolean, speed = 40, scrambleCycles = 12) {
  const [display, setDisplay] = useState(() =>
    Array.from({ length: target.length }, () => CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)]).join("")
  );
  const [done, setDone] = useState(false);
  const frameRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const tickRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    tickRef.current = 0;
    setDone(false);

    frameRef.current = setInterval(() => {
      tickRef.current += 1;
      const tick = tickRef.current;

      // Phase 1: pure scramble — all characters stay random
      if (tick <= scrambleCycles) {
        const scrambled = target.split("").map((char) => {
          if (char === " " || char === "@" || char === ".") return char;
          return CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
        });
        setDisplay(scrambled.join(""));
        return;
      }

      // Phase 2: reveal one character per tick
      const revealed = tick - scrambleCycles;

      if (revealed > target.length) {
        clearInterval(frameRef.current);
        setDisplay(target);
        setDone(true);
        return;
      }

      const result = target.split("").map((char, i) => {
        if (i < revealed) return char;
        if (char === " " || char === "@" || char === ".") return char;
        return CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
      });

      setDisplay(result.join(""));
    }, speed);

    return () => clearInterval(frameRef.current);
  }, [active, target, speed, scrambleCycles]);

  return { display, done };
}

// Status line component
function StatusLine({ label, value, delay, active }: { label: string; value: string; delay: number; active: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={active ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-3 font-mono text-xs"
    >
      <span className="text-subtle">{label}</span>
      <span className="flex-1 border-b border-dotted border-white/5" />
      <span className="text-cyan">{value}</span>
    </motion.div>
  );
}

// Channel card component
function ChannelCard({
  icon,
  label,
  value,
  href,
  delay,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  delay: number;
  active: boolean;
  onClick?: () => void;
}) {
  const Tag = href ? "a" : "button";
  const linkProps = href
    ? { href, target: href.startsWith("http") ? "_blank" : undefined, rel: href.startsWith("http") ? "noopener noreferrer" : undefined }
    : { onClick };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={active ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Tag
        {...(linkProps as Record<string, unknown>)}
        className="group block w-full text-left glass-card p-5 hover:border-cyan/30 transition-all duration-300 cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-cyan-dim flex items-center justify-center shrink-0 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-shadow duration-300">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-subtle mb-1">{label}</p>
            <p className="text-sm text-foreground truncate group-hover:text-cyan transition-colors duration-300">
              {value}
            </p>
          </div>
          <svg
            className="w-4 h-4 text-subtle ml-auto shrink-0 group-hover:text-cyan group-hover:translate-x-1 transition-all duration-300"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </Tag>
    </motion.div>
  );
}

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [phase, setPhase] = useState<"idle" | "scanning" | "decrypting" | "revealed">("idle");
  const [copied, setCopied] = useState(false);

  const email = SITE_CONFIG.email;
  const { display: scrambledEmail, done: emailRevealed } = useScrambleText(
    email,
    phase === "decrypting" || phase === "revealed",
    120
  );

  // Phase sequencing
  useEffect(() => {
    if (!isInView) return;
    // idle -> scanning -> decrypting -> revealed
    const t1 = setTimeout(() => setPhase("scanning"), 300);
    const t2 = setTimeout(() => setPhase("decrypting"), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isInView]);

  useEffect(() => {
    if (emailRevealed && phase === "decrypting") {
      setPhase("revealed");
    }
  }, [emailRevealed, phase]);

  const handleCopyEmail = useCallback(() => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [email]);

  // Matrix rain columns (deterministic positions)
  const matrixColumns = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${(i / 20) * 100}%`,
      delay: (i * 0.7) % 4,
      duration: 4 + (i % 3) * 2,
    }))
  ).current;

  return (
    <section id="contact" className="section-padding" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          label="Contact"
          title="Establish Connection"
          description="Initiating secure channel. All signals are encrypted end-to-end."
        />

        <div className="max-w-3xl mx-auto">
          {/* Main terminal card */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <GlassPanel variant="card" className="relative overflow-hidden">
              {/* Matrix rain background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                {isInView && matrixColumns.map((col) => (
                  <MatrixColumn key={col.id} left={col.left} delay={col.delay} duration={col.duration} />
                ))}
              </div>

              {/* Scan line */}
              {(phase === "scanning" || phase === "decrypting") && (
                <div className="scan-line absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan/60 to-transparent pointer-events-none z-10" />
              )}

              {/* Terminal content */}
              <div className="relative z-10 p-8 md:p-12">
                {/* Terminal header bar */}
                <div className="flex items-center gap-2 mb-8 pb-4 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <span className="ml-3 font-mono text-[10px] text-subtle tracking-wider">
                    SECURE_CHANNEL — RSA-4096 — AES-256-GCM
                  </span>
                  <div className="ml-auto flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      phase === "revealed" ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" :
                      phase === "idle" ? "bg-subtle" : "bg-cyan animate-pulse"
                    }`} />
                    <span className="font-mono text-[10px] text-subtle">
                      {phase === "idle" && "STANDBY"}
                      {phase === "scanning" && "SCANNING"}
                      {phase === "decrypting" && "DECRYPTING"}
                      {phase === "revealed" && "CONNECTED"}
                    </span>
                  </div>
                </div>

                {/* Status lines */}
                <div className="space-y-3 mb-10">
                  <StatusLine label="protocol" value="TLS 1.3" delay={0.5} active={isInView} />
                  <StatusLine label="cipher" value="AES-256-GCM" delay={0.8} active={isInView} />
                  <StatusLine label="key_exchange" value="X25519" delay={1.1} active={isInView} />
                  <StatusLine label="identity" value="verified" delay={1.4} active={isInView} />
                </div>

                {/* The big email reveal */}
                <div className="text-center mb-10">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={phase !== "idle" ? { opacity: 1 } : {}}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="font-mono text-[10px] uppercase tracking-[0.3em] text-subtle mb-4"
                  >
                    {phase === "scanning" && "/// scanning for signal ///"}
                    {phase === "decrypting" && "/// decrypting message ///"}
                    {phase === "revealed" && "/// signal established ///"}
                  </motion.p>

                  <div className="relative inline-block">
                    {/* Glow behind email */}
                    {phase === "revealed" && (
                      <div className="absolute inset-0 blur-2xl bg-cyan/10 scale-150 pointer-events-none" />
                    )}

                    <button
                      onClick={handleCopyEmail}
                      className="relative group cursor-pointer"
                      aria-label={`Copy email: ${email}`}
                    >
                      <span
                        className={`font-mono text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider transition-colors duration-500 ${
                          phase === "revealed" ? "text-cyan" : "text-foreground/80"
                        }`}
                      >
                        {phase === "idle" ? "█".repeat(email.length) : scrambledEmail}
                      </span>

                      {/* Copy tooltip */}
                      <span className={`absolute -bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-wider transition-all duration-300 ${
                        phase === "revealed" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                      }`}>
                        {copied ? (
                          <span className="text-emerald-400">COPIED TO CLIPBOARD</span>
                        ) : (
                          <span className="text-subtle group-hover:text-cyan">CLICK TO COPY</span>
                        )}
                      </span>
                    </button>
                  </div>

                  {/* Underline accent */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={phase === "revealed" ? { scaleX: 1 } : {}}
                    transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    className="mt-4 mx-auto h-[1px] max-w-xs bg-gradient-to-r from-transparent via-cyan/40 to-transparent origin-center"
                  />
                </div>

                {/* Access granted badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={phase === "revealed" ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.5, type: "spring", stiffness: 150, damping: 20 }}
                  className="flex items-center justify-center gap-2 mb-10"
                >
                  <div className="h-[1px] w-8 bg-emerald-400/30" />
                  <span className="font-mono text-[10px] tracking-[0.3em] text-emerald-400 uppercase">
                    access granted
                  </span>
                  <div className="h-[1px] w-8 bg-emerald-400/30" />
                </motion.div>

                {/* Channel cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <ChannelCard
                    icon={
                      <svg className="w-5 h-5 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    }
                    label="Primary Channel"
                    value={email}
                    href={`mailto:${email}`}
                    delay={1.8}
                    active={phase === "revealed"}
                  />
                  <ChannelCard
                    icon={
                      <svg className="w-5 h-5 text-cyan" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    }
                    label="Secure Network"
                    value="LinkedIn"
                    href={SITE_CONFIG.socials.linkedin}
                    delay={2.0}
                    active={phase === "revealed"}
                  />
                  <ChannelCard
                    icon={
                      <svg className="w-5 h-5 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    }
                    label="Base Location"
                    value={SITE_CONFIG.location}
                    delay={2.2}
                    active={phase === "revealed"}
                  />
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
