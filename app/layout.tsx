import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

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
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-bg font-sans text-text">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
