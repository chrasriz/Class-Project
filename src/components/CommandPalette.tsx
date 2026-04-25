"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_ITEMS } from "@/lib/constants";
import { useFocusTrap } from "@/hooks/useFocusTrap";

type Command = {
  label: string;
  action: () => void;
  shortcut?: string;
};

const COMMANDS: Command[] = [
  ...NAV_ITEMS.map((item) => ({
    label: `Go to ${item.label}`,
    action: () => {
      const el = document.querySelector(item.href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
  })),
  {
    label: "Go to Top",
    action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    shortcut: "Home",
  },
];

const LISTBOX_ID = "cmd-palette-listbox";
const optionId = (i: number) => `cmd-palette-option-${i}`;

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useFocusTrap(panelRef, open);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS.filter((cmd) => cmd.label.toLowerCase().includes(q));
  }, [query]);

  // Global Cmd/Ctrl+K toggle. Ignore the shortcut when typing in another input
  // (so users typing in form fields keep their keystrokes), but always allow it
  // to close while the palette is open.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isToggle = (e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K");
      if (!isToggle) return;

      if (open) {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
      setQuery("");
      setActiveIndex(0);
      setOpen(true);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Clamp activeIndex into the filtered range — derived during render avoids
  // the setState-in-effect anti-pattern.
  const safeActiveIndex =
    filtered.length === 0 ? 0 : Math.min(activeIndex, filtered.length - 1);

  // Autofocus the input when the palette opens.
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
  }, [open]);

  // Lock body scroll while the palette is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Keep the active option visible as the user navigates.
  useEffect(() => {
    if (!open || filtered.length === 0) return;
    const list = listRef.current;
    if (!list) return;
    const target = list.querySelector<HTMLElement>(`#${optionId(safeActiveIndex)}`);
    target?.scrollIntoView({ block: "nearest" });
  }, [safeActiveIndex, open, filtered.length]);

  const close = useCallback(() => setOpen(false), []);

  const runCommand = useCallback(
    (cmd: Command) => {
      cmd.action();
      setOpen(false);
    },
    [],
  );

  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          close();
          return;
        case "ArrowDown":
          e.preventDefault();
          if (filtered.length === 0) return;
          setActiveIndex((i) => (i + 1) % filtered.length);
          return;
        case "ArrowUp":
          e.preventDefault();
          if (filtered.length === 0) return;
          setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
          return;
        case "Home":
          if (filtered.length === 0) return;
          e.preventDefault();
          setActiveIndex(0);
          return;
        case "End":
          if (filtered.length === 0) return;
          e.preventDefault();
          setActiveIndex(filtered.length - 1);
          return;
        case "Enter": {
          if (filtered.length === 0) return;
          e.preventDefault();
          const cmd = filtered[safeActiveIndex];
          if (cmd) runCommand(cmd);
          return;
        }
      }
    },
    [close, filtered, runCommand, safeActiveIndex],
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
          onClick={close}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="glass w-full max-w-lg overflow-hidden mx-4"
          >
            {/* Search */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <svg
                className="w-4 h-4 text-subtle shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onInputKeyDown}
                placeholder="Search commands..."
                role="combobox"
                aria-expanded
                aria-controls={LISTBOX_ID}
                aria-autocomplete="list"
                aria-activedescendant={
                  filtered.length > 0 ? optionId(safeActiveIndex) : undefined
                }
                autoComplete="off"
                spellCheck={false}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-subtle focus:outline-none"
              />
              <kbd className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-mono text-subtle border border-border rounded">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              role="listbox"
              id={LISTBOX_ID}
              aria-label="Commands"
              className="max-h-64 overflow-y-auto py-2"
            >
              {filtered.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-subtle">
                  No commands found.
                </p>
              ) : (
                filtered.map((cmd, i) => {
                  const isActive = i === safeActiveIndex;
                  return (
                    <div
                      key={cmd.label}
                      id={optionId(i)}
                      role="option"
                      aria-selected={isActive}
                      onMouseMove={() => setActiveIndex(i)}
                      onClick={() => runCommand(cmd)}
                      className={`w-full px-5 py-3 flex items-center justify-between text-left text-sm cursor-pointer transition-colors ${
                        isActive
                          ? "bg-white/[0.05] text-foreground"
                          : "text-muted hover:text-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isActive && (
                          <span
                            aria-hidden="true"
                            className="text-cyan font-mono text-[10px]"
                          >
                            ›
                          </span>
                        )}
                        {cmd.label}
                      </span>
                      {cmd.shortcut && (
                        <kbd className="text-[10px] font-mono text-subtle">
                          {cmd.shortcut}
                        </kbd>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer hint */}
            <div className="hidden sm:flex items-center justify-end gap-3 px-5 py-2 text-[10px] font-mono text-subtle border-t border-border">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 border border-border rounded">↑</kbd>
                <kbd className="px-1.5 py-0.5 border border-border rounded">↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 border border-border rounded">↵</kbd>
                select
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
