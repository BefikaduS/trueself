import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import {
  fontManrope,
  fontInstrumentSerif,
  fontNewsreader,
  fontFraunces,
  fontPlusJakarta,
  fontDMSans,
  fontCaveat,
} from "./fonts";
import { ThemeProvider } from "@/components/appearance/ThemeProvider";
import { ToastProvider } from "@/components/common/Toast";
import { ClientChrome } from "@/components/navigation/ClientChrome";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://trueself.me";

export const viewport: Viewport = {
  themeColor: "#0f0f12",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Trueself — Meet the person behind your decisions",
    template: "%s | Trueself",
  },
  description:
    "Six thoughtful questions. One honest look at your patterns, strengths, and the things you might be overlooking.",
  applicationName: "Trueself",
  authors: [{ name: "Trueself" }],
  creator: "Trueself",
  publisher: "Trueself",
  keywords: [
    "self-reflection",
    "personal growth",
    "self awareness",
    "decision making",
    "reflection compass",
    "introspection",
    "mindfulness",
    "psychology",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Trueself",
    title: "Trueself — Meet the person behind your decisions",
    description:
      "Six thoughtful questions. One honest look at your patterns, strengths, and the things you might be overlooking.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Trueself — Personal Reflection Experience",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trueself — Meet the person behind your decisions",
    description:
      "Six thoughtful questions. One honest look at your patterns, strengths, and the things you might be overlooking.",
    images: ["/twitter-image"],
    creator: "@trueself",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    "theme-color": "#0f0f12",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="ink"
      data-mode="dark"
      data-scroll-behavior="smooth"
      className={`${fontManrope.variable} ${fontInstrumentSerif.variable} ${fontNewsreader.variable} ${fontFraunces.variable} ${fontPlusJakarta.variable} ${fontDMSans.variable} ${fontCaveat.variable}`}
      suppressHydrationWarning
      style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                var raw = localStorage.getItem("trueself.appearance") || localStorage.getItem("trueself-appearance");
                if (raw) {
                  var data = JSON.parse(raw);
                  var state = data && data.state;
                  if (state) {
                    var theme = state.theme || "ink";
                    document.documentElement.setAttribute("data-theme", theme);
                    if (state.fontPairing) document.documentElement.setAttribute("data-font-pairing", state.fontPairing);
                    var mode = state.mode || (theme === "ink" ? "dark" : "system");
                    var resolved = mode === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : mode;
                    document.documentElement.setAttribute("data-mode", resolved);
                    document.documentElement.style.colorScheme = resolved;
                    if (state.customAccent) {
                      document.documentElement.style.setProperty("--color-accent", state.customAccent);
                    }
                    return;
                  }
                }
              } catch (e) {}
              document.documentElement.setAttribute("data-theme", "ink");
              document.documentElement.setAttribute("data-mode", "dark");
              document.documentElement.style.colorScheme = "dark";
            })();`,
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <ToastProvider>
            <ClientChrome>{children}</ClientChrome>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
