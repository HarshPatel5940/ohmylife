"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Task, getColumns } from "./columns";
import { DataTable } from "./data-table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);


    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");
    const [status, setStatus] = useState("todo");
    const [dueDate, setDueDate] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === "all" || task.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [tasks, search, statusFilter]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await fetch("/api/tasks?type=personal");
            if (res.ok) {
                const data = await res.json() as Task[];
                setTasks(data);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            const payload = {
                title,
                description,
                priority,
                status,
                dueDate: dueDate || null,
                type: "personal",
            };

            if (editingTask) {

                const res = await fetch(`/api/tasks/${editingTask.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    setOpen(false);
                    resetForm();
                    fetchTasks();
                }
            } else {

                const res = await fetch("/api/tasks", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    setOpen(false);
                    resetForm();
                    fetchTasks();
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = useCallback(async (task: Task) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        try {
            const res = await fetch(`/api/tasks/${task.id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchTasks();
            }
        } catch (error) {
            console.error(error);
        }
    }, []);

    const handleEdit = useCallback((task: Task) => {
        setEditingTask(task);
        setTitle(task.title);
        setDescription(task.description || "");
        setPriority(task.priority);
        setStatus(task.status);
        setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "");
        setOpen(true);
    }, []);

    const resetForm = () => {
        setEditingTask(null);
        setTitle("");
        setDescription("");
        setPriority("medium");
        setStatus("todo");
        setDueDate("");
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            case "medium": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "low": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "done": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "in_progress": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            case "todo": return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
            case "blocked": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
        }
    };

    const columns = useMemo(() => getColumns({
        onEdit: handleEdit,
        onDelete: handleDelete
    }), [handleEdit, handleDelete]);

    const [view, setView] = useState<"list" | "board">("board");
    const [draggedTask, setDraggedTask] = useState<Task | null>(null);

    const handleDragStart = (task: Task) => {
        setDraggedTask(task);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = async (e: React.DragEvent, newStatus: Task["status"]) => {
        e.preventDefault();
        if (!draggedTask || draggedTask.status === newStatus) return;


        const updatedTasks = tasks.map(t =>
            t.id === draggedTask.id ? { ...t, status: newStatus } : t
        );
        setTasks(updatedTasks);
        setDraggedTask(null);

        try {
            const res = await fetch(`/api/tasks/${draggedTask.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) {
                fetchTasks();
            }
        } catch (error) {
            console.error("Failed to update task status", error);
            fetchTasks();
        }
    };

    const boardColumns: { id: Task["status"], label: string }[] = [
        { id: "todo", label: "To Do" },
        { id: "in_progress", label: "In Progress" },
        { id: "done", label: "Done" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
                    <div className="flex gap-2 items-center">
                        <Tabs value={view} onValueChange={(v) => setView(v as "list" | "board")}>
                            <TabsList>
                                <TabsTrigger value="board">Board</TabsTrigger>
                                <TabsTrigger value="list">List</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <Dialog open={open} onOpenChange={(val) => {
                            setOpen(val);
                            if (!val) resetForm();
                        }}>
                            <DialogTrigger asChild>
                                <Button onClick={resetForm}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Task
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>{editingTask ? "Edit Task" : "Add New Task"}</DialogTitle>
                                    <DialogDescription>
                                        {editingTask ? "Update task details." : "Create a new task for your board."}
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSave}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="title" className="text-right">
                                                Title
                                            </Label>
                                            <Input
                                                id="title"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="col-span-3"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-start gap-4">
                                            <Label htmlFor="description" className="text-right pt-2">
                                                Description
                                            </Label>
                                            <Textarea
                                                id="description"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="col-span-3"
                                                rows={3}
                                                placeholder="Optional task description..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="priority" className="text-right">
                                                Priority
                                            </Label>
                                            <Select value={priority} onValueChange={setPriority}>
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Select priority" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="low">Low</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="high">High</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="status" className="text-right">
                                                Status
                                            </Label>
                                            <Select value={status} onValueChange={setStatus}>
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="todo">To Do</SelectItem>
                                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                                    <SelectItem value="done">Done</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="dueDate" className="text-right">
                                                Due Date
                                            </Label>
                                            <Input
                                                id="dueDate"
                                                type="date"
                                                value={dueDate}
                                                onChange={(e) => setDueDate(e.target.value)}
                                                className="col-span-3"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit">{editingTask ? "Update Task" : "Save Task"}</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="flex gap-4 items-center">
                    <div className="flex-1">
                        <Input
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="todo">To Do</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Tabs value={view} className="w-full">
                <TabsContent value="list">
                    <DataTable columns={columns} data={filteredTasks} />
                </TabsContent>
                <TabsContent value="board">
                    <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-200px)]">
                        {boardColumns.map(col => (
                            <div
                                key={col.id}
                                className="min-w-[300px] w-full bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4 flex flex-col gap-3"
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, col.id)}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">{col.label}</h3>
                                    <span className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded-full">
                                        {filteredTasks.filter(t => t.status === col.id).length}
                                    </span>
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                                    {filteredTasks.filter(t => t.status === col.id).map(task => (
                                        <div
                                            key={task.id}
                                            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 cursor-move hover:shadow-md transition-all"
                                            draggable
                                            onDragStart={() => handleDragStart(task)}
                                            onClick={() => handleEdit(task)}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
                                            </div>
                                            {task.description && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                                                    {task.description}
                                                </p>
                                            )}
                                            <div className="flex gap-2 items-center mt-3 flex-wrap">
                                                <span className={`text-[10px] px-2 py-0.5 rounded font-medium uppercase tracking-wide ${getPriorityColor(task.priority)}`}>
                                                    {task.priority}
                                                </span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded font-medium uppercase tracking-wide ${getStatusColor(task.status)}`}>
                                                    {task.status.replace('_', ' ')}
                                                </span>
                                                {task.dueDate && (
                                                    <span className="text-xs text-gray-400 ml-auto">
                                                        {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
