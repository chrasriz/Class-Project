"use client";

import { useEffect, useRef, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { CERTIFICATIONS, EXPERIENCE, SITE_CONFIG, SKILLS } from "@/lib/constants";
import { SECURITY_HEADERS } from "@/lib/security-headers";
import { useHacked } from "@/lib/hacked-context";
import { ACHIEVEMENT_LABELS, useAchievements, type Achievement } from "@/lib/achievements-context";
import { useScramble } from "@/lib/scramble";
import { useEscape } from "@/hooks/useEscape";
import { useFocusTrap } from "@/hooks/useFocusTrap";

type Line = { id: number; kind: "cmd" | "out" | "err"; text: string };

const BANNER = "RSKH-OS v2.6 — unauthorized access will be logged";

const HELP: string[] = [
  "help            available commands",
  "whoami          current operator",
  "ls [dir]        list files",
  "cat <file>      read a file",
  "nmap            scan chrasriz.com",
  "decrypt         open the secure contact console",
  "sudo <cmd>      escalate privileges",
  "achievements    session progress",
  "linkedin        open the uplink",
  "history         command history",
  "clear           clear the screen",
  "exit            close the terminal",
];

const FILES = ["about.txt", "experience.log", "certs/", "skills.cfg", "contact.gpg"];

const CAT_OUTPUT: Record<string, string[]> = {
  "about.txt": [
    `${SITE_CONFIG.role}`,
    `Base of operations: ${SITE_CONFIG.location}`,
    "Defense-first mindset. Reads systems through logs,",
    "traffic patterns, and behavioral anomalies.",
  ],
  "experience.log": EXPERIENCE.filter((e) => e.type === "work").map(
    (e) => `[${e.period}] ${e.title} @ ${e.organization}`
  ),
  "skills.cfg": SKILLS.map(
    (cat) => `${cat.category} :: ${cat.items.map((s) => s.name).join(", ")}`
  ),
  "contact.gpg": [
    "-----BEGIN PGP MESSAGE-----",
    "hQEMA9XzK1mR7[REDACTED]9fT2cL8wQv6nJ4pYxB3sD1kH5mZ0aE7",
    "-----END PGP MESSAGE-----",
    "(encrypted) run `decrypt` to open the secure console",
  ],
};

const CERT_LISTING = CERTIFICATIONS.map((c) => `${c.name}  (${c.issuer}, ${c.year}) [${c.status}]`);

const NMAP_OUTPUT: string[] = [
  "Starting scan against chrasriz.com ...",
  "PORT     STATE  SERVICE",
  "443/tcp  open   https",
  "| response-headers:",
  ...SECURITY_HEADERS.map((h) => `|   ${h.key}: ${h.value}`),
  "|_ csp: pending nonce audit",
  "Scan complete: 1 host up, 0 exploitable services found.",
];

export function Terminal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { isHacked, setHacked } = useHacked();
  const { unlocked, unlock } = useAchievements();
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const nextId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  // The input is the only focusable inside, so the trap pins focus to it.
  const trapRef = useFocusTrap<HTMLDivElement>(open);
  const banner = useScramble(BANNER, open ? "decrypt" : "blocks", { speed: 12 });

  useEscape(open, () => onOpenChange(false));

  // Quake-style toggle on backquote (ignoring other inputs, e.g. the palette).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "`" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      e.preventDefault();
      onOpenChange(!open);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  // Finding the shell is itself an achievement.
  useEffect(() => {
    if (open) unlock("found_terminal");
  }, [open, unlock]);

  // Keep the newest output in view.
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const append = (kind: Line["kind"], texts: string[]) => {
    setLines((prev) => [
      ...prev,
      ...texts.map((text) => ({ id: nextId.current++, kind, text })),
    ]);
  };

  const run = (raw: string) => {
    const cmdline = raw.trim();
    append("cmd", [cmdline]);
    if (cmdline === "") return;
    setHistory((prev) => [...prev, cmdline]);
    setHistoryIndex(-1);

    const [cmd, ...args] = cmdline.split(/\s+/);
    const arg = args.join(" ");

    switch (cmd.toLowerCase()) {
      case "help":
        append("out", HELP);
        return;

      case "whoami":
        append("out", [
          isHacked
            ? "root — wait, that's not right. run `sudo restore`."
            : `guest — you're browsing the portfolio of ${SITE_CONFIG.name} Rizwan, ${SITE_CONFIG.role}.`,
        ]);
        return;

      case "ls":
        if (arg === "" || arg === ".") {
          append("out", [FILES.join("   ")]);
        } else if (arg.replace(/\/$/, "") === "certs") {
          append("out", CERT_LISTING);
        } else {
          append("err", [`ls: cannot access '${arg}': no such directory`]);
        }
        return;

      case "cat": {
        if (arg === "") {
          append("err", ["cat: missing operand — try `cat about.txt`"]);
          return;
        }
        const file = arg.replace(/^\.\//, "");
        if (file.replace(/\/$/, "") === "certs") {
          append("err", ["cat: certs/: is a directory — try `ls certs`"]);
          return;
        }
        const content = CAT_OUTPUT[file];
        if (content) {
          append("out", content);
        } else {
          append("err", [`cat: ${file}: no such file`]);
        }
        return;
      }

      case "nmap":
        append("out", NMAP_OUTPUT);
        return;

      case "decrypt":
        append("out", ["routing to secure console..."]);
        onOpenChange(false);
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        return;

      case "sudo":
        if (arg === "breach") {
          if (isHacked) {
            append("err", ["system is already compromised."]);
          } else {
            append("err", ["privilege escalation accepted. breaching..."]);
            setHacked(true);
          }
        } else if (arg === "restore") {
          if (isHacked) {
            append("out", ["integrity checks passed. system restored."]);
            setHacked(false);
          } else {
            append("out", ["nothing to restore — system integrity nominal."]);
          }
        } else {
          append("err", [
            `${SITE_CONFIG.name.toLowerCase()} is not in the sudoers file.`,
            "this incident will be reported. (just kidding — try `sudo breach`)",
          ]);
        }
        return;

      case "breach":
      case "restore":
        append("err", [`${cmd}: permission denied — try \`sudo ${cmd}\``]);
        return;

      case "achievements": {
        const all = Object.keys(ACHIEVEMENT_LABELS) as Achievement[];
        append(
          "out",
          all.map((a) => `[${unlocked.includes(a) ? "■" : " "}] ${ACHIEVEMENT_LABELS[a]}`)
        );
        append("out", [`${unlocked.length}/${all.length} unlocked this session`]);
        return;
      }

      case "linkedin":
        append("out", ["opening uplink..."]);
        window.open(SITE_CONFIG.socials.linkedin, "_blank", "noopener,noreferrer");
        return;

      case "history":
        // Includes the current command — `history` state hasn't flushed yet.
        append("out", [...history, cmdline].map((h, i) => `${i + 1}  ${h}`));
        return;

      case "clear":
        setLines([]);
        return;

      case "exit":
        onOpenChange(false);
        return;

      case "rm":
        append("err", ["rm: permission denied (read-only filesystem) — incident logged."]);
        return;

      default:
        append("err", [`command not found: ${cmd} — try \`help\``]);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "`") {
      e.preventDefault();
      onOpenChange(false);
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const idx = historyIndex === -1 ? history.length - 1 : Math.max(historyIndex - 1, 0);
      setHistoryIndex(idx);
      setInput(history[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const idx = historyIndex + 1;
      if (idx >= history.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(idx);
        setInput(history[idx]);
      }
    }
  };

  const prompt = isHacked ? "root@chrasriz:~#" : "guest@chrasriz:~$";

  return (
    <AnimatePresence>
      {open && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-4 bg-black/60 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        >
          <m.div
            ref={trapRef}
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.focus();
            }}
            className="glass w-full max-w-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Interactive terminal"
          >
            {/* Title bar */}
            <div className={`flex items-center gap-2 px-4 py-3 border-b ${isHacked ? "border-red-400/20" : "border-border"}`}>
              <div className="flex gap-1.5 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className={`w-2.5 h-2.5 rounded-full ${isHacked ? "bg-red-500/60" : "bg-green-500/60"}`} />
              </div>
              <span className={`ml-2 font-mono text-[10px] tracking-wider truncate ${isHacked ? "text-red-400/80" : "text-subtle"}`}>
                {banner}
              </span>
              <kbd className="ml-auto hidden sm:inline-flex px-2 py-0.5 text-[10px] font-mono text-subtle border border-border rounded shrink-0">
                ESC
              </kbd>
            </div>

            {/* Output */}
            <div
              ref={outputRef}
              aria-live="polite"
              className="h-[320px] overflow-y-auto px-4 py-3 font-mono text-xs leading-relaxed"
            >
              {lines.length === 0 && (
                <p className="text-subtle">type `help` to get started</p>
              )}
              {lines.map((line) => (
                <p
                  key={line.id}
                  className={`whitespace-pre-wrap break-words ${
                    line.kind === "cmd"
                      ? "text-foreground"
                      : line.kind === "err"
                      ? "text-red-400/90"
                      : "text-muted"
                  }`}
                >
                  {line.kind === "cmd" ? (
                    <>
                      <span className={isHacked ? "text-red-400" : "text-cyan"}>{prompt}</span>{" "}
                      {line.text}
                    </>
                  ) : (
                    line.text
                  )}
                </p>
              ))}
            </div>

            {/* Input row */}
            <div className={`flex items-center gap-2 px-4 py-3 border-t ${isHacked ? "border-red-400/20" : "border-border"}`}>
              <span className={`font-mono text-xs shrink-0 ${isHacked ? "text-red-400" : "text-cyan"}`}>
                {prompt}
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                className="flex-1 bg-transparent font-mono text-xs text-foreground caret-cyan focus:outline-none"
                aria-label="Terminal command input"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
