import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Calendar } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Task {
    id: number;
    title: string;
    status: string;
    priority: string;
    assigneeId?: number;
    dueDate?: string;
}

interface Person {
    id: number;
    name: string;
}

interface ProjectTasksProps {
    tasks: Task[];
    people: Person[];
    projectId: number;
    onTasksChange: () => void;
}

export function ProjectTasks({ tasks, people, projectId, onTasksChange }: ProjectTasksProps) {
    const [taskView, setTaskView] = useState<"list" | "board">("list");
    const [taskDialogOpen, setTaskDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [taskTitle, setTaskTitle] = useState("");
    const [taskStatus, setTaskStatus] = useState("todo");
    const [taskPriority, setTaskPriority] = useState("medium");
    const [taskAssigneeId, setTaskAssigneeId] = useState("none");
    const [taskDueDate, setTaskDueDate] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || task.status === statusFilter;
        return matchesSearch && matchesStatus;
    });


    const tasksByStatus = {
        todo: filteredTasks.filter(t => t.status === "todo"),
        "in-progress": filteredTasks.filter(t => t.status === "in-progress"),
        done: filteredTasks.filter(t => t.status === "done"),
    };

    const openTaskDialog = (task?: Task) => {
        if (task) {
            setEditingTask(task);
            setTaskTitle(task.title);
            setTaskStatus(task.status);
            setTaskPriority(task.priority);
            setTaskAssigneeId(task.assigneeId?.toString() || "none");
            setTaskDueDate(task.dueDate || "");
        } else {
            setEditingTask(null);
            setTaskTitle("");
            setTaskStatus("todo");
            setTaskPriority("medium");
            setTaskAssigneeId("none");
            setTaskDueDate("");
        }
        setTaskDialogOpen(true);
    };

    const handleSaveTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskTitle.trim()) return;

        try {
            const payload = {
                title: taskTitle,
                priority: taskPriority,
                status: taskStatus,
                dueDate: taskDueDate || null,
                assigneeId: taskAssigneeId === "none" ? null : (taskAssigneeId ? parseInt(taskAssigneeId) : null),
                projectId,
                type: "project",
            };

            if (editingTask) {

                const res = await fetch(`/api/tasks/${editingTask.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    setTaskDialogOpen(false);

                    onTasksChange();
                }
            } else {

                const res = await fetch("/api/tasks", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    setTaskDialogOpen(false);

                    onTasksChange();
                }
            }
        } catch (error) {
            console.error("Failed to save task", error);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        if (!confirm("Delete this task?")) return;
        try {
            const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
            if (res.ok) onTasksChange();
        } catch (error) {
            console.error("Failed to delete task", error);
        }
    };

    const getAssigneeName = (assigneeId?: number) => {
        if (!assigneeId) return "Unassigned";
        const person = people.find(p => p.id === assigneeId);
        return person?.name || "Unknown";
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
            case "in-progress": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            case "todo": return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
            default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
        }
    };



    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Project Tasks</h3>
                    <div className="flex gap-2">
                        {/* List/Board Toggle */}
                        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex">
                            <Button
                                variant={taskView === "list" ? "secondary" : "ghost"}
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => setTaskView("list")}
                            >
                                List
                            </Button>
                            <Button
                                variant={taskView === "board" ? "secondary" : "ghost"}
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => setTaskView("board")}
                            >
                                Board
                            </Button>
                        </div>
                        <Button onClick={() => openTaskDialog()}>
                            <Plus className="mr-2 h-4 w-4" /> Add Task
                        </Button>
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
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Task Views */}
            {taskView === "list" ? (
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Assignee</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTasks.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-gray-500">
                                        No tasks found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredTasks.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell className="font-medium">{task.title}</TableCell>
                                        <TableCell>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(task.status)}`}>
                                                {task.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                        </TableCell>
                                        <TableCell>{getAssigneeName(task.assigneeId)}</TableCell>
                                        <TableCell>
                                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openTaskDialog(task)}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteTask(task.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-300px)]">
                    {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
                        <div
                            key={status}
                            className="min-w-[300px] w-full bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4 flex flex-col gap-3"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-gray-700 dark:text-gray-300 capitalize">
                                    {status.replace("-", " ")}
                                </h3>
                                <span className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded-full">
                                    {statusTasks.length}
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                                {statusTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all"
                                        onClick={() => openTaskDialog(task)}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
                                        </div>

                                        <div className="flex gap-2 items-center mt-3 flex-wrap">
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-medium uppercase tracking-wide ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                            {task.dueDate && (
                                                <span className="text-xs text-gray-400 ml-auto flex items-center">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500">
                                            {getAssigneeName(task.assigneeId)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Task Dialog */}
            <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingTask ? "Edit Task" : "Add New Task"}</DialogTitle>
                        <DialogDescription>
                            {editingTask ? "Update task details" : "Create a new task for this project"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveTask}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={taskTitle}
                                    onChange={(e) => setTaskTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={taskStatus} onValueChange={setTaskStatus}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todo">To Do</SelectItem>
                                            <SelectItem value="in-progress">In Progress</SelectItem>
                                            <SelectItem value="done">Done</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <Select value={taskPriority} onValueChange={setTaskPriority}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="assignee">Assignee</Label>
                                <Select value={taskAssigneeId} onValueChange={setTaskAssigneeId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select assignee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Unassigned</SelectItem>
                                        {people.map((person) => (
                                            <SelectItem key={person.id} value={person.id.toString()}>
                                                {person.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dueDate">Due Date</Label>
                                <Input
                                    id="dueDate"
                                    type="date"
                                    value={taskDueDate}
                                    onChange={(e) => setTaskDueDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setTaskDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {editingTask ? "Update" : "Create"} Task
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
