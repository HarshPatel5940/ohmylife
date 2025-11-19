import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="px-6 h-16 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <div className="font-bold text-xl">OhMyLife</div>
        <nav className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 max-w-3xl">
          Manage your agency with <span className="text-blue-600 dark:text-blue-400">clarity</span> and <span className="text-blue-600 dark:text-blue-400">control</span>.
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
          Project management, CRM, finance, and HR - all in one self-hosted platform.
          Built for speed, privacy, and simplicity.
        </p>
        <div className="flex gap-4">
          <Link href="/login">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 text-sm">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} OhMyLife. All rights reserved.</p>
          <p className="mt-2">
            Built with Next.js, Cloudflare D1, and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}
