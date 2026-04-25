import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
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
  metadataBase: new URL("https://chrasriz.com"),
  title: "Rasikh Rizwan | Cybersecurity Analyst",
  description:
    "Portfolio of Chaudhry Rasikh Rizwan, Cybersecurity Analyst and IT Professional based in Toronto, Canada. Specializing in SOC operations, network security, and access hardening.",
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
    url: "https://chrasriz.com",
    title: "Rasikh Rizwan | Cybersecurity Analyst",
    description:
      "Cybersecurity Analyst specializing in SOC operations, network security, and access hardening.",
    siteName: "Rasikh Rizwan Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rasikh Rizwan | Cybersecurity Analyst",
    description:
      "Cybersecurity Analyst specializing in SOC operations, network security, and access hardening.",
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
  url: "https://chrasriz.com",
  email: "mailto:connect@chrasriz.com",
  jobTitle: "Cybersecurity Analyst",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Toronto",
    addressRegion: "ON",
    addressCountry: "CA",
  },
  sameAs: ["https://www.linkedin.com/in/ch-rasikh-rizwan/"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

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
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
