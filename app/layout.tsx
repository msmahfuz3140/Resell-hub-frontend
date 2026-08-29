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
    default: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "second hand",
    "marketplace",
    "buy",
    "sell",
    "used items",
    "bangladesh",
    "resell",
  ],
  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    type: "website",
    url: SITE_CONFIG.url,
  },
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
