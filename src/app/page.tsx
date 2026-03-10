"use client";

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
import { Projects } from "@/components/sections/Projects";
import { Lab } from "@/components/sections/Lab";

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <AmbientBackground />
      <CommandPalette />
      <Navigation />

      <main>
        <Hero />

        {/* Section divider */}
        <div className="glow-line max-w-xs mx-auto" />

        <About />
        <div className="glow-line max-w-xs mx-auto" />

        <Skills />
        <div className="glow-line max-w-xs mx-auto" />

        <Projects />
        <div className="glow-line max-w-xs mx-auto" />

        <Experience />
        <div className="glow-line max-w-xs mx-auto" />

        <Lab />
        <div className="glow-line max-w-xs mx-auto" />

        <Contact />
      </main>

      <Footer />
    </>
  );
}
