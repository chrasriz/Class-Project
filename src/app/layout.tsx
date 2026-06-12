import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE_CONFIG } from "@/lib/constants";
import "./globals.css";

const sans = localFont({
  src: [
    {
      path: "../fonts/GeistVF.woff2",
      style: "normal",
    },
  ],
  // Variable fonts: declare the full axis so bold weights use the real font
  // instead of browser-synthesized bold.
  weight: "100 900",
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
  weight: "100 900",
  variable: "--font-geist-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
});

export const viewport: Viewport = {
  themeColor: "#050508",
  width: "device-width",
  initialScale: 1,
};

const SHORT_DESCRIPTION =
  "Cybersecurity Analyst specializing in SOC operations, network security, and access hardening.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  keywords: [
    "cybersecurity",
    "security analyst",
    "SOC",
    "SIEM",
    "network security",
    "portfolio",
    "Toronto",
    "CCNA",
    "CompTIA Security+",
  ],
  authors: [{ name: "Rasikh Rizwan" }],
  creator: "Rasikh Rizwan",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.title,
    description: SHORT_DESCRIPTION,
    siteName: "Rasikh Rizwan Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SHORT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Chaudhry Rasikh Rizwan",
  alternateName: "Rasikh Rizwan",
  url: SITE_CONFIG.url,
  jobTitle: "Cybersecurity Analyst",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Toronto",
    addressRegion: "ON",
    addressCountry: "CA",
  },
  sameAs: [SITE_CONFIG.socials.linkedin],
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-cyan focus:text-background focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
