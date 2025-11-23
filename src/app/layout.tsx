import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "OhMyLife - Agency Management Platform",
    template: "%s | OhMyLife",
  },
  description:
    "Base infrastructure to manage your agency which is easy to self-host and built upon. Uses the power of Cloudflare to quickly deliver robust solutions.",
  keywords: [
    "agency management",
    "self-hosted",
    "cloudflare",
    "project management",
    "team collaboration",
    "client management",
    "task tracking",
  ],
  authors: [{ name: "OhMyLife" }],
  creator: "OhMyLife",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://oml.harshnpatel.in"),
  icons: {
    icon: "/logo.jpeg",
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "OhMyLife - Agency Management Platform",
    description:
      "Base infrastructure to manage your agency which is easy to self-host and built upon.",
    siteName: "OhMyLife",
    images: [
      {
        url: "/logo.jpeg",
        width: 873,
        height: 873,
        alt: "OhMyLife - Agency Management Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OhMyLife - Agency Management Platform",
    description:
      "Base infrastructure to manage your agency which is easy to self-host and built upon.",
    images: ["/logo.jpeg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
