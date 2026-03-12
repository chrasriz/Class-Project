"use client";

import { useRef, useState, useCallback, type ReactNode, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
}

export function MagneticButton({
  children,
  className,
  href,
  onClick,
  variant = "primary",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  const handleMouse = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
      setPosition({ x, y });
    });
  }, []);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    setPosition({ x: 0, y: 0 });
  }, []);

  const styles = {
    primary:
      "bg-cyan/10 text-cyan border border-cyan/30 hover:bg-cyan/20 hover:border-cyan/50",
    secondary:
      "bg-white/5 text-foreground border border-white/10 hover:bg-white/10 hover:border-white/20",
    ghost:
      "text-muted hover:text-foreground",
  }[variant];

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onTouchStart={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 30, restDelta: 0.01 }}
      className={cn(
        "inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium tracking-wide transition-colors duration-300 cursor-pointer active:scale-95",
        styles,
        className
      )}
      onClick={onClick}
      role={!href ? "button" : undefined}
      tabIndex={!href ? 0 : undefined}
      onKeyDown={!href && onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return content;
}
