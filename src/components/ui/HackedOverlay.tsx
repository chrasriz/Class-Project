"use client";

import { useEffect, useState, useRef } from "react";
import { useHacked } from "@/lib/hacked-context";

const CIPHER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>{}[]=/\\|~^█▓▒░";

function useRandomText(length: number, active: boolean) {
  const [text, setText] = useState("");
  const frameRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (!active) {
      setText("");
      clearInterval(frameRef.current);
      return;
    }
    const generate = () =>
      Array.from({ length }, () => CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)]).join("");
    setText(generate());
    frameRef.current = setInterval(() => setText(generate()), 120);
    return () => clearInterval(frameRef.current);
  }, [active, length]);

  return text;
}

export function HackedOverlay() {
  const { isHacked } = useHacked();
  const scrambled = useRandomText(80, isHacked);

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
