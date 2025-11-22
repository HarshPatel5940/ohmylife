import React from 'react';
import Link from 'next/link';
import { ArrowRight, Github } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
      {/* Single Screen Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="max-w-4xl">
          {/* Logo/Name */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
              OhMyLife
            </h2>
            <div className="h-1 w-16 mx-auto" style={{ backgroundColor: '#82C915' }}></div>
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-8 text-gray-900 dark:text-white leading-tight">
            Agency management
            <br />
            made <span style={{ color: '#82C915' }}>minimal</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto font-light leading-relaxed">
            Self-host in minutes. A lean foundation for projects, clients, finances, and tasks.
            <span className="block mt-3 text-lg" style={{ color: '#82C915' }}>
              Simple by design. Powerful by choice.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link href="/login">
              <button
                className="group px-10 py-5 text-white text-lg font-bold rounded-full transition-all hover:scale-105 hover:shadow-xl shadow-lg flex items-center gap-3"
                style={{ backgroundColor: '#82C915' }}
              >
                Get Started
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <a href="https://github.com/harshpatel5940/ohmylife" target="_blank" rel="noopener noreferrer">
              <button className="px-10 py-5 bg-transparent border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white text-lg font-semibold rounded-full hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all hover:scale-105 flex items-center gap-3">
                <Github size={22} />
                GitHub
              </button>
            </a>
          </div>
        </div>
      </main>

      {/* Lean Footer */}
      <footer className="py-8 border-t border-gray-100 dark:border-gray-900">
        <div className="container mx-auto px-6 text-center text-sm text-gray-400 dark:text-gray-600">
          <p>&copy; {new Date().getFullYear()} OhMyLife • <a href="https://github.com/harshpatel5940/ohmylife" target="_blank" className="hover:text-gray-900 dark:hover:text-white transition-colors"> Build with ❤️ </a></p>
        </div>
      </footer>
    </div>
  );
}