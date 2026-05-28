import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { folkieClerkLocale } from "@/lib/clerk/locale";
import { folkieClerkAppearance } from "@/lib/clerk/appearance";
import { LanguageSelector } from "@/components/shared/LanguageSelector";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://folkie.com.tr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Folkie — Nano TikTok Creator Marketing Platform",
    template: "%s · Folkie",
  },
  description:
    "Connect your brand with nano TikTok creators (1K–10K followers). AI matching, secure payments, flash campaigns. 15% commission only on completed campaigns.",
  keywords: [
    "nano influencer marketing",
    "TikTok creator marketing",
    "influencer marketing Turkey",
    "brand campaign management",
    "UGC content creation",
    "TikTok marketing platform",
    "nano creator marketplace",
    "B2B influencer marketing",
    "Folkie",
  ],
  authors: [{ name: "Folkie", url: SITE_URL }],
  creator: "Folkie",
  publisher: "Folkie",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  applicationName: "Folkie",
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-US": SITE_URL,
      "tr-TR": `${SITE_URL}/tr`,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Folkie",
    title: "Folkie — Nano TikTok Creator Marketing Platform",
    description:
      "Connect your brand with nano TikTok creators (1K–10K followers) in Turkey.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Folkie — Nano TikTok creator marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Folkie — Nano TikTok Creator Marketing Platform",
    description:
      "Connect your brand with nano TikTok creators (1K–10K followers) in Turkey.",
    images: ["/og-image.png"],
  },
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
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  category: "business",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans">
        <ClerkProvider
          localization={folkieClerkLocale}
          appearance={folkieClerkAppearance}
        >
          <LanguageSelector />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
