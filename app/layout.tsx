import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "sonner";
import { SITE_CONFIG } from "@/lib/constants";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CompareProvider } from "@/contexts/CompareContext";
import CompareFloatingBar from "@/components/ui/CompareFloatingBar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
  keywords: [
    "second hand marketplace bangladesh",
    "used phones dhaka",
    "buy sell preloved laptops",
    "escrow safe marketplace",
    "bKash escrow buy sell",
    "resell hub",
    "classifieds bangladesh",
  ],
  authors: [{ name: "ReSell Hub Team", url: SITE_CONFIG.url }],
  creator: "ReSell Hub Bangladesh",
  publisher: "ReSell Hub Ltd",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    creator: "@resellhub_bd",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200`}>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
          id="google-gsi-client"
        />
        <ThemeProvider>
          <AuthProvider>
            <CompareProvider>
              {children}
              <CompareFloatingBar />
              <Toaster
                position="top-right"
                richColors
                closeButton
                toastOptions={{
                  style: { fontFamily: "var(--font-inter)" },
                }}
              />
            </CompareProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
