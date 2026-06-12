import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/lib/constants";

// Rendered once at build time (fully static site) — fixes link unfurls that
// previously declared summary_large_image but shipped no image.
export const alt = SITE_CONFIG.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#050508",
          backgroundImage:
            "radial-gradient(circle at 50% 45%, rgba(6,182,212,0.18) 0%, rgba(6,182,212,0.04) 40%, transparent 65%)",
          color: "#e8e8ed",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span style={{ fontSize: 132, fontWeight: 700, letterSpacing: -4 }}>
            {SITE_CONFIG.name}
          </span>
          <span style={{ fontSize: 132, fontWeight: 700, color: "#22d3ee" }}>.</span>
        </div>
        <span
          style={{
            marginTop: 16,
            fontSize: 34,
            letterSpacing: 14,
            textTransform: "uppercase",
            color: "rgba(6,182,212,0.85)",
          }}
        >
          Cybersecurity Analyst
        </span>
        <div
          style={{
            marginTop: 48,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ width: 60, height: 1, backgroundColor: "rgba(6,182,212,0.4)" }} />
          <span style={{ fontSize: 24, color: "#6b7a8d", letterSpacing: 4 }}>
            chrasriz.com
          </span>
          <div style={{ width: 60, height: 1, backgroundColor: "rgba(6,182,212,0.4)" }} />
        </div>
      </div>
    ),
    size
  );
}
