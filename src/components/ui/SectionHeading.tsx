"use client";

import { m } from "framer-motion";
import { fadeUp } from "@/lib/animations";

interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
}

export function SectionHeading({ label, title, description }: SectionHeadingProps) {
  return (
    <m.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="mb-16 text-center"
    >
      <span className="inline-block mb-4 px-4 py-1.5 text-xs font-medium tracking-[0.2em] uppercase text-cyan bg-cyan-dim rounded-full border border-cyan/20">
        {label}
      </span>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gradient mb-4">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl mx-auto text-muted text-base md:text-lg leading-relaxed">
          {description}
        </p>
      )}
    </m.div>
  );
}
