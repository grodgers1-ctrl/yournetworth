import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Suspense } from "react";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { PostHogPageView } from "@/components/providers/PostHogPageView";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yournetworth.net"),
  title: {
    default: "Your Net Worth - Free UK & US Personal Finance Calculators",
    template: "%s | Your Net Worth",
  },
  description:
    "A dark-first, no-sign-up suite of personal-finance calculators for UK and US savers. Track net worth, find your FIRE number, model compound interest, overpay a mortgage, and compare debt payoff strategies.",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: "Your Net Worth",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Your Net Worth - Free UK and US personal finance calculators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@yournetworth",
    title: "Your Net Worth",
    description: "Free UK and US personal finance calculators with live charts.",
    images: ["/og.png"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Your Net Worth",
  url: "https://yournetworth.net",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://yournetworth.net/glossary?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Your Net Worth",
  url: "https://yournetworth.net",
  logo: "https://yournetworth.net/icon.png",
  sameAs: ["https://dividendmapper.com"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
      </head>
      <PostHogProvider>
        <body className="flex min-h-full flex-col bg-bg font-sans text-text">
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </body>
      </PostHogProvider>
    </html>
  );
}
