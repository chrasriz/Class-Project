"use client";

import { useHacked } from "@/lib/hacked-context";
import { CIPHER_CHARS, useScramble } from "@/lib/scramble";

// Deterministic glyph row: the loop scrambles it while hacked; reduced-motion
// users see it as-is (static decoration instead of empty space).
const GLYPH_ROW = Array.from(
  { length: 80 },
  (_, i) => CIPHER_CHARS[(i * 7) % CIPHER_CHARS.length]
).join("");

export function HackedOverlay() {
  const { isHacked } = useHacked();
  const scrambled = useScramble(GLYPH_ROW, isHacked ? "loop" : "text", { speed: 120 });

  if (!isHacked) return null;

  return (
    <div className="hacked-scramble-overlay">
      <div className="text-center px-4">
        <div className="font-mono text-red-500/30 text-xs tracking-widest mb-4 overflow-hidden whitespace-nowrap max-w-full hacked-text-pulse">
          {scrambled}
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <span className="font-mono text-sm tracking-wider text-red-500 font-medium hacked-text-pulse">
            SECTION ENCRYPTED
          </span>
        </div>
        <p className="font-mono text-[10px] text-red-400/50 tracking-wider">
          SECURITY BREACH — DATA INACCESSIBLE
        </p>
        <div className="font-mono text-red-500/20 text-xs tracking-widest mt-4 overflow-hidden whitespace-nowrap max-w-full hacked-text-pulse">
          {scrambled.split("").reverse().join("")}
        </div>
      </div>
    </div>
  );
}
