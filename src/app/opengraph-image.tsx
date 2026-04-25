import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Rasikh Rizwan — Cybersecurity Analyst";
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
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(ellipse at top left, #0a1f24 0%, #050508 60%)",
          fontFamily: "sans-serif",
          color: "#f5f5f5",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#22d3ee",
              boxShadow: "0 0 24px rgba(34, 211, 238, 0.7)",
            }}
          />
          <span
            style={{
              fontSize: 18,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "#94a3b8",
            }}
          >
            Portfolio · 2026
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span
            style={{
              fontSize: 22,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#22d3ee",
              fontFamily: "monospace",
            }}
          >
            Cybersecurity Analyst
          </span>
          <span
            style={{
              fontSize: 110,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              backgroundImage:
                "linear-gradient(90deg, #f5f5f5 0%, #22d3ee 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Rasikh Rizwan
          </span>
          <span
            style={{
              fontSize: 30,
              color: "#cbd5e1",
              maxWidth: 900,
              lineHeight: 1.3,
            }}
          >
            SOC operations, network security, and access hardening.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            color: "#64748b",
            fontFamily: "monospace",
            letterSpacing: "0.15em",
          }}
        >
          <span>CHRASRIZ.COM</span>
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: "#22d3ee" }}>●</span>
            TORONTO · CANADA
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
