"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_ITEMS } from "@/lib/constants";

const COMMANDS = [
  ...NAV_ITEMS.map((item) => ({
    label: `Go to ${item.label}`,
    action: () => {
      document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
    },
    shortcut: "",
  })),
  {
    label: "Go to Top",
    action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    shortcut: "Home",
  },
  {
    label: "Download Resume",
    action: () => {
      // Placeholder — link to actual resume
      window.open("#", "_blank");
    },
    shortcut: "",
  },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = COMMANDS.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="glass w-full max-w-lg overflow-hidden"
          >
            {/* Search */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <svg className="w-4 h-4 text-subtle shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-subtle focus:outline-none"
              />
              <kbd className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-mono text-subtle border border-border rounded">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-64 overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-subtle">
                  No commands found.
                </p>
              ) : (
                filtered.map((cmd) => (
                  <button
                    key={cmd.label}
                    onClick={() => {
                      cmd.action();
                      setOpen(false);
                    }}
                    className="w-full px-5 py-3 flex items-center justify-between text-left text-sm text-muted hover:text-foreground hover:bg-white/[0.03] transition-colors"
                  >
                    <span>{cmd.label}</span>
                    {cmd.shortcut && (
                      <kbd className="text-[10px] font-mono text-subtle">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
