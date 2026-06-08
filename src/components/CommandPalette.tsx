"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_ITEMS, SITE_CONFIG, getEmail } from "@/lib/constants";
import { useHacked } from "@/lib/hacked-context";
import { useContactReveal } from "@/lib/contact-reveal-context";

type Command = {
  id: string;
  label: string;
  hint?: string;
  run: () => void;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { isHacked, setHacked } = useHacked();
  const { emailRevealed } = useContactReveal();

  const showToast = useCallback((msg: string) => setToast(msg), []);

  // Auto-dismiss the toast; the cleanup resets the timer whenever it changes.
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(id);
  }, [toast]);

  const commands = useMemo<Command[]>(() => {
    const nav = NAV_ITEMS.map((item) => ({
      id: `nav-${item.href}`,
      label: `Go to ${item.label}`,
      hint: "Section",
      run: () => document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" }),
    }));

    // Email actions only appear once the visitor has decrypted it in Contact.
    const emailCommands: Command[] = emailRevealed
      ? [
          {
            id: "copy-email",
            label: "Copy email address",
            hint: "Copy",
            run: async () => {
              try {
                await navigator.clipboard?.writeText(getEmail());
                showToast(`Copied ${getEmail()}`);
              } catch {
                showToast("Couldn't copy — select it manually");
              }
            },
          },
          {
            id: "email",
            label: "Send me an email",
            hint: "Mail",
            run: () => { window.location.href = `mailto:${getEmail()}`; },
          },
        ]
      : [
          {
            id: "reveal-email",
            label: "Reveal email address",
            hint: "Decrypt ↓",
            run: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }),
          },
        ];

    return [
      ...nav,
      {
        id: "top",
        label: "Scroll to top",
        hint: "Home",
        run: () => window.scrollTo({ top: 0, behavior: "smooth" }),
      },
      ...emailCommands,
      {
        id: "linkedin",
        label: "Open LinkedIn",
        hint: "Open ↗",
        run: () => window.open(SITE_CONFIG.socials.linkedin, "_blank", "noopener,noreferrer"),
      },
      {
        id: "hacked",
        label: isHacked ? "Restore system integrity" : "Breach system",
        hint: isHacked ? "Restore" : "⚠ run",
        run: () => setHacked(!isHacked),
      },
    ];
  }, [isHacked, setHacked, showToast, emailRevealed]);

  const filtered = useMemo(
    () => commands.filter((cmd) => cmd.label.toLowerCase().includes(query.toLowerCase())),
    [commands, query]
  );

  // Keep the highlighted index in range as the list shrinks/grows.
  const safeIndex = Math.min(selectedIndex, Math.max(filtered.length - 1, 0));

  // Global shortcut: ⌘K / Ctrl-K to toggle, Escape to close.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => {
          if (!prev) { setQuery(""); setSelectedIndex(0); }
          return !prev;
        });
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // Keep the highlighted item scrolled into view.
  useEffect(() => {
    itemRefs.current[safeIndex]?.scrollIntoView({ block: "nearest" });
  }, [safeIndex]);

  const execute = useCallback((cmd: Command) => {
    cmd.run();
    setOpen(false);
  }, []);

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[safeIndex];
      if (cmd) execute(cmd);
    }
  };

  return (
    <>
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
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
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
                  onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                  onKeyDown={onInputKeyDown}
                  placeholder="Search commands..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-subtle focus:outline-none"
                  aria-label="Search commands"
                  aria-activedescendant={filtered[safeIndex] ? `cmd-${filtered[safeIndex].id}` : undefined}
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
                  filtered.map((cmd, i) => {
                    const isSel = i === safeIndex;
                    return (
                      <button
                        key={cmd.id}
                        id={`cmd-${cmd.id}`}
                        ref={(el) => { itemRefs.current[i] = el; }}
                        onClick={() => execute(cmd)}
                        onMouseMove={() => setSelectedIndex(i)}
                        className={`w-full px-5 py-3 flex items-center justify-between text-left text-sm transition-colors ${
                          isSel ? "bg-cyan/10 text-foreground" : "text-muted hover:text-foreground"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className={`w-1 h-4 rounded-full transition-colors ${isSel ? "bg-cyan" : "bg-transparent"}`} />
                          {cmd.label}
                        </span>
                        {cmd.hint && (
                          <kbd className="text-[10px] font-mono text-subtle">
                            {cmd.hint}
                          </kbd>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer hint */}
              <div className="flex items-center gap-4 px-5 py-2.5 border-t border-border text-[10px] font-mono text-subtle">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span className="ml-auto">⌘K toggle</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast (persists briefly after the palette closes) */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] glass-card px-4 py-2.5 text-xs font-mono text-foreground pointer-events-none"
            role="status"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
