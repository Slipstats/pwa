import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider } from "@/context/AuthContext";
import { LedgerProvider } from "@/context/LedgerContext";

export const metadata: Metadata = {
  title: "Slipstats — Court-Ready Child Expense & Till Slip Tracker",
  description: "Empathetic, legally robust child expense tracking and AI till slip allocation for mothers. Form 4A & Rule 43 compliant.",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Slipstats",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#005cb8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-surface">
      <head>
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700&display=swap"
        />
      </head>
      <body className="bg-surface text-on-surface min-h-screen flex flex-col antialiased selection:bg-secondary-container selection:text-on-secondary-fixed">
        <AuthProvider>
          <LedgerProvider>
            <AppShell>{children}</AppShell>
          </LedgerProvider>
        </AuthProvider>

        {/* PWA Service Worker Registration - Production Only */}
        {process.env.NODE_ENV === "production" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').catch(function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    });
                  });
                }
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
