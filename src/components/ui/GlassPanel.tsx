"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { glassReveal } from "@/lib/animations";

interface GlassPanelProps extends HTMLMotionProps<"div"> {
  variant: "subtle" | "card";
}

export function GlassPanel({
  variant,
  className,
  children,
  ...props
}: GlassPanelProps) {
  const base = {
    subtle: "glass-subtle",
    card: "glass-card",
  }[variant];

  return (
    <motion.div
      variants={glassReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={cn(base, className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
