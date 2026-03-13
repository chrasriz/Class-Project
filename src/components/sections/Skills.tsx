"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SKILLS } from "@/lib/constants";
import { fadeUp, staggerContainer } from "@/lib/animations";

// Per-category hover color themes
const CATEGORY_COLORS: Record<string, { text: string; border: string; bg: string; shadow: string }> = {
  "Security Operations": {
    text: "hover:text-cyan",
    border: "hover:border-cyan/30",
    bg: "hover:bg-cyan/[0.04]",
    shadow: "hover:shadow-[0_0_12px_rgba(6,182,212,0.08)]",
  },
  "Network Security": {
    text: "hover:text-emerald-400",
    border: "hover:border-emerald-400/30",
    bg: "hover:bg-emerald-400/[0.04]",
    shadow: "hover:shadow-[0_0_12px_rgba(52,211,153,0.08)]",
  },
  "Access & Compliance": {
    text: "hover:text-amber-400",
    border: "hover:border-amber-400/30",
    bg: "hover:bg-amber-400/[0.04]",
    shadow: "hover:shadow-[0_0_12px_rgba(251,191,36,0.08)]",
  },
  "Infrastructure & Tools": {
    text: "hover:text-violet-400",
    border: "hover:border-violet-400/30",
    bg: "hover:bg-violet-400/[0.04]",
    shadow: "hover:shadow-[0_0_12px_rgba(167,139,250,0.08)]",
  },
};

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
    <section id="skills" className="section-padding">
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
              <GlassPanel variant="card" className="p-8 h-full">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center">
                    {CATEGORY_ICONS[category.category]}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground tracking-tight">
                    {category.category}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {category.items.map((skill) => {
                    const colors = CATEGORY_COLORS[category.category] || CATEGORY_COLORS["Security Operations"];
                    return (
                      <span
                        key={skill.name}
                        className={`group/tag relative px-3.5 py-2 text-sm text-muted bg-white/[0.03] border border-border rounded-lg ${colors.text} ${colors.border} ${colors.bg} ${colors.shadow} transition-all duration-300 cursor-default`}
                      >
                        {skill.name}
                        {/* Percentage tooltip — absolute so it doesn't affect layout */}
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-surface border border-border font-mono text-xs text-muted opacity-0 group-hover/tag:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                          {skill.level}%
                        </span>
                      </span>
                    );
                  })}
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
