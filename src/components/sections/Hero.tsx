"use client";

import { useEffect, useState } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { SITE_CONFIG } from "@/lib/constants";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HackedOverlay } from "@/components/ui/HackedOverlay";
import { NetworkGraph } from "@/components/ui/NetworkGraph";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const TITLES = [
  "Cybersecurity Analyst",
  "IT Professional",
  "Network Security Specialist",
];

export function Hero() {
  const [titleIndex, setTitleIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  // Subtle parallax: the glow lags behind the content as you scroll away.
  const glowY = useTransform(scrollY, [0, 600], [0, 120]);

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
      <NetworkGraph />
      {/* Hero glow — wrapper keeps the CSS centering transform, since the
          motion y value would otherwise overwrite it */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <m.div
          style={{ y: reducedMotion ? 0 : glowY }}
          className="w-[800px] h-[400px] bg-cyan/5 rounded-full blur-[150px]"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Name */}
        <m.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0, 0, 0.2, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="text-gradient">{SITE_CONFIG.name}</span>
        </m.h1>

        {/* Animated title */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="h-10 mb-8 overflow-hidden"
        >
          <m.p
            key={titleIndex}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-lg md:text-xl text-cyan font-mono tracking-wide"
          >
            {TITLES[titleIndex]}
          </m.p>
        </m.div>

        {/* Tagline */}
        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="max-w-2xl mx-auto text-muted text-base md:text-lg leading-relaxed mb-12"
        >
          Securing networks. Engineering resilient systems. Building the
          infrastructure that protects what matters most.
        </m.p>

        {/* CTAs */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
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
        </m.div>

        {/* Scroll indicator */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <m.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[10px] font-mono text-subtle tracking-widest uppercase">
              Scroll
            </span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-subtle to-transparent" />
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
