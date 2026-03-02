import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";
import { Providers } from "./providers";
import { TerminalShell } from "@/components/layout/terminal-shell";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PolyAnalytics — Bloomberg Terminal for Prediction Markets",
  description:
    "Real-time analytics, whale tracking, and cross-platform arbitrage for Polymarket and Kalshi prediction markets.",
  keywords: [
    "polymarket",
    "kalshi",
    "prediction markets",
    "analytics",
    "whale tracker",
    "arbitrage",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider appearance={{ baseTheme: dark }}>
          <Providers>
            <TerminalShell>{children}</TerminalShell>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
