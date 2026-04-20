"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { CERTIFICATIONS, EXPERIENCE } from "@/lib/constants";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { HackedOverlay } from "@/components/ui/HackedOverlay";
import { useEscape } from "@/hooks/useEscape";

const STATS = [
  { value: "200+", label: "IT Issues Resolved", clickable: false },
  { value: "3", label: "Certifications", clickable: true, modalKey: "certs" as const },
  { value: "2+", label: "Years Experience", clickable: true, modalKey: "experience" as const },
  { value: "~20%", label: "Uptime Improvement", clickable: false },
];

const TRAITS = [
  { title: "Analytical Mindset", description: "Every system has a story. I read it through logs, traffic patterns, and behavioral anomalies." },
  { title: "Defense-First Architecture", description: "Security isn't an afterthought. I build systems where protection is foundational, not bolted on." },
  { title: "Continuous Learner", description: "Threat landscapes evolve daily. I stay ahead through constant research, lab work, and certification." },
  { title: "Systems Thinker", description: "I see interconnections where others see components. Understanding the whole system reveals its vulnerabilities." },
];

type ModalType = "certs" | "experience" | null;

function DetailModal({ type, onClose }: { type: ModalType; onClose: () => void }) {
  useEscape(type !== null, onClose);

  if (!type) return null;

  const workExperience = EXPERIENCE.filter((e) => e.type === "work");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={type === "certs" ? "Certifications" : "Work experience"}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg z-10"
        >
          <GlassPanel variant="card" className="p-6 sm:p-8">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-border-hover transition-all"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {type === "certs" ? (
              <>
                <h3 className="text-lg font-semibold text-foreground mb-1">Certifications</h3>
                <p className="text-xs text-muted mb-6">Active industry certifications</p>
                <div className="space-y-4">
                  {CERTIFICATIONS.map((cert) => (
                    <div
                      key={cert.name}
                      className="flex items-start justify-between gap-4 p-4 rounded-lg bg-white/[0.03] border border-border"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{cert.name}</p>
                        <p className="text-xs text-muted mt-0.5">{cert.issuer}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-mono text-emerald-400 bg-emerald-400/10 rounded">
                          {cert.status}
                        </span>
                        <p className="text-xs text-subtle mt-1">{cert.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-foreground mb-1">Work Experience</h3>
                <p className="text-xs text-muted mb-6">Professional roles and positions</p>
                <div className="space-y-4">
                  {workExperience.map((exp) => (
                    <div
                      key={exp.title}
                      className="p-4 rounded-lg bg-white/[0.03] border border-border"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className="text-sm font-medium text-foreground">{exp.title}</p>
                        <span className="text-[11px] font-mono text-cyan shrink-0">{exp.period}</span>
                      </div>
                      <p className="text-xs text-muted">{exp.organization}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </GlassPanel>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function About() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <section id="about" className="section-padding relative">
      <HackedOverlay />
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
              Based in Toronto, I work at the intersection of cybersecurity and IT infrastructure.
              From triaging Level-1 SIEM alerts and conducting malware analysis to providing hands-on
              IT support across university systems, I bring a defense-first mindset to every challenge.
            </p>
            <p className="text-muted leading-relaxed">
              With a CCNA, CompTIA Security+, and OPSWAT ICIP under my belt, I specialize in
              network reliability, access hardening, and SOC operations. I&apos;ve improved uptime by ~20%
              through proactive monitoring, implemented VLANs and ACLs to limit lateral movement,
              and secured services using HTTPS, SSH, and VPN with enforced IAM policies.
            </p>
            <p className="text-muted leading-relaxed">
              Currently pursuing a B.Sc. in Chemistry at York University while working as an IT
              Assistant at the Lassonde School of Engineering, and I thrive where technology meets
              real-world problem solving.
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
              <GlassPanel
                key={stat.label}
                variant="card"
                className={`p-6 text-center${
                  stat.clickable
                    ? " cursor-pointer hover:border-cyan/30 transition-colors group"
                    : ""
                }`}
                onClick={
                  stat.clickable ? () => setActiveModal(stat.modalKey!) : undefined
                }
              >
                <div className="text-3xl md:text-4xl font-bold text-gradient-cyan mb-2">
                  {stat.value}
                </div>
                <div className="text-xs text-muted tracking-wide uppercase">
                  {stat.label}
                </div>
                {stat.clickable && (
                  <div className="mt-2 text-[10px] text-cyan/50 group-hover:text-cyan/80 transition-colors">
                    Tap for details
                  </div>
                )}
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

      {/* Detail Modal */}
      {activeModal && (
        <DetailModal type={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </section>
  );
}
