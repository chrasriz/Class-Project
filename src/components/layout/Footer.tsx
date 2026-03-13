"use client";

import { SITE_CONFIG, NAV_ITEMS } from "@/lib/constants";
import { HackedOverlay } from "@/components/ui/HackedOverlay";

export function Footer() {
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
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                {SITE_CONFIG.email}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-subtle">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <p className="text-xs text-subtle">
            Designed &amp; engineered with precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
