"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { fadeUp, staggerContainer } from "@/lib/animations";

const STATS = [
  { value: "15+", label: "Projects Delivered" },
  { value: "5+", label: "Certifications" },
  { value: "3+", label: "Years Experience" },
  { value: "99.9%", label: "Uptime Maintained" },
];

const TRAITS = [
  { title: "Analytical Mindset", description: "Every system has a story — I read it through logs, traffic patterns, and behavioral anomalies." },
  { title: "Defense-First Architecture", description: "Security isn't an afterthought. I build systems where protection is foundational, not bolted on." },
  { title: "Continuous Learner", description: "Threat landscapes evolve daily. I stay ahead through constant research, lab work, and certification." },
  { title: "Systems Thinker", description: "I see interconnections where others see components. Understanding the whole system reveals its vulnerabilities." },
];

export function About() {
  return (
    <section id="about" className="section-padding">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          label="About"
          title="Building Secure Foundations"
          description="A cybersecurity professional driven by the belief that robust security enables innovation, not hinders it."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Story */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-muted leading-relaxed">
              Based in Toronto, I operate at the intersection of cybersecurity, network engineering,
              and infrastructure design. My work centers on understanding adversary behavior to
              build systems that anticipate and neutralize threats before they materialize.
            </p>
            <p className="text-muted leading-relaxed">
              I approach security as a discipline of precision — where every firewall rule, network
              segment, and monitoring alert serves a deliberate purpose. From SIEM deployment to
              zero-trust architecture, I focus on creating environments where security scales
              alongside the systems it protects.
            </p>
            <p className="text-muted leading-relaxed">
              My philosophy is simple: the best security infrastructure is invisible to those it
              protects and impenetrable to those it defends against.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {STATS.map((stat) => (
              <GlassPanel key={stat.label} variant="card" className="p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient-cyan mb-2">
                  {stat.value}
                </div>
                <div className="text-xs text-muted tracking-wide uppercase">
                  {stat.label}
                </div>
              </GlassPanel>
            ))}
          </motion.div>
        </div>

        {/* Traits */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {TRAITS.map((trait) => (
            <motion.div key={trait.title} variants={fadeUp}>
              <GlassPanel variant="subtle" className="p-6">
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {trait.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {trait.description}
                </p>
              </GlassPanel>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
