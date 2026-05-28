import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Poppins } from "next/font/google";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";
import "@/styles/mobile.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "WordUnscrambleGame - Word Scramble Game",
    template: "%s | WordUnscrambleGame",
  },
  description:
    "Play the Word Unscramble Game word scramble game, or open the unscramble tool to find words from your letters.",
  keywords: [
    "word unscrambler",
    "anagram solver",
    "jumble solver",
    "WordUnscrambleGame",
  ],
  authors: [{ name: "WordUnscrambleGame" }],
  openGraph: {
    title: "WordUnscrambleGame - Word Scramble Game",
    description:
      "Play the Word Unscramble Game word scramble game, or open the unscramble tool to find words from your letters.",
    type: "website",
    locale: "en_US",
    siteName: "WordUnscrambleGame",
  },
  twitter: {
    card: "summary_large_image",
    title: "WordUnscrambleGame - Word Scramble Game",
    description:
      "Play the Word Unscramble Game word scramble game, or open the unscramble tool to find words from your letters.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#8b6b61" },
    { media: "(prefers-color-scheme: dark)", color: "#4a3f3b" },
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
        className={`${inter.variable} ${playfair.variable} ${poppins.variable} luxe-app-shell font-sans antialiased`}
      >
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
