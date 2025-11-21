import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Users, DollarSign, CheckSquare } from "lucide-react";

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
          Your agency, <span className="text-blue-600 dark:text-blue-400">simplified</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl">
          All-in-one platform for managing projects, clients, finances, and team.
          Self-hosted, fast, and built for privacy.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mb-12">
          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <Briefcase className="h-8 w-8 mb-3 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold mb-2">Projects</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track projects, tasks, and team collaboration
            </p>
          </div>

          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <Users className="h-8 w-8 mb-3 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold mb-2">CRM</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage clients, leads, and sales pipeline
            </p>
          </div>

          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <DollarSign className="h-8 w-8 mb-3 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold mb-2">Finance</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Invoices, transactions, and financial tracking
            </p>
          </div>

          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <CheckSquare className="h-8 w-8 mb-3 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold mb-2">Tasks</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Kanban boards and task management
            </p>
          </div>
        </div>

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
