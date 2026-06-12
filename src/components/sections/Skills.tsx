"use client";

import { m } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TiltCard } from "@/components/ui/TiltCard";
import { SKILLS, type SkillTier } from "@/lib/constants";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { HackedOverlay } from "@/components/ui/HackedOverlay";

const TIER_META: Record<SkillTier, { label: string; filled: number }> = {
  core: { label: "Core", filled: 3 },
  advanced: { label: "Advanced", filled: 2 },
  working: { label: "Working", filled: 1 },
};

function TierMeter({ tier, delay }: { tier: SkillTier; delay: number }) {
  const { filled } = TIER_META[tier];
  return (
    <div className="flex gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <m.span
          key={i}
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={i < filled ? { opacity: 1, scaleX: 1 } : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: delay + i * 0.08 }}
          style={{ originX: 0 }}
          className={`w-3.5 h-1.5 rounded-full ${i < filled ? "bg-cyan" : "bg-white/10"}`}
        />
      ))}
    </div>
  );
}

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

        {/* Tier legend */}
        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="-mt-8 mb-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
        >
          {(Object.keys(TIER_META) as SkillTier[]).map((tier) => (
            <span key={tier} className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-subtle">
              <span className="flex gap-1" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`w-2.5 h-1 rounded-full ${i < TIER_META[tier].filled ? "bg-cyan/70" : "bg-white/10"}`}
                  />
                ))}
              </span>
              {TIER_META[tier].label}
            </span>
          ))}
        </m.div>

        <m.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {SKILLS.map((category) => (
            <m.div key={category.category} variants={fadeUp}>
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
                    {category.items.map((skill, i) => (
                      <div key={skill.name} className="flex items-center justify-between gap-3">
                        <span className="text-sm text-muted">{skill.name}</span>
                        <span
                          className="flex items-center gap-2.5 shrink-0"
                          title={`${TIER_META[skill.tier].label} proficiency`}
                        >
                          <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">
                            {TIER_META[skill.tier].label}
                          </span>
                          <TierMeter tier={skill.tier} delay={i * 0.05} />
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassPanel>
              </TiltCard>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}
