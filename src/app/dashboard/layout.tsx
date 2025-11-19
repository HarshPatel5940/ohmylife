"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Briefcase, CheckSquare, Users, CreditCard, UserCircle, Settings } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Map routes to tab values
    // Default to 'projects' if on /dashboard root (though we will redirect)
    const currentTab = pathname.split("/")[2] || "projects";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Top Navigation Bar */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-8 w-full">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white hidden md:block shrink-0">OhMyLife</h1>

                        {/* Tab Navigation */}
                        <Tabs value={currentTab} className="w-full overflow-x-auto">
                            <TabsList className="w-full justify-start bg-transparent p-0 h-auto space-x-2">
                                <Link href="/dashboard/projects">
                                    <TabsTrigger value="projects" className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-none border border-transparent data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-600 rounded-t-lg rounded-b-none px-4 py-2 h-12 gap-2">
                                        <Briefcase size={18} /> Projects
                                    </TabsTrigger>
                                </Link>
                                <Link href="/dashboard/tasks">
                                    <TabsTrigger value="tasks" className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-none border border-transparent data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-600 rounded-t-lg rounded-b-none px-4 py-2 h-12 gap-2">
                                        <CheckSquare size={18} /> Tasks
                                    </TabsTrigger>
                                </Link>
                                <Link href="/dashboard/clients">
                                    <TabsTrigger value="clients" className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-none border border-transparent data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-600 rounded-t-lg rounded-b-none px-4 py-2 h-12 gap-2">
                                        <Users size={18} /> Clients
                                    </TabsTrigger>
                                </Link>
                                <Link href="/dashboard/finance">
                                    <TabsTrigger value="finance" className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-none border border-transparent data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-600 rounded-t-lg rounded-b-none px-4 py-2 h-12 gap-2">
                                        <CreditCard size={18} /> Finance
                                    </TabsTrigger>
                                </Link>
                                <Link href="/dashboard/people">
                                    <TabsTrigger value="people" className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-none border border-transparent data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-600 rounded-t-lg rounded-b-none px-4 py-2 h-12 gap-2">
                                        <UserCircle size={18} /> People
                                    </TabsTrigger>
                                </Link>
                                <Link href="/dashboard/admin">
                                    <TabsTrigger value="admin" className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-none border border-transparent data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-600 rounded-t-lg rounded-b-none px-4 py-2 h-12 gap-2">
                                        <Settings size={18} /> Admin
                                    </TabsTrigger>
                                </Link>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="flex items-center shrink-0 ml-4">
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                            <LogOut size={16} className="mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto p-6">
                {children}
            </main>
        </div>
    );
}
