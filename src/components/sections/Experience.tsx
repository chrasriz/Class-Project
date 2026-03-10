"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EXPERIENCE, CERTIFICATIONS } from "@/lib/constants";
import { fadeUp, staggerContainer } from "@/lib/animations";

const TYPE_STYLES = {
  work: { color: "bg-cyan", label: "Work" },
  certification: { color: "bg-amber-400", label: "Certification" },
  education: { color: "bg-violet-400", label: "Education" },
};

export function Experience() {
  return (
    <section id="experience" className="section-padding">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          label="Experience"
          title="Professional Timeline"
          description="Career progression across cybersecurity, networking, and systems engineering."
        />

        {/* Timeline */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative max-w-3xl mx-auto"
        >
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-[0.5px] top-0 bottom-0 w-[1px] bg-border" />

          {EXPERIENCE.map((item, i) => {
            const style = TYPE_STYLES[item.type];
            const isLeft = i % 2 === 0;

            return (
              <motion.div
                key={`${item.title}-${item.period}`}
                variants={fadeUp}
                className={`relative flex items-start gap-6 mb-12 ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 mt-2 z-10">
                  <div className={`w-3 h-3 rounded-full ${style.color} ring-4 ring-background`} />
                </div>

                {/* Content */}
                <div
                  className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${
                    isLeft ? "md:pr-8 md:text-right" : "md:pl-8"
                  }`}
                >
                  <span className="inline-block mb-2 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted bg-white/5 rounded border border-border">
                    {item.period}
                  </span>
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-cyan mb-2">{item.organization}</p>
                  <p className="text-sm text-muted leading-relaxed">
                    {item.description}
                  </p>
                  <span
                    className={`inline-block mt-3 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded ${
                      item.type === "work"
                        ? "text-cyan bg-cyan-dim"
                        : item.type === "certification"
                        ? "text-amber-400 bg-amber-400/10"
                        : "text-violet-400 bg-violet-400/10"
                    }`}
                  >
                    {style.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Certifications Grid */}
        <div className="mt-24">
          <SectionHeading
            label="Credentials"
            title="Certifications & Education"
            description="Industry-recognized credentials validating technical expertise."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto"
          >
            {CERTIFICATIONS.map((cert) => (
              <motion.div key={cert.name} variants={fadeUp}>
                <div className="glass-card p-6 text-center">
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    {cert.name}
                  </h4>
                  <p className="text-xs text-cyan mb-3">{cert.issuer}</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xs text-muted">{cert.year}</span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded ${
                        cert.status === "Active"
                          ? "text-emerald-400 bg-emerald-400/10"
                          : "text-amber-400 bg-amber-400/10"
                      }`}
                    >
                      {cert.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
