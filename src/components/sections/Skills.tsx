"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SKILLS } from "@/lib/constants";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useInView } from "@/hooks/useInView";

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const { ref, isInView } = useInView({ threshold: 0.5 });

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground">{name}</span>
        <span className="text-xs font-mono text-cyan">{level}%</span>
      </div>
      <div className="skill-bar">
        <div
          className="skill-bar-fill"
          style={{
            transform: isInView ? `scaleX(${level / 100})` : "scaleX(0)",
            transitionDelay: `${delay * 80}ms`,
          }}
        />
      </div>
    </div>
  );
}

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
              <GlassPanel variant="card" className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                  <h3 className="text-lg font-semibold text-foreground tracking-tight">
                    {category.category}
                  </h3>
                </div>
                <div className="space-y-4">
                  {category.items.map((skill, j) => (
                    <SkillBar key={skill.name} name={skill.name} level={skill.level} delay={j} />
                  ))}
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
