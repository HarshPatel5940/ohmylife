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
        try {
            const taskData = {
                title: taskTitle,
                status: taskStatus,
                priority: taskPriority,
                assigneeId: taskAssigneeId === "none" ? null : parseInt(taskAssigneeId),
                dueDate: taskDueDate || null,
                projectId,
            };

            const url = editingTask ? `/api/tasks/${editingTask.id}` : "/api/tasks";
            const method = editingTask ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(taskData),
            });

            if (res.ok) {
                onTasksChange();
                setTaskDialogOpen(false);
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

    const tasksByStatus = {
        todo: tasks.filter(t => t.status === "todo"),
        "in-progress": tasks.filter(t => t.status === "in-progress"),
        done: tasks.filter(t => t.status === "done"),
    };

    return (
        <div className="space-y-4">
            {/* Header */}
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
                            {tasks.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-gray-500">
                                        No tasks yet
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tasks.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell className="font-medium">{task.title}</TableCell>
                                        <TableCell>
                                            <Badge variant={task.status === "done" ? "default" : "secondary"}>
                                                {task.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={task.priority === "high" ? "destructive" : "outline"}>
                                                {task.priority}
                                            </Badge>
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
                <div className="grid grid-cols-3 gap-4">
                    {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
                        <div key={status} className="space-y-2">
                            <h4 className="font-medium capitalize flex items-center justify-between">
                                {status.replace("-", " ")}
                                <Badge variant="outline">{statusTasks.length}</Badge>
                            </h4>
                            <div className="space-y-2">
                                {statusTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="p-3 border rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => openTaskDialog(task)}
                                    >
                                        <h5 className="font-medium mb-2">{task.title}</h5>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <Badge variant={task.priority === "high" ? "destructive" : "outline"} className="text-xs">
                                                {task.priority}
                                            </Badge>
                                            {task.dueDate && (
                                                <span className="flex items-center">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    {new Date(task.dueDate).toLocaleDateString()}
                                                </span>
                                            )}
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
