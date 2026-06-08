"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, SITE_CONFIG } from "@/lib/constants";
import { navReveal } from "@/lib/animations";
import { useHacked } from "@/lib/hacked-context";

const CIPHER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?";

function useScrambledLabel(text: string, active: boolean) {
  const [scrambled, setScrambled] = useState(text);

  useEffect(() => {
    if (!active) return;
    // Continuously scramble while active
    const id = setInterval(() => {
      setScrambled(
        text
          .split("")
          .map((ch) =>
            ch === " " ? " " : CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)]
          )
          .join("")
      );
    }, 80);
    return () => clearInterval(id);
  }, [active, text]);

  // While inactive, always render the real label — no state reset needed.
  return active ? scrambled : text;
}

function NavLabel({ label, isContact }: { label: string; isContact: boolean }) {
  const { isHacked } = useHacked();
  const scrambled = useScrambledLabel(label, isHacked && !isContact);
  return <>{scrambled}</>;
}

function LogoLabel() {
  const { isHacked } = useHacked();
  const scrambled = useScrambledLabel(SITE_CONFIG.name, isHacked);
  return <>{scrambled}</>;
}

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isHacked } = useHacked();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        variants={navReveal}
        initial="hidden"
        animate="visible"
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "py-3 bg-background/70 backdrop-blur-xl border-b border-border"
            : "py-5 bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="relative group">
            <span className="text-xl font-bold tracking-tight text-foreground">
              <LogoLabel />
            </span>
            <span className="text-cyan ml-0.5">.</span>
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cyan transition-all duration-300 group-hover:w-full" />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 text-sm transition-colors duration-300 group",
                  isHacked && item.label !== "Contact" ? "text-red-400/60 pointer-events-none" : "text-muted hover:text-foreground"
                )}
              >
                <NavLabel label={item.label} isContact={item.label === "Contact"} />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-cyan/50 transition-all duration-300 group-hover:w-3/4" />
              </a>
            ))}
            <a
              href="#contact"
              className={cn(
                "ml-4 px-5 py-2 text-sm font-medium border rounded-lg transition-all duration-300",
                isHacked
                  ? "text-red-400 border-red-400/30 hover:bg-red-400/10 animate-pulse"
                  : "text-cyan border-cyan/30 hover:bg-cyan/10"
              )}
            >
              {isHacked ? "FIX NOW" : "Get in Touch"}
            </a>
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle navigation"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block w-6 h-[1.5px] bg-foreground"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-6 h-[1.5px] bg-foreground"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block w-6 h-[1.5px] bg-foreground"
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-2xl md:hidden"
          >
            <nav className="flex flex-col items-center justify-center h-full gap-8">
              {NAV_ITEMS.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    setMobileOpen(false);
                    if (item.href.startsWith("#")) {
                      e.preventDefault();
                      setTimeout(() => {
                        const el = document.querySelector(item.href);
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }, 350);
                    }
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                  className={cn(
                    "text-2xl font-light transition-colors",
                    isHacked && item.label !== "Contact"
                      ? "text-red-400/60 pointer-events-none"
                      : "text-foreground hover:text-cyan"
                  )}
                >
                  <NavLabel label={item.label} isContact={item.label === "Contact"} />
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
