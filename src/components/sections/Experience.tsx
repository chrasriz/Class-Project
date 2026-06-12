"use client";

import { useRef } from "react";
import { m, useScroll, useSpring } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EXPERIENCE, CERTIFICATIONS } from "@/lib/constants";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { HackedOverlay } from "@/components/ui/HackedOverlay";
import { TiltCard } from "@/components/ui/TiltCard";

const slideFromLeft = {
  hidden: { opacity: 0, x: -120 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 120 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const TYPE_STYLES: Record<string, { color: string; label: string }> = {
  work: { color: "bg-cyan", label: "Work" },
  education: { color: "bg-violet-400", label: "Education" },
};

export function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });
  const lineProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <section id="experience" className="section-padding overflow-hidden relative">
      <HackedOverlay />
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          label="Experience"
          title="Professional Timeline"
          description="Career progression across cybersecurity, networking, and systems engineering."
        />

        {/* Timeline */}
        <m.div
          ref={timelineRef}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative max-w-3xl mx-auto"
        >
          {/* Vertical line (track) */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-[0.5px] top-0 bottom-0 w-[1px] bg-border" />
          {/* Vertical line (draws in as you scroll the timeline) */}
          <m.div
            style={{ scaleY: lineProgress }}
            className="absolute left-4 md:left-1/2 md:-translate-x-[0.5px] top-0 bottom-0 w-[1px] bg-cyan origin-top pointer-events-none"
            aria-hidden="true"
          />

          {EXPERIENCE.map((item, i) => {
            const style = TYPE_STYLES[item.type];
            const isLeft = i % 2 === 0;

            return (
              <m.div
                key={`${item.title}-${item.period}`}
                variants={isLeft ? slideFromLeft : slideFromRight}
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
                        : "text-violet-400 bg-violet-400/10"
                    }`}
                  >
                    {style.label}
                  </span>
                </div>
              </m.div>
            );
          })}
        </m.div>

        {/* Certifications Grid */}
        <div className="mt-24">
          <SectionHeading
            label="Credentials"
            title="Certifications & Education"
            description="Industry-recognized credentials validating technical expertise."
          />

          <m.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto"
          >
            {CERTIFICATIONS.map((cert) => (
              <m.div key={cert.name} variants={fadeUp}>
                <TiltCard>
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
                </TiltCard>
              </m.div>
            ))}
          </m.div>
        </div>
      </div>
    </section>
  );
}
