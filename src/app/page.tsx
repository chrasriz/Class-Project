"use client";

import { MotionConfig } from "framer-motion";
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
import { HackedProvider } from "@/lib/hacked-context";
import { ContactRevealProvider } from "@/lib/contact-reveal-context";

export default function Home() {
  return (
    <HackedProvider>
      <ContactRevealProvider>
        <MotionConfig reducedMotion="user">
          <LoadingScreen />
          <AmbientBackground />
          <CommandPalette />
          <Navigation />

          <main id="main-content">
            <Hero />

            {/* Section divider */}
            <div className="glow-line max-w-xs mx-auto" />

            <About />
            <div className="glow-line max-w-xs mx-auto" />

            <Skills />
            <div className="glow-line max-w-xs mx-auto" />

            <Experience />
            <div className="glow-line max-w-xs mx-auto" />

            <Contact />
          </main>

          <Footer />
        </MotionConfig>
      </ContactRevealProvider>
    </HackedProvider>
  );
}
