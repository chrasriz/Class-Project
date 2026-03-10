import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const sans = localFont({
  src: [
    {
      path: "../fonts/GeistVF.woff2",
      style: "normal",
    },
  ],
  variable: "--font-geist-sans",
  display: "swap",
  fallback: [
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

const mono = localFont({
  src: [
    {
      path: "../fonts/GeistMonoVF.woff2",
      style: "normal",
    },
  ],
  variable: "--font-geist-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
});

export const viewport: Viewport = {
  themeColor: "#050508",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Ras | Cybersecurity Analyst & Network Engineer",
  description:
    "Portfolio of Ras — Cybersecurity Analyst, Network Engineer, and Technical Builder based in Toronto, Canada. Specializing in security infrastructure, network architecture, and systems engineering.",
  keywords: [
    "cybersecurity",
    "network engineer",
    "security analyst",
    "portfolio",
    "Toronto",
    "penetration testing",
    "SIEM",
    "zero trust",
    "infrastructure",
  ],
  authors: [{ name: "Ras" }],
  creator: "Ras",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://ras.dev",
    title: "Ras | Cybersecurity Analyst & Network Engineer",
    description:
      "Cybersecurity professional specializing in security infrastructure, network architecture, and systems engineering.",
    siteName: "Ras Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ras | Cybersecurity Analyst & Network Engineer",
    description:
      "Cybersecurity professional specializing in security infrastructure, network architecture, and systems engineering.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${sans.variable} ${mono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
