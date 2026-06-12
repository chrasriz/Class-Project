"use client";

import { SITE_CONFIG, NAV_ITEMS, getEmail } from "@/lib/constants";
import { HackedOverlay } from "@/components/ui/HackedOverlay";
import { useContactReveal } from "@/lib/contact-reveal-context";

export function Footer({ onOpenTerminal }: { onOpenTerminal: () => void }) {
  const { emailRevealed } = useContactReveal();
  const email = emailRevealed ? getEmail() : "";

  return (
    <footer className="relative border-t border-border">
      <HackedOverlay />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <span className="text-xl font-bold text-foreground">
              {SITE_CONFIG.name}<span className="text-cyan">.</span>
            </span>
            <p className="mt-3 text-sm text-muted leading-relaxed max-w-xs">
              {SITE_CONFIG.role}. Building secure, resilient systems from Toronto, Canada.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.2em] uppercase text-subtle mb-4">
              Navigation
            </h4>
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted hover:text-foreground transition-colors duration-300"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.2em] uppercase text-subtle mb-4">
              Connect
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href={SITE_CONFIG.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                LinkedIn
              </a>
              {emailRevealed ? (
                <a
                  href={`mailto:${email}`}
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  {email}
                </a>
              ) : (
                <a
                  href="#contact"
                  title="Decrypt the signal in the Contact section to reveal"
                  className="group inline-flex items-center gap-2 text-sm text-subtle hover:text-cyan transition-colors font-mono"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <span className="tracking-wider">••••••••@•••••••</span>
                  <span className="text-[10px] tracking-wider text-cyan/60 group-hover:text-cyan">decrypt&nbsp;↓</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-subtle">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <button
            onClick={onOpenTerminal}
            className="group inline-flex items-center gap-2 font-mono text-xs text-subtle hover:text-cyan transition-colors cursor-pointer"
            title="Open the terminal (or press `)"
          >
            <span className="text-cyan/60 group-hover:text-cyan">❯</span>
            <span className="tracking-wider">terminal</span>
            <kbd className="hidden md:inline-flex px-1.5 py-0.5 text-[10px] border border-border rounded group-hover:border-cyan/30">
              `
            </kbd>
          </button>
        </div>
      </div>
    </footer>
  );
}
