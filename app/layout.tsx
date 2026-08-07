import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Fredoka } from "next/font/google";
import { AppProviders } from "@/components/providers";
import { Navbar, Footer, SkipLink } from "@/components/layout";
import { baseMetadata } from "@/constants/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = baseMetadata;

/**
 * Typed with a plain `ReactNode` rather than Next's generated
 * `LayoutProps<"/">` global. That global only exists in `.next/types`
 * after a build has run, so depending on it made `tsc --noEmit` fail on a
 * clean checkout — exactly what CI does before it builds.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>
          <SkipLink />
          <Navbar />
          <main id="main-content" className="flex flex-1 flex-col">
            {children}
          </main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
