"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle2, Circle } from "lucide-react";

interface Task {
    id: number;
    title: string;
    status: string;
    priority: string;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await fetch("/api/tasks");
            if (res.ok) {
                const data = await res.json() as Task[];
                setTasks(data);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        try {
            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTask }),
            });
            if (res.ok) {
                setNewTask("");
                fetchTasks();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>

            <Card>
                <CardContent className="p-4">
                    <form onSubmit={handleCreate} className="flex gap-2">
                        <Input
                            placeholder="Add a new task..."
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                        />
                        <Button type="submit">
                            <Plus className="h-4 w-4 mr-2" /> Add
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-2">
                {tasks.map((task) => (
                    <Card key={task.id} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button className="text-gray-400 hover:text-green-500">
                                    {task.status === 'done' ? <CheckCircle2 className="text-green-500" /> : <Circle />}
                                </button>
                                <span className={task.status === 'done' ? "line-through text-gray-500" : ""}>{task.title}</span>
                            </div>
                            <Badge variant="outline">{task.priority}</Badge>
                        </CardContent>
                    </Card>
                ))}
                {tasks.length === 0 && !loading && (
                    <div className="text-center text-gray-500 py-8">No tasks yet.</div>
                )}
            </div>
        </div>
    );
}
