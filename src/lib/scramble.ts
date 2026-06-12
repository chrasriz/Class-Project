"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Single source of truth for the cipher glyphs used by every scramble effect
// on the site (loading intro, nav labels, hacked overlay, contact decrypt).
export const CIPHER_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>{}[]=/\\|~^";

export function randomCipherChar(): string {
  return CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
}

function scrambleFrame(text: string, preserve: string, revealedCount: number): string {
  return text
    .split("")
    .map((char, i) => {
      if (i < revealedCount || preserve.includes(char)) return char;
      return randomCipherChar();
    })
    .join("");
}

export type ScrambleMode =
  /** Solid █ blocks — the "encrypted" resting state. */
  | "blocks"
  /** Plain text, no animation. */
  | "text"
  /** Continuous random scramble while mounted in this mode. */
  | "loop"
  /** `scrambleTicks` of pure noise, then reveal left-to-right; fires `onDone`. */
  | "decrypt";

type ScrambleOptions = {
  /** ms per animation tick. */
  speed?: number;
  /** Decrypt mode: noise ticks before characters start resolving. */
  scrambleTicks?: number;
  /** Characters never scrambled (e.g. " @." for an email). */
  preserve?: string;
  /** Decrypt mode: called once when the full text has resolved. */
  onDone?: () => void;
};

/**
 * Shared scramble/decrypt text engine. Reduced motion collapses animated
 * modes to plain text (decrypt completes immediately so dependent state
 * machines still advance).
 */
export function useScramble(
  text: string,
  mode: ScrambleMode,
  { speed = 50, scrambleTicks = 0, preserve = "", onDone }: ScrambleOptions = {}
): string {
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  const animated = (mode === "loop" || mode === "decrypt") && !reducedMotion;

  useEffect(() => {
    if (!animated) {
      // Reduced motion: a decrypt still has to complete so callers waiting on
      // onDone (the contact state machine) aren't stranded mid-flow.
      if (mode === "decrypt" && reducedMotion) onDoneRef.current?.();
      return;
    }

    // First frame synchronously, so mode switches don't show a stale frame
    // for one tick. Safe: guarded by the effect deps, runs at most once each.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplay(scrambleFrame(text, preserve, 0));

    if (mode === "loop") {
      const id = setInterval(() => setDisplay(scrambleFrame(text, preserve, 0)), speed);
      return () => clearInterval(id);
    }

    let tick = 0;
    const id = setInterval(() => {
      tick += 1;
      const revealed = tick - scrambleTicks;
      if (revealed >= text.length) {
        clearInterval(id);
        setDisplay(text);
        onDoneRef.current?.();
        return;
      }
      setDisplay(scrambleFrame(text, preserve, Math.max(revealed, 0)));
    }, speed);
    return () => clearInterval(id);
  }, [animated, mode, text, speed, scrambleTicks, preserve, reducedMotion]);

  if (mode === "blocks") return "█".repeat(text.length);
  if (!animated) return text;
  return display;
}
