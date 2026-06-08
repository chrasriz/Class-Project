"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TiltCard } from "@/components/ui/TiltCard";
import { SKILLS } from "@/lib/constants";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { HackedOverlay } from "@/components/ui/HackedOverlay";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Security Operations": (
    <svg className="w-5 h-5 text-cyan" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  "Network Security": (
    <svg className="w-5 h-5 text-cyan" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  ),
  "Access & Compliance": (
    <svg className="w-5 h-5 text-cyan" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  "Infrastructure & Tools": (
    <svg className="w-5 h-5 text-cyan" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
};

export function Skills() {
  return (
    <section id="skills" className="section-padding relative">
      <HackedOverlay />
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          label="Capabilities"
          title="Technical Arsenal"
          description="Core competencies across cybersecurity, networking, infrastructure, and automation."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {SKILLS.map((category) => (
            <motion.div key={category.category} variants={fadeUp}>
              <TiltCard className="h-full">
                <GlassPanel variant="card" className="p-8 h-full">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center">
                      {CATEGORY_ICONS[category.category]}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground tracking-tight">
                      {category.category}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {category.items.map((skill) => (
                      <div key={skill.name} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm text-muted">{skill.name}</span>
                          <span className="font-mono text-xs text-subtle shrink-0">{skill.level}%</span>
                        </div>
                        <div className="skill-bar">
                          <motion.div
                            className="skill-bar-fill"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: skill.level / 100 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
                            style={{ originX: 0 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassPanel>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
