"use client";

import { useEffect, useReducer, useRef } from "react";
import { m, useInView } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SITE_CONFIG, getEmail } from "@/lib/constants";
import { fadeUp } from "@/lib/animations";
import { useHacked } from "@/lib/hacked-context";
import { useContactReveal } from "@/lib/contact-reveal-context";
import { useAchievements } from "@/lib/achievements-context";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CIPHER_CHARS, useScramble } from "@/lib/scramble";
import {
  CONFIG_OPTIONS,
  INITIAL_CONTACT_STATE,
  contactReducer,
  isConfigured,
  isCriticallyInsecure,
  isOptionSecure,
  isSecureConfig,
  type ConfigKey,
} from "@/lib/contact-machine";

// Matrix rain columns — deterministic positions and glyphs so server and client
// render identically and no randomness runs during render.
const MATRIX_COLUMNS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(i / 20) * 100}%`,
  delay: (i * 0.7) % 4,
  duration: 4 + (i % 3) * 2,
  chars: Array.from(
    { length: 12 },
    (_, j) => CIPHER_CHARS[(i * 7 + j * 13) % CIPHER_CHARS.length]
  ),
}));

// Matrix rain column
function MatrixColumn({ delay, duration, left, chars }: { delay: number; duration: number; left: string; chars: string[] }) {
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

// Status line component — static (no dropdown)
function StatusLine({ label, value, delay, active, isInsecure, phase }: { label: string; value: string; delay: number; active: boolean; isInsecure?: boolean; phase?: string }) {
  return (
    <m.div
      initial={{ opacity: 0, x: -20 }}
      animate={active ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-3 font-mono text-xs"
    >
      <span className="text-subtle">{label}</span>
      <span className="flex-1 border-b border-dotted border-white/5" />
      <span className={
        isInsecure
          ? "text-red-400"
          : phase === "scanning" || phase === "decrypting"
          ? "text-amber-400 animate-pulse"
          : "text-cyan"
      }>
        {value}
      </span>
    </m.div>
  );
}

// Configurable status line with expandable dropdown
function ConfigLine({
  label,
  configKey,
  value,
  delay,
  active,
  expanded,
  isInsecure,
  onToggle,
  onSelect,
}: {
  label: string;
  configKey: ConfigKey;
  value: string;
  delay: number;
  active: boolean;
  expanded: boolean;
  isInsecure: boolean;
  onToggle: () => void;
  onSelect: (val: string) => void;
}) {
  const options = CONFIG_OPTIONS[configKey];

  return (
    <m.div
      initial={{ opacity: 0, x: -20 }}
      animate={active ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.4 }}
      className="font-mono text-xs"
    >
      <div className="flex items-center gap-3">
        <span className="text-subtle">{label}</span>
        <span className="flex-1 border-b border-dotted border-white/5" />
        <button
          onClick={onToggle}
          className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
            !value
              ? "text-subtle hover:text-foreground"
              : isInsecure ? "text-red-400 hover:text-red-300" : "text-cyan hover:text-cyan/80"
          }`}
        >
          {isInsecure && value && (
            <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          )}
          <span>{value || "—"}</span>
          <svg
            className={`w-3 h-3 text-subtle transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>

      {/* Dropdown options */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          expanded ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-wrap gap-1.5 pl-4">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              tabIndex={expanded ? undefined : -1}
              className={`px-2.5 py-1 rounded text-[11px] border transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5 ${
                opt.value === value
                  ? opt.secure
                    ? "text-cyan border-cyan/30 bg-cyan/10"
                    : "text-red-400 border-red-400/30 bg-red-400/10"
                  : opt.secure
                  ? "text-subtle border-white/5 hover:text-foreground hover:border-white/10 hover:bg-white/[0.03]"
                  : "text-red-400/60 border-red-400/10 hover:text-red-400 hover:border-red-400/20 hover:bg-red-400/[0.05]"
              }`}
            >
              {opt.value}
              {opt.tag && (
                <span className={`text-[9px] uppercase tracking-wider ${opt.secure ? "text-subtle" : "text-red-400/70"}`}>
                  {opt.tag}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </m.div>
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
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  delay: number;
  active: boolean;
}) {
  const external = href.startsWith("http");

  return (
    <m.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={active ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        // Cards are rendered invisible (opacity 0) until the reveal — keep
        // them out of the tab order and unclickable until then.
        tabIndex={active ? undefined : -1}
        aria-hidden={!active}
        className={`group block w-full text-left glass-card p-5 hover:border-cyan/30 transition-all duration-300 cursor-pointer ${
          active ? "" : "pointer-events-none"
        }`}
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
      </a>
    </m.div>
  );
}

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const reducedMotion = useReducedMotion();
  const [state, dispatch] = useReducer(contactReducer, INITIAL_CONTACT_STATE);
  const { phase, config, expandedLine, pendingChange, showConfigWarning } = state;
  const email = getEmail();
  const { isHacked, setHacked } = useHacked();
  const { revealEmail } = useContactReveal();
  const { unlock } = useAchievements();

  const allConfigured = isConfigured(config);
  const isSecure = isSecureConfig(config);
  const critical = isCriticallyInsecure(config);
  const isPendingInsecure = pendingChange
    ? !isOptionSecure(pendingChange.key, pendingChange.value)
    : false;

  const scrambledEmail = useScramble(email, phase === "decrypting" ? "decrypt" : "blocks", {
    speed: 120,
    scrambleTicks: 12,
    preserve: " @.",
    onDone: () => dispatch({ type: "SCRAMBLE_DONE" }),
  });

  // Timed transitions: scan dwell, and the near-instant breach when the user
  // decrypts through a critically insecure config. Cleanup cancels the timer
  // if the phase moves on (or the component unmounts) first.
  useEffect(() => {
    if (phase === "scanning") {
      const t = setTimeout(() => dispatch({ type: "SCAN_COMPLETE" }), 1500);
      return () => clearTimeout(t);
    }
    if (phase === "decrypting" && critical) {
      const t = setTimeout(() => dispatch({ type: "BREACH_COMPLETE" }), 50);
      return () => clearTimeout(t);
    }
  }, [phase, critical]);

  // Auto-dismiss the "configure first" warning.
  useEffect(() => {
    if (!showConfigWarning) return;
    const t = setTimeout(() => dispatch({ type: "HIDE_CONFIG_WARNING" }), 3000);
    return () => clearTimeout(t);
  }, [showConfigWarning]);

  // Terminal phases drive the global hacked mode: a breach engages it; a
  // successful decrypt through a secure config clears it and unmasks the
  // email everywhere else (footer, command palette).
  useEffect(() => {
    if (phase === "hacked") setHacked(true);
    if (phase === "revealed") {
      setHacked(false);
      revealEmail();
      unlock("decrypted_email");
    }
  }, [phase, setHacked, revealEmail, unlock]);

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
          <m.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <GlassPanel variant="card" className="relative overflow-hidden max-w-full">
              {/* Matrix rain background — skipped for prefers-reduced-motion */}
              {!reducedMotion && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                  {isInView && MATRIX_COLUMNS.map((col) => (
                    <MatrixColumn key={col.id} left={col.left} delay={col.delay} duration={col.duration} chars={col.chars} />
                  ))}
                </div>
              )}

              {/* Scan line */}
              {(phase === "scanning" || phase === "decrypting") && (
                <div className="scan-line absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan/60 to-transparent pointer-events-none z-10" />
              )}

              {/* Terminal content */}
              <div className="relative z-10 p-5 sm:p-8 md:p-12">
                {/* Terminal header bar */}
                <div className={`flex items-center gap-2 mb-8 pb-4 border-b overflow-hidden ${allConfigured && !isSecure ? "border-red-400/20" : "border-white/5"}`}>
                  <div className="flex gap-1.5 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className={`w-2.5 h-2.5 rounded-full ${allConfigured && !isSecure ? "bg-red-500/60" : "bg-green-500/60"}`} />
                  </div>
                  <span className={`ml-3 font-mono text-[10px] tracking-wider transition-colors duration-300 truncate hidden sm:inline ${allConfigured && !isSecure ? "text-red-400/80" : "text-subtle"}`}>
                    {!allConfigured
                      ? "UNCONFIGURED — select parameters above"
                      : isSecure
                      ? `SECURE_CHANNEL — ${config.key_exchange} — ${config.cipher}`
                      : `UNSECURE_CHANNEL — ${config.key_exchange} — ${config.cipher}`}
                  </span>
                  <div className="ml-auto flex items-center gap-2 shrink-0">
                    <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                      allConfigured && !isSecure ? "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]" :
                      phase === "revealed" ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" :
                      phase === "idle" ? "bg-subtle" : "bg-cyan animate-pulse"
                    }`} />
                    <span className={`font-mono text-[10px] transition-colors duration-300 ${allConfigured && !isSecure ? "text-red-400/80" : "text-subtle"}`}>
                      {allConfigured && !isSecure && "INSECURE"}
                      {(!allConfigured || isSecure) && phase === "idle" && "STANDBY"}
                      {isSecure && phase === "scanning" && "SCANNING"}
                      {isSecure && phase === "decrypting" && "DECRYPTING"}
                      {isSecure && phase === "revealed" && "CONNECTED"}
                    </span>
                  </div>
                </div>

                {/* Insecure channel warning banner */}
                {allConfigured && !isSecure && (
                  <m.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-6 border border-red-400/20 bg-red-400/[0.04] rounded-lg px-4 py-3 flex items-start gap-3"
                  >
                    <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <div>
                      <p className="font-mono text-[11px] text-red-400 tracking-wider font-medium">
                        WARNING: INSECURE CONFIGURATION DETECTED
                      </p>
                      <p className="font-mono text-[10px] text-red-400/60 mt-1 leading-relaxed">
                        Your connection uses deprecated or vulnerable settings.
                        An attacker could intercept or modify data in transit.
                        Proceed at your own risk.
                      </p>
                    </div>
                  </m.div>
                )}

                {/* Status lines */}
                <div className="space-y-3 mb-10">
                  <ConfigLine
                    label="Protocol"
                    configKey="protocol"
                    value={config.protocol}
                    delay={0.5}
                    active={isInView}
                    expanded={expandedLine === "protocol"}
                    isInsecure={config.protocol !== "" && !isOptionSecure("protocol", config.protocol)}
                    onToggle={() => dispatch({ type: "TOGGLE_LINE", key: "protocol" })}
                    onSelect={(value) => dispatch({ type: "SELECT_OPTION", key: "protocol", value })}
                  />
                  <ConfigLine
                    label="Cipher"
                    configKey="cipher"
                    value={config.cipher}
                    delay={0.8}
                    active={isInView}
                    expanded={expandedLine === "cipher"}
                    isInsecure={config.cipher !== "" && !isOptionSecure("cipher", config.cipher)}
                    onToggle={() => dispatch({ type: "TOGGLE_LINE", key: "cipher" })}
                    onSelect={(value) => dispatch({ type: "SELECT_OPTION", key: "cipher", value })}
                  />
                  <ConfigLine
                    label="Key Exchange"
                    configKey="key_exchange"
                    value={config.key_exchange}
                    delay={1.1}
                    active={isInView}
                    expanded={expandedLine === "key_exchange"}
                    isInsecure={config.key_exchange !== "" && !isOptionSecure("key_exchange", config.key_exchange)}
                    onToggle={() => dispatch({ type: "TOGGLE_LINE", key: "key_exchange" })}
                    onSelect={(value) => dispatch({ type: "SELECT_OPTION", key: "key_exchange", value })}
                  />
                  <StatusLine
                    label="Identity"
                    value={
                      !allConfigured
                        ? "awaiting configuration"
                        : !isSecure
                        ? "not verified"
                        : phase === "scanning" || phase === "decrypting"
                        ? "verifying..."
                        : phase === "revealed"
                        ? "verified"
                        : "pending"
                    }
                    delay={1.4}
                    active={isInView}
                    isInsecure={allConfigured && !isSecure}
                    phase={phase}
                  />
                </div>

                {/* Confirm change modal */}
                {pendingChange && (
                  <m.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 mx-auto max-w-sm"
                  >
                    <div className={`border rounded-lg p-4 text-center ${
                      isPendingInsecure
                        ? "border-red-400/30 bg-red-400/[0.05]"
                        : "border-amber-400/30 bg-amber-400/[0.05]"
                    }`}>
                      {isPendingInsecure && (
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                          </svg>
                          <p className="font-mono text-[11px] text-red-400 tracking-wider font-medium">
                            SECURITY DOWNGRADE
                          </p>
                        </div>
                      )}
                      <p className={`font-mono text-[11px] tracking-wider mb-1 ${isPendingInsecure ? "text-red-400" : "text-amber-400"}`}>
                        {isPendingInsecure ? "DOWNGRADE" : "RECONFIGURE"} {pendingChange.key.toUpperCase()}
                      </p>
                      <p className="font-mono text-xs text-muted mb-1">
                        Switch to <span className={isPendingInsecure ? "text-red-400" : "text-foreground"}>{pendingChange.value}</span>?
                      </p>
                      {isPendingInsecure ? (
                        <p className="font-mono text-[10px] text-red-400/60 mb-4">
                          This configuration is known to be vulnerable. Your connection will no longer be secure.
                        </p>
                      ) : (
                        <p className="font-mono text-[10px] text-muted mb-4">
                          This will require re-authentication.
                        </p>
                      )}
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => dispatch({ type: "CONFIRM_CHANGE" })}
                          className={`px-4 py-1.5 font-mono text-[11px] tracking-wider border rounded transition-colors cursor-pointer ${
                            isPendingInsecure
                              ? "text-red-400 border-red-400/30 bg-red-400/[0.05] hover:bg-red-400/10"
                              : "text-emerald-400 border-emerald-400/30 bg-emerald-400/[0.05] hover:bg-emerald-400/10"
                          }`}
                        >
                          {isPendingInsecure ? "PROCEED ANYWAY" : "CONFIRM"}
                        </button>
                        <button
                          onClick={() => dispatch({ type: "CANCEL_CHANGE" })}
                          className="px-4 py-1.5 font-mono text-[11px] tracking-wider text-subtle border border-white/10 rounded hover:text-foreground hover:border-white/20 transition-colors cursor-pointer"
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  </m.div>
                )}

                {/* The big email reveal */}
                <div className="text-center mb-10">
                  {/* Screen readers hear only scramble noise during the
                      animation — announce the real address once resolved. */}
                  <span className="sr-only" role="status">
                    {phase === "revealed" ? `Email address revealed: ${email}` : ""}
                  </span>
                  {phase === "idle" ? (
                    /* Decrypt button — shown before user initiates */
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-subtle mb-6">
                        {isHacked
                          ? "/// system compromised ///"
                          : critical
                          ? "/// critical vulnerability detected ///"
                          : "/// encrypted transmission ready ///"}
                      </p>
                      <span className="block font-mono text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider text-foreground/20 mb-8 select-none break-all">
                        {"█".repeat(email.length)}
                      </span>

                      <button
                        onClick={() => dispatch({ type: "DECRYPT_PRESSED" })}
                        className={`inline-flex items-center gap-2.5 px-6 py-3 font-mono text-sm tracking-wider border rounded-lg active:scale-95 transition-all duration-300 cursor-pointer ${
                          isHacked
                            ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/[0.05] hover:bg-emerald-400/10 hover:border-emerald-400/50"
                            : "text-cyan border-cyan/30 bg-cyan/[0.05] hover:bg-cyan/10 hover:border-cyan/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                        {isHacked ? "RESTORE SYSTEM" : "DECRYPT SIGNAL"}
                      </button>

                      {/* Config warning */}
                      {showConfigWarning && (
                        <m.p
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 font-mono text-[11px] text-amber-400 tracking-wider"
                        >
                          Configure all parameters above before decrypting
                        </m.p>
                      )}
                    </div>
                  ) : phase === "hacked" ? (
                    /* Hacked / policy violation state */
                    <m.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-400 mb-6">
                        {"/// SYSTEM BREACH DETECTED ///"}
                      </p>
                      <span className="block font-mono text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider text-red-500/40 mb-8 select-none break-all hacked-text-pulse">
                        {"█".repeat(email.length)}
                      </span>
                      <div className="max-w-sm mx-auto border border-red-500/30 bg-red-500/[0.06] rounded-lg p-5 text-center">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                          <span className="font-mono text-xs tracking-wider text-red-500 font-medium hacked-text-pulse">
                            POLICY VIOLATION
                          </span>
                        </div>
                        <p className="font-mono text-[11px] text-red-400 leading-relaxed mb-2">
                          FATAL BREACH — ERR_TOTAL_COMPROMISE
                        </p>
                        <p className="font-mono text-[10px] text-red-400/60 leading-relaxed mb-4">
                          All security layers bypassed. Channel integrity destroyed.
                          Reconfigure all parameters to secure values and re-authenticate
                          to restore system integrity.
                        </p>
                        <p className="font-mono text-[9px] text-red-400/40 tracking-wider">
                          HINT: Change settings above to recommended values, then decrypt again.
                        </p>
                      </div>
                    </m.div>
                  ) : (
                    /* Scanning / Decrypting / Revealed states */
                    <div>
                      <m.p
                        key={phase}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="font-mono text-[10px] uppercase tracking-[0.3em] text-subtle mb-4"
                      >
                        {phase === "scanning" && "/// scanning for signal ///"}
                        {phase === "decrypting" && "/// decrypting message ///"}
                        {phase === "revealed" && "/// signal established ///"}
                      </m.p>

                      <div className="relative inline-block max-w-full">
                        {phase === "revealed" && (
                          <div className="absolute inset-0 blur-2xl bg-cyan/10 scale-150 pointer-events-none" />
                        )}

                        {phase === "scanning" ? (
                          /* During scanning, show blocks */
                          <span className="font-mono text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider text-foreground/20 select-none break-all">
                            {"█".repeat(email.length)}
                          </span>
                        ) : phase === "revealed" ? (
                          /* Once revealed, show the real email as mailto link */
                          <a
                            href={`mailto:${email}`}
                            className="relative group"
                            aria-label={`Send email to ${email}`}
                          >
                            <span className="font-mono text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider text-cyan hover:text-cyan/80 transition-colors duration-300 break-all">
                              {email}
                            </span>
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-wider text-subtle group-hover:text-cyan transition-colors duration-300 whitespace-nowrap">
                              SEND EMAIL
                            </span>
                          </a>
                        ) : (
                          /* During decrypting, show the scramble animation */
                          <span className="font-mono text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider text-foreground/80 break-all">
                            {scrambledEmail}
                          </span>
                        )}
                      </div>

                      <m.div
                        initial={{ scaleX: 0 }}
                        animate={phase === "revealed" ? { scaleX: 1 } : {}}
                        transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
                        className="mt-12 mx-auto h-[1px] max-w-xs bg-gradient-to-r from-transparent via-cyan/40 to-transparent origin-center"
                      />
                    </div>
                  )}
                </div>

                {/* Access granted badge */}
                <m.div
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
                </m.div>

                {/* Channel cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                  <ChannelCard
                    icon={
                      <svg className="w-5 h-5 text-cyan" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    }
                    label="Secure Network"
                    value="LinkedIn"
                    href={SITE_CONFIG.socials.linkedin}
                    delay={1.8}
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
                    href={`https://maps.google.com/?q=${encodeURIComponent(SITE_CONFIG.location)}`}
                    delay={2.0}
                    active={phase === "revealed"}
                  />
                </div>
              </div>
            </GlassPanel>
          </m.div>
        </div>
      </div>
    </section>
  );
}
