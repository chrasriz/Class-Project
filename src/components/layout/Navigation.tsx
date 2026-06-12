"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, SITE_CONFIG } from "@/lib/constants";
import { navReveal } from "@/lib/animations";
import { useHacked } from "@/lib/hacked-context";
import { useScramble } from "@/lib/scramble";
import { useActiveSection } from "@/hooks/useActiveSection";

const SECTION_IDS = NAV_ITEMS.map((item) => item.href.slice(1));

function NavLabel({ label, isContact }: { label: string; isContact: boolean }) {
  const { isHacked } = useHacked();
  const scrambled = useScramble(label, isHacked && !isContact ? "loop" : "text", {
    speed: 80,
    preserve: " ",
  });
  return <>{scrambled}</>;
}

function LogoLabel() {
  const { isHacked } = useHacked();
  const scrambled = useScramble(SITE_CONFIG.name, isHacked ? "loop" : "text", { speed: 80 });
  return <>{scrambled}</>;
}

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isHacked } = useHacked();
  const activeSection = useActiveSection(SECTION_IDS);

  const { scrollYProgress } = useScroll();
  const progressX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    // Sync once on mount — the browser restores scroll position on reload
    // without firing a scroll event.
    onScroll();
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
      {/* Scroll progress bar */}
      <m.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-cyan origin-left z-[55] pointer-events-none"
        style={{ scaleX: progressX }}
        aria-hidden="true"
      />

      <m.header
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
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative px-4 py-2 text-sm transition-colors duration-300 group",
                    isHacked && item.label !== "Contact"
                      ? "text-red-400/60 pointer-events-none"
                      : isActive
                      ? "text-foreground"
                      : "text-muted hover:text-foreground"
                  )}
                >
                  <NavLabel label={item.label} isContact={item.label === "Contact"} />
                  <span
                    className={cn(
                      "absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-cyan/50 transition-all duration-300",
                      isActive ? "w-3/4" : "w-0 group-hover:w-3/4"
                    )}
                  />
                </a>
              );
            })}
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
            <m.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block w-6 h-[1.5px] bg-foreground"
            />
            <m.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-6 h-[1.5px] bg-foreground"
            />
            <m.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block w-6 h-[1.5px] bg-foreground"
            />
          </button>
        </div>
      </m.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-2xl md:hidden"
          >
            <nav className="flex flex-col items-center justify-center h-full gap-8">
              {NAV_ITEMS.map((item, i) => {
                const isActive = activeSection === item.href.slice(1);
                return (
                  <m.a
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
                        : isActive
                        ? "text-cyan"
                        : "text-foreground hover:text-cyan"
                    )}
                  >
                    <NavLabel label={item.label} isContact={item.label === "Contact"} />
                  </m.a>
                );
              })}
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
