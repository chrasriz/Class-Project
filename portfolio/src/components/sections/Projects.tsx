"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { PROJECTS } from "@/lib/constants";
import { fadeUp, staggerContainer } from "@/lib/animations";

type Project = (typeof PROJECTS)[number];

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <motion.div variants={fadeUp}>
      <div
        onClick={onClick}
        className="glass-card p-8 cursor-pointer group"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onClick()}
      >
        {/* Color accent bar */}
        <div
          className="w-12 h-1 rounded-full mb-6 transition-all duration-300 group-hover:w-20"
          style={{ background: project.color }}
        />

        <h3 className="text-xl font-semibold text-foreground mb-1 tracking-tight">
          {project.title}
        </h3>
        <p className="text-sm text-cyan font-mono mb-4">{project.subtitle}</p>
        <p className="text-sm text-muted leading-relaxed mb-6">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.tools.slice(0, 4).map((tool) => (
            <span
              key={tool}
              className="px-3 py-1 text-[11px] font-mono text-muted bg-white/5 rounded-md border border-border"
            >
              {tool}
            </span>
          ))}
          {project.tools.length > 4 && (
            <span className="px-3 py-1 text-[11px] font-mono text-subtle">
              +{project.tools.length - 4}
            </span>
          )}
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm text-cyan opacity-0 group-hover:opacity-100 transition-opacity">
          <span>View Case Study</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="glass w-full max-w-3xl max-h-[85vh] overflow-y-auto p-8 md:p-10"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div
              className="w-12 h-1 rounded-full mb-4"
              style={{ background: project.color }}
            />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              {project.title}
            </h2>
            <p className="text-sm text-cyan font-mono mt-1">{project.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-8">
          {/* Problem */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-subtle mb-3">
              Problem
            </h3>
            <p className="text-muted leading-relaxed">{project.problem}</p>
          </div>

          {/* Architecture */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-subtle mb-3">
              Architecture
            </h3>
            <p className="text-muted leading-relaxed">{project.architecture}</p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-subtle mb-3">
              Technology Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tools.map((tool) => (
                <span
                  key={tool}
                  className="px-3 py-1.5 text-xs font-mono text-cyan bg-cyan-dim rounded-md border border-cyan/20"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Results */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-subtle mb-3">
              Results
            </h3>
            <ul className="space-y-2">
              {project.results.map((result) => (
                <li key={result} className="flex items-start gap-3 text-muted">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan mt-2 shrink-0" />
                  <span className="leading-relaxed">{result}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Lessons */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-subtle mb-3">
              Key Takeaway
            </h3>
            <GlassPanel variant="subtle" className="p-5">
              <p className="text-sm text-muted italic leading-relaxed">
                &ldquo;{project.lessons}&rdquo;
              </p>
            </GlassPanel>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" className="section-padding">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          label="Projects"
          title="Flagship Operations"
          description="Selected technical projects showcasing architecture, implementation, and results."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelected(project)}
            />
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
