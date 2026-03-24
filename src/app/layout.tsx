import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://briefmynews.com"),
  title: {
    default: "BriefMyNews - Personalised News Digests Delivered to Your Inbox",
    template: "%s | BriefMyNews",
  },
  description:
    "Get a personalised news digest tailored to your interests. Choose your topics, pick your sources, set your schedule. No spam, no noise, just the news that matters to you.",
  keywords: [
    "personalised news",
    "news digest",
    "email newsletter",
    "custom news",
    "news aggregator",
    "AI news summary",
    "news briefing",
  ],
  authors: [{ name: "BriefMyNews" }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://briefmynews.com",
    siteName: "BriefMyNews",
    title: "BriefMyNews - Personalised News Digests Delivered to Your Inbox",
    description:
      "Get a personalised news digest tailored to your interests. Choose your topics, pick your sources, set your schedule.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BriefMyNews - Personalised News Digests",
    description:
      "Your news. Your sources. Your schedule. Nothing else.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
