"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckSquare, DollarSign } from "lucide-react";

interface Project {
    id: number;
    name: string;
    description?: string;
    clientId?: number;
    startDate?: string;
    endDate?: string;
}

interface ProjectOverviewProps {
    project: Project;
    clientName: string;
}

interface TaskStats {
    total: number;
    pending: number;
    completed: number;
}

interface TransactionStats {
    count: number;
    totalValue: number;
}

export function ProjectOverview({ project, clientName }: ProjectOverviewProps) {
    const [teamCount, setTeamCount] = useState(0);
    const [taskStats, setTaskStats] = useState<TaskStats>({ total: 0, pending: 0, completed: 0 });
    const [transactionStats, setTransactionStats] = useState<TransactionStats>({ count: 0, totalValue: 0 });
    const [loading, setLoading] = useState(true);



    const fetchStats = useCallback(async () => {
        try {

            const teamRes = await fetch(`/api/projects/${project.id}/team`);
            if (teamRes.ok) {
                const teamData = await teamRes.json() as any[];
                setTeamCount(teamData.length);
            }


            const tasksRes = await fetch(`/api/tasks?projectId=${project.id}`);
            if (tasksRes.ok) {
                const tasksData = await tasksRes.json() as any[];
                const total = tasksData.length;
                const completed = tasksData.filter((t: any) => t.status === "done").length;
                const pending = total - completed;
                setTaskStats({ total, pending, completed });
            }


            const transactionsRes = await fetch(`/api/transactions?projectId=${project.id}`);
            if (transactionsRes.ok) {
                const transactionsData = await transactionsRes.json() as any[];
                const count = transactionsData.length;
                const totalValue = transactionsData.reduce((sum: number, t: any) => {
                    return sum + (t.type === "income" ? t.amount : -t.amount);
                }, 0);
                setTransactionStats({ count, totalValue });
            }
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setLoading(false);
        }
    }, [project.id]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? "..." : teamCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Active team members
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tasks</CardTitle>
                        <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? "..." : taskStats.total}</div>
                        <p className="text-xs text-muted-foreground">
                            {taskStats.completed} completed • {taskStats.pending} pending
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? "..." : transactionStats.count}</div>
                        <p className={`text-xs ${transactionStats.totalValue >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            Net: ${Math.abs(transactionStats.totalValue).toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Project Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold mb-1">Description</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            {project.description || "No description provided."}
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-1">Client</h3>
                        <p className="text-gray-600 dark:text-gray-300">{clientName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold mb-1">Start Date</h3>
                            <p>
                                {project.startDate
                                    ? new Date(project.startDate).toLocaleDateString()
                                    : "N/A"}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-1">End Date</h3>
                            <p>
                                {project.endDate
                                    ? new Date(project.endDate).toLocaleDateString()
                                    : "N/A"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
