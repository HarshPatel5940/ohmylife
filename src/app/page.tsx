import React from "react";
import { ArrowRight, Github } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OhMyLife - Agency Management Platform",
  description:
    "Base infrastructure to manage your agency which is easy to self-host and built upon. Uses the power of Cloudflare to quickly deliver robust solutions for projects, clients, finances, and tasks.",
  keywords: [
    "agency management",
    "self-hosted",
    "cloudflare",
    "open source",
    "project management",
    "client management",
    "finance tracking",
    "task management",
    "team collaboration",
  ],
  openGraph: {
    title: "OhMyLife - Agency Management Made Minimal",
    description:
      "Self-host in minutes. A lean foundation for projects, clients, finances, and tasks. Simple by design. Powerful by choice.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "OhMyLife - Agency Management Made Minimal",
    description:
      "Self-host in minutes. A lean foundation for projects, clients, finances, and tasks.",
  },
};

export default function LandingPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "OhMyLife",
    description:
      "Base infrastructure to manage your agency which is easy to self-host and built upon. Uses the power of Cloudflare to quickly deliver robust solutions.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://oml.harshnpatel.in",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Project Management",
      "Client Management",
      "Finance Tracking",
      "Task Management",
      "Team Collaboration",
      "Self-Hosted Solution",
    ],
    softwareVersion: "1.0",
    author: {
      "@type": "Person",
      name: "Harsh Patel",
      url: "https://github.com/harshpatel5940",
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Single Screen Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl">
          {/* Logo/Name */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
              OhMyLife
            </h2>
            <div className="h-1 w-16 mx-auto" style={{ backgroundColor: "#82C915" }}></div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 md:mb-8 text-gray-900 dark:text-white leading-tight">
            Agency management
            <br />
            made <span style={{ color: "#82C915" }}>minimal</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 md:mb-16 max-w-2xl mx-auto font-light leading-relaxed px-4">
            Self-host in minutes. A lean foundation for projects, clients, finances, and tasks.
            <span className="block mt-3 text-base sm:text-lg" style={{ color: "#82C915" }}>
              Simple by design. Powerful by choice.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center w-full sm:w-auto px-4">
            <a href="/login" className="w-full sm:w-auto">
              <button
                className="group w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 text-white text-base sm:text-lg font-bold rounded-full transition-all hover:scale-105 hover:shadow-xl shadow-lg flex items-center justify-center gap-3"
                style={{ backgroundColor: "#82C915" }}
              >
                Login
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </a>

            <a
              href="https://github.com/harshpatel5940/ohmylife"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <button className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-transparent border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white text-base sm:text-lg font-semibold rounded-full hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all hover:scale-105 flex items-center justify-center gap-3">
                <Github size={20} />
                GitHub
              </button>
            </a>
          </div>
        </div>
      </main>

      {/* Lean Footer */}
      <footer className="py-8 border-t border-gray-100 dark:border-gray-900">
        <div className="container mx-auto px-6 text-center text-sm text-gray-400 dark:text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} OhMyLife •{" "}
            <a
              href="https://github.com/harshpatel5940/ohmylife"
              target="_blank"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {" "}
              Build with ❤️{" "}
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
