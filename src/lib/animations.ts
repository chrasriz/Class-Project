import type { Variants, Transition } from "framer-motion";

// Easing curves
export const EASE = {
  smooth: [0.25, 0.1, 0.25, 1] as const,
  out: [0, 0, 0.2, 1] as const,
  spring: { type: "spring", stiffness: 100, damping: 20 } as Transition,
  elastic: { type: "spring", stiffness: 150, damping: 30 } as Transition,
};

// Fade up variant for sections
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE.smooth },
  },
};

// Fade in variant
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: EASE.smooth },
  },
};

// Scale up variant
export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: EASE.smooth },
  },
};

// Stagger children container
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Glass panel reveal
export const glassReveal: Variants = {
  hidden: { opacity: 0, y: 30, backdropFilter: "blur(0px)" },
  visible: {
    opacity: 1,
    y: 0,
    backdropFilter: "blur(12px)",
    transition: { duration: 0.8, ease: EASE.smooth },
  },
};

// Hero text animation
export const heroText: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: EASE.out },
  },
};

// Nav animation
export const navReveal: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE.smooth, delay: 0.5 },
  },
};
