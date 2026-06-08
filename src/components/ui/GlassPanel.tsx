"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { glassReveal } from "@/lib/animations";

interface GlassPanelProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "subtle" | "card";
  animate?: boolean;
}

export function GlassPanel({
  variant = "default",
  animate = true,
  className,
  children,
  ...props
}: GlassPanelProps) {
  const base = {
    default: "glass",
    subtle: "glass-subtle",
    card: "glass-card",
  }[variant];

  return (
    <motion.div
      variants={animate ? glassReveal : undefined}
      initial={animate ? "hidden" : undefined}
      whileInView={animate ? "visible" : undefined}
      viewport={{ once: true, margin: "-50px" }}
      className={cn(base, className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
