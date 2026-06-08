"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in the viewport's vertical middle band and
 * returns its element id (or null when above the first one). Stable `ids` array
 * expected (e.g. a module-level constant) so the observer isn't rebuilt.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (inView[0]) setActive(inView[0].target.id);
      },
      // Thin band across the middle of the viewport so exactly one section
      // counts as "active" at a time.
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
