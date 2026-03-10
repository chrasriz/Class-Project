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
        {children}
      </body>
    </html>
  );
}
