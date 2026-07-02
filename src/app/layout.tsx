import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { Suspense } from "react";
import Script from "next/script";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";
import "@/styles/mobile.css";
import "@/styles/mobile-performance.css";

// Site-wide typeface: Nunito drives every existing font token
// (body, display, and label) so the whole UI renders in one family.
const nunitoBody = Nunito({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const nunitoDisplay = Nunito({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["700", "800"],
  display: "swap",
});

const nunitoLabel = Nunito({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Word Unscramble Game — Free Online Word Puzzle",
    template: "%s | WordUnscrambleGame",
  },
  description:
    "Play Word Unscramble Game — free online word puzzles, an unscramble tool, anagram solver and daily streak challenge.",
  authors: [{ name: "WordUnscrambleGame" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    locale: "en_US",
    siteName: "WordUnscrambleGame",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#004643" },
    { media: "(prefers-color-scheme: dark)", color: "#004643" },
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
        suppressHydrationWarning
        className={`${nunitoBody.variable} ${nunitoDisplay.variable} ${nunitoLabel.variable} luxe-app-shell font-sans antialiased`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17923553832"
          strategy="afterInteractive"
        />
        <Script id="google-ads-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'AW-17923553832');
          `}
        </Script>
        <ThemeProvider>
          <Suspense
            fallback={
              <header className="luxe-glass-nav sticky top-0 z-50">
                <div className="site-header-inner mx-auto flex h-[52px] max-w-7xl items-center px-4 sm:h-16 sm:px-6">
                  <span className="site-header-logo font-display text-base font-semibold text-luxe-strong sm:text-lg">
                    Word Unscramble Game
                  </span>
                </div>
              </header>
            }
          >
            <Header />
          </Suspense>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
