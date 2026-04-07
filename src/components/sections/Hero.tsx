"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE_CONFIG } from "@/lib/constants";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HackedOverlay } from "@/components/ui/HackedOverlay";

const TITLES = [
  "Cybersecurity Analyst",
  "IT Professional",
  "Network Security Specialist",
];

function StatusBadge() {
  const [statusText, setStatusText] = useState("Available for opportunities");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [password, setPassword] = useState("");
  const [editText, setEditText] = useState("");
  const [authError, setAuthError] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const editRef = useRef<HTMLInputElement>(null);

  // Fetch current status on mount
  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((d) => { if (d.text) setStatusText(d.text); })
      .catch(() => {});
  }, []);

  const handleBadgeClick = useCallback(() => {
    if (isAdmin) {
      setEditText(statusText);
      setShowEdit(true);
      setTimeout(() => editRef.current?.focus(), 50);
    } else {
      setShowAuth(true);
      setAuthError(false);
      setPassword("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isAdmin, statusText]);

  const handleAuth = useCallback(async () => {
    if (!password.trim()) return;
    try {
      const res = await fetch("/api/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: statusText, password: password.trim() }),
      });
      if (res.ok) {
        setIsAdmin(true);
        setShowAuth(false);
        setPassword("");
        setAuthError(false);
      } else {
        setAuthError(true);
      }
    } catch {
      setAuthError(true);
    }
  }, [password, statusText]);

  const handleSave = useCallback(async () => {
    if (!editText.trim() || saving) return;
    setSaving(true);
    try {
      const stored = sessionStorage.getItem("admin_pw") || password;
      const res = await fetch("/api/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editText.trim(), password: stored }),
      });
      if (res.ok) {
        const data = await res.json();
        setStatusText(data.text);
        setShowEdit(false);
      }
    } catch {
      // silent fail
    } finally {
      setSaving(false);
    }
  }, [editText, saving, password]);

  // Store password in session for subsequent edits
  useEffect(() => {
    if (isAdmin && password) {
      sessionStorage.setItem("admin_pw", password);
    }
  }, [isAdmin, password]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className={`inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border bg-surface/50 backdrop-blur-sm transition-all duration-300 ${
          isAdmin ? "border-cyan/30 cursor-pointer hover:border-cyan/50" : "border-border cursor-default"
        }`}
        onClick={handleBadgeClick}
        title={isAdmin ? "Click to edit status" : undefined}
      >
        <span className="relative flex h-2 w-2">
          <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        <span className="text-xs font-medium text-muted tracking-wide">
          {statusText}
        </span>
        {isAdmin && (
          <svg className="w-3 h-3 text-cyan/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
          </svg>
        )}
      </motion.div>

      {/* Auth modal */}
      <AnimatePresence>
        {showAuth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAuth(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 glass-card p-6 max-w-xs w-full text-center"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle mb-4">
                Admin Authentication
              </p>
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setAuthError(false); }}
                onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                placeholder="Enter password"
                className={`w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border font-mono text-sm text-foreground placeholder:text-subtle outline-none transition-colors ${
                  authError ? "border-red-400/50" : "border-border focus:border-cyan/40"
                }`}
              />
              {authError && (
                <p className="mt-2 font-mono text-[10px] text-red-400">
                  Invalid password
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleAuth}
                  className="flex-1 px-4 py-2 font-mono text-[11px] tracking-wider text-cyan border border-cyan/30 rounded-lg hover:bg-cyan/10 transition-colors cursor-pointer"
                >
                  AUTHENTICATE
                </button>
                <button
                  onClick={() => setShowAuth(false)}
                  className="px-4 py-2 font-mono text-[11px] tracking-wider text-subtle border border-white/10 rounded-lg hover:text-foreground transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit modal */}
      <AnimatePresence>
        {showEdit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEdit(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 glass-card p-6 max-w-xs w-full text-center"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle mb-4">
                Edit Status
              </p>
              <input
                ref={editRef}
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                maxLength={100}
                className="w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border border-border font-mono text-sm text-foreground placeholder:text-subtle outline-none focus:border-cyan/40 transition-colors"
              />
              <p className="mt-1 text-right font-mono text-[9px] text-subtle">
                {editText.length}/100
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-4 py-2 font-mono text-[11px] tracking-wider text-cyan border border-cyan/30 rounded-lg hover:bg-cyan/10 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saving ? "SAVING..." : "SAVE"}
                </button>
                <button
                  onClick={() => setShowEdit(false)}
                  className="px-4 py-2 font-mono text-[11px] tracking-wider text-subtle border border-white/10 rounded-lg hover:text-foreground transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Hero() {
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % TITLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <HackedOverlay />
      {/* Hero glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Status badge */}
        <StatusBadge />

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: [0, 0, 0.2, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="text-gradient">{SITE_CONFIG.name}</span>
        </motion.h1>

        {/* Animated title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="h-10 mb-8 overflow-hidden"
        >
          <motion.p
            key={titleIndex}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-lg md:text-xl text-cyan font-mono tracking-wide"
          >
            {TITLES[titleIndex]}
          </motion.p>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.7 }}
          className="max-w-2xl mx-auto text-muted text-base md:text-lg leading-relaxed mb-12"
        >
          Securing networks. Engineering resilient systems. Building the
          infrastructure that protects what matters most.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton href="#experience" variant="primary">
            View Experience
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </MagneticButton>
          <MagneticButton href="#contact" variant="secondary">
            Establish Connection
          </MagneticButton>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[10px] font-mono text-subtle tracking-widest uppercase">
              Scroll
            </span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-subtle to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
