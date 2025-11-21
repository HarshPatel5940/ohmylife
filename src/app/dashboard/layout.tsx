"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Briefcase, CheckSquare, Users, CreditCard, UserCircle, Settings, LayoutDashboard, UserPlus, MoreVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    // Map routes to tab values
    const currentTab = pathname.split("/")[2] || "dashboard";

    const handleLogout = () => {
        // TODO: Implement logout logic
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Top Navigation Bar */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-6 flex-1">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white hidden md:block shrink-0">OhMyLife</h1>

                        {/* Tab Navigation */}
                        <Tabs value={currentTab} className="w-full overflow-x-auto">
                            <TabsList className="w-full justify-start bg-transparent p-0 h-auto space-x-1">
                                <Link href="/dashboard">
                                    <TabsTrigger value="dashboard" className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-none rounded-md px-3 py-2 gap-2">
                                        <LayoutDashboard size={18} /> Dashboard
                                    </TabsTrigger>
                                </Link>
                                <Link href="/dashboard/projects">
                                    <TabsTrigger value="projects" className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-none rounded-md px-3 py-2 gap-2">
                                        <Briefcase size={18} /> Projects
                                    </TabsTrigger>
                                </Link>
                                <Link href="/dashboard/tasks">
                                    <TabsTrigger value="tasks" className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-none rounded-md px-3 py-2 gap-2">
                                        <CheckSquare size={18} /> Tasks
                                    </TabsTrigger>
                                </Link>
                                <Link href="/dashboard/leads">
                                    <TabsTrigger value="leads" className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-none rounded-md px-3 py-2 gap-2">
                                        <UserPlus size={18} /> Leads
                                    </TabsTrigger>
                                </Link>
                                <Link href="/dashboard/sales">
                                    <TabsTrigger value="sales" className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-none rounded-md px-3 py-2 gap-2">
                                        <CreditCard size={18} /> Finance
                                    </TabsTrigger>
                                </Link>

                            </TabsList>
                        </Tabs>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center shrink-0 ml-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <MoreVertical size={18} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/admin" className="flex items-center cursor-pointer">
                                        <Settings size={16} className="mr-2" />
                                        Admin
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="text-red-600 focus:text-red-600 cursor-pointer"
                                >
                                    <LogOut size={16} className="mr-2" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
