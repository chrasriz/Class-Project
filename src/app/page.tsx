"use client";

import { useState } from "react";
import { LazyMotion, domAnimation, m, MotionConfig } from "framer-motion";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { CommandPalette } from "@/components/CommandPalette";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { AchievementLayer } from "@/components/AchievementLayer";
import { Terminal } from "@/components/Terminal";
import { HackedProvider } from "@/lib/hacked-context";
import { ContactRevealProvider } from "@/lib/contact-reveal-context";
import { AchievementsProvider } from "@/lib/achievements-context";

function Divider() {
  return (
    <m.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="glow-line max-w-xs mx-auto"
    />
  );
}

export default function Home() {
  const [terminalOpen, setTerminalOpen] = useState(false);

  return (
    <HackedProvider>
      <ContactRevealProvider>
      <AchievementsProvider>
        {/* strict: every animated component must use `m.` so only the
            domAnimation feature bundle ships, not the full motion runtime */}
        <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <LoadingScreen />
          <AmbientBackground />
          <CommandPalette onOpenTerminal={() => setTerminalOpen(true)} />
          <Terminal open={terminalOpen} onOpenChange={setTerminalOpen} />
          <AchievementLayer />
          <Navigation />

          <main id="main-content">
            <Hero />

            <Divider />
            <About />
            <Divider />
            <Skills />
            <Divider />
            <Experience />
            <Divider />
            <Contact />
          </main>

          <Footer onOpenTerminal={() => setTerminalOpen(true)} />
        </MotionConfig>
        </LazyMotion>
      </AchievementsProvider>
      </ContactRevealProvider>
    </HackedProvider>
  );
}
