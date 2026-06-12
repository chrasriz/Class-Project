"use client";

import { useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useHacked } from "@/lib/hacked-context";
import { ACHIEVEMENT_LABELS, useAchievements } from "@/lib/achievements-context";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

/**
 * Cross-cutting meta layer: watches global hacked-mode transitions to award
 * breach/restore achievements (regardless of which surface triggered them —
 * contact flow, command palette, terminal, or the Konami code), listens for
 * the Konami code itself, and renders the unlock toasts.
 */
export function AchievementLayer() {
  const { isHacked, setHacked } = useHacked();
  const { unlock, lastUnlock, clearLastUnlock } = useAchievements();
  const prevHacked = useRef(isHacked);

  // Award on transitions only, so a restore without a prior breach (or the
  // initial mount) never fires.
  useEffect(() => {
    if (isHacked === prevHacked.current) return;
    prevHacked.current = isHacked;
    unlock(isHacked ? "breached_system" : "restored_system");
  }, [isHacked, unlock]);

  // Konami code toggles the breach.
  useEffect(() => {
    let progress = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      progress = e.key === KONAMI[progress] ? progress + 1 : e.key === KONAMI[0] ? 1 : 0;
      if (progress === KONAMI.length) {
        progress = 0;
        unlock("konami");
        setHacked(!isHacked);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isHacked, setHacked, unlock]);

  // Auto-dismiss the toast.
  useEffect(() => {
    if (!lastUnlock) return;
    const t = setTimeout(clearLastUnlock, 3200);
    return () => clearTimeout(t);
  }, [lastUnlock, clearLastUnlock]);

  return (
    <AnimatePresence>
      {lastUnlock && (
        <m.div
          key={lastUnlock}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-[70] glass-card px-4 py-3 pointer-events-none"
          role="status"
        >
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
            </svg>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-subtle">
                Achievement unlocked
              </p>
              <p className="font-mono text-xs tracking-wider text-emerald-400 mt-0.5">
                {ACHIEVEMENT_LABELS[lastUnlock]}
              </p>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
