"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Users,
    Briefcase,
    DollarSign,
    CheckSquare,
    Target,
    Plus,
    ArrowRight,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    Clock,
    Calendar
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
    totalClients: number;
    totalProjects: number;
    totalSales: number;
    activeTasks: number;
    newLeads: number;
    recentProjects: any[];
    // Add these new fields to your API response
    projectsByStatus?: { active: number; completed: number; on_hold: number; archived: number };
    tasksByPriority?: { high: number; medium: number; low: number };
    tasksByType?: { project: number; personal: number };
    upcomingDeadlines?: any[];
    monthlyRevenue?: { current: number; previous: number };
    overdueInvoices?: number;
    recentActivity?: any[];
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/dashboard");
                if (res.ok) {
                    const data = await res.json() as DashboardStats;
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    // Calculate revenue trend
    const revenueTrend = stats?.monthlyRevenue
        ? ((stats.monthlyRevenue.current - stats.monthlyRevenue.previous) / stats.monthlyRevenue.previous) * 100
        : 0;

    // Calculate task completion rate
    const totalTasks = stats?.activeTasks || 0;
    const completionRate = totalTasks > 0 ? 65 : 0; // You can calculate this from actual data

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">Welcome back! Here&apos;s what&apos;s happening today.</p>
                </div>
                <Link href="/dashboard/projects?new=true">
                    <Button size="lg" className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" /> New Project
                    </Button>
                </Link>
            </div>

            {/* Alerts Section */}
            {(stats?.overdueInvoices && stats.overdueInvoices > 0) && (
                <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-900">
                    <CardContent className="flex items-center gap-3 pt-6">
                        <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        <div className="flex-1">
                            <p className="font-medium text-orange-900 dark:text-orange-100">
                                You have {stats.overdueInvoices} overdue invoice{stats.overdueInvoices > 1 ? 's' : ''}
                            </p>
                            <p className="text-sm text-orange-700 dark:text-orange-300">
                                Review your pending payments to maintain cash flow
                            </p>
                        </div>
                        <Link href="/dashboard/sales?filter=overdue">
                            <Button variant="outline" size="sm" className="border-orange-300 dark:border-orange-700">
                                View Invoices
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {/* Primary Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Link href="/dashboard/projects">
                    <Card className="hover:shadow-md transition-all cursor-pointer h-full border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                            <Briefcase className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.projectsByStatus?.active || stats?.totalProjects || 0}</div>
                            <div className="flex items-center gap-2 mt-2">
                                <Progress value={((stats?.projectsByStatus?.active || 0) / (stats?.totalProjects || 1)) * 100} className="h-1" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                {stats?.projectsByStatus?.completed || 0} completed this month
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/tasks">
                    <Card className="hover:shadow-md transition-all cursor-pointer h-full border-l-4 border-l-purple-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
                            <CheckSquare className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.activeTasks || 0}</div>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="destructive" className="text-xs">{stats?.tasksByPriority?.high || 0} High</Badge>
                                <Badge variant="secondary" className="text-xs">{stats?.tasksByPriority?.medium || 0} Med</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                {stats?.tasksByType?.project || 0} project · {stats?.tasksByType?.personal || 0} personal
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/sales">
                    <Card className="hover:shadow-md transition-all cursor-pointer h-full border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{(stats?.monthlyRevenue?.current || stats?.totalSales || 0).toLocaleString()}</div>
                            <div className="flex items-center gap-1 mt-2">
                                {revenueTrend >= 0 ? (
                                    <>
                                        <TrendingUp className="h-4 w-4 text-green-600" />
                                        <span className="text-xs font-medium text-green-600">+{revenueTrend.toFixed(1)}%</span>
                                    </>
                                ) : (
                                    <>
                                        <TrendingDown className="h-4 w-4 text-red-600" />
                                        <span className="text-xs font-medium text-red-600">{revenueTrend.toFixed(1)}%</span>
                                    </>
                                )}
                                <span className="text-xs text-muted-foreground ml-1">vs last month</span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/leads">
                    <Card className="hover:shadow-md transition-all cursor-pointer h-full border-l-4 border-l-orange-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
                            <Target className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.newLeads || 0}</div>
                            <div className="mt-2">
                                <Badge className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                                    New this week
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Follow up to convert
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Projects */}
                <Card className="col-span-4">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Projects</CardTitle>
                        <Link href="/dashboard/projects">
                            <Button variant="ghost" size="sm" className="gap-1">
                                View All <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats?.recentProjects.map((project: any) => (
                                <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                                    <div className="flex items-center hover:bg-gray-50 dark:hover:bg-gray-900 p-3 rounded-lg transition-colors cursor-pointer">
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium leading-none">{project.name}</p>
                                                <Badge
                                                    variant={
                                                        project.status === 'active' ? 'default' :
                                                            project.status === 'completed' ? 'secondary' :
                                                                'outline'
                                                    }
                                                    className="text-xs"
                                                >
                                                    {project.status.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {project.description || 'No description'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-medium text-gray-500">
                                                {new Date(project.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {(!stats?.recentProjects || stats.recentProjects.length === 0) && (
                                <div className="text-center text-muted-foreground py-8">
                                    <Briefcase className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                    <p>No recent projects found.</p>
                                    <Link href="/dashboard/projects?new=true">
                                        <Button variant="link" size="sm" className="mt-2">Create your first project</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column */}
                <div className="col-span-3 space-y-4">
                    {/* Upcoming Deadlines */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Upcoming Deadlines
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {stats?.upcomingDeadlines && stats.upcomingDeadlines.length > 0 ? (
                                    stats.upcomingDeadlines.slice(0, 4).map((item: any) => (
                                        <div key={item.id} className="flex items-start gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                            <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium">{item.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Due {new Date(item.dueDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">No upcoming deadlines</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            <Link href="/dashboard/projects?new=true">
                                <Button variant="outline" className="w-full justify-start h-auto py-3 px-3" size="sm">
                                    <Briefcase className="mr-3 h-4 w-4 text-blue-500" />
                                    <div className="text-left">
                                        <div className="text-sm font-medium">Create Project</div>
                                    </div>
                                </Button>
                            </Link>
                            <Link href="/dashboard/leads?new=true">
                                <Button variant="outline" className="w-full justify-start h-auto py-3 px-3" size="sm">
                                    <Users className="mr-3 h-4 w-4 text-green-500" />
                                    <div className="text-left">
                                        <div className="text-sm font-medium">Add Client</div>
                                    </div>
                                </Button>
                            </Link>
                            <Link href="/dashboard/sales?new=true">
                                <Button variant="outline" className="w-full justify-start h-auto py-3 px-3" size="sm">
                                    <DollarSign className="mr-3 h-4 w-4 text-yellow-500" />
                                    <div className="text-left">
                                        <div className="text-sm font-medium">Record Transaction</div>
                                    </div>
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}