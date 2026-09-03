import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Karla, Caveat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "sonner";
import NavigationLoader from "@/components/NavigationLoader";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const karla = Karla({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-hand",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbf7f0",
};

export const metadata: Metadata = {
  title: "Shira's Strokes | Handmade With Love",
  description:
    "Discover beautiful handmade and customised creations by Shira's Strokes, established in 2025. Crochet, paintings, bouquets, earrings, rakhis, and custom gifts.",
  authors: [{ name: "Shira's Strokes" }],
  openGraph: {
    title: "Shira's Strokes | Handmade With Love",
    description: "Handmade and customised creations, crafted with love since 2025.",
    url: "https://shiras-strokes-studio.vercel.app",
    siteName: "Shira's Strokes",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shira's Strokes | Handmade With Love",
    description: "Handmade and customised creations, crafted with love since 2025.",
  },
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${karla.variable} ${caveat.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <AuthProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main" className="flex-1">
            <NavigationLoader />
            {children}
          </main>
          <Footer />
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
