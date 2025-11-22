"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter, useSearchParams, usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageSquare, MoreVertical, Edit2, StickyNote } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
    ProjectHeader,
    ProjectOverview,
    ProjectTasks,
    ProjectNotes,
    ProjectTeam,
    ProjectFiles,
} from "@/components/project";

interface Project {
    id: number;
    name: string;
    description: string;
    clientId?: number;
    status: string;
    startDate: string;
    endDate: string;
}

interface Client {
    id: number;
    name: string;
    company: string;
}

interface Person {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface ProjectTask {
    id: number;
    title: string;
    status: string;
    priority: string;
    assigneeId?: number;
    dueDate?: string;
}

interface ProjectFile {
    id: number;
    name: string;
    size: number;
    type: string;
    url: string;
    uploadedAt: string;
}

interface ChatMessage {
    id: number;
    content: string;
    userId: number;
    senderName: string;
    createdAt: string;
}

interface TeamMember {
    id: number;
    name: string;
    role: string;
    email: string;
    personId?: number;
}

interface Note {
    id: number;
    content: string;
    createdAt: string;
}

import { Suspense } from "react";

function ProjectDetailsContent() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = params.id;


    const [project, setProject] = useState<Project | null>(null);
    const [activeTab, setActiveTab] = useState("overview");


    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const pathname = usePathname();

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        router.replace(`${pathname}?tab=${value}`, { scroll: false });
    };

    const [tasks, setTasks] = useState<ProjectTask[]>([]);
    const [people, setPeople] = useState<Person[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [files, setFiles] = useState<ProjectFile[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);


    const [editProjectOpen, setEditProjectOpen] = useState(false);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editClientId, setEditClientId] = useState("");
    const [editStatus, setEditStatus] = useState("");
    const [editStartDate, setEditStartDate] = useState("");
    const [editEndDate, setEditEndDate] = useState("");


    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);


    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [currentUser, setCurrentUser] = useState<{ id: number; username: string; role: string } | null>(null);
    const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState("");
    const [noteClickState, setNoteClickState] = useState<{ [key: number]: number }>({});

    useEffect(() => {
        fetch("/api/auth/me")
            .then(res => {
                if (res.ok) return res.json();
                throw new Error("Not authenticated");
            })
            .then(data => setCurrentUser(data as { id: number; username: string; role: string }))
            .catch(err => console.error("Failed to fetch user", err));
    }, []);




    useEffect(() => {
        if (activeTab === "chat" && id && !socket) {

            fetch(`/api/projects/${id}/chat/messages`)
                .then(res => res.json())
                .then(data => setMessages(data as ChatMessage[]))
                .catch(err => console.error("Failed to fetch chat history", err));


            const protocol = window.location.protocol === "https:" ? "wss" : "ws";
            const wsUrl = `${protocol}://${window.location.host}/api/projects/${id}/chat`;
            const ws = new WebSocket(wsUrl);

            ws.onopen = () => console.log("Connected to chat");
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === "message") {
                    setMessages(prev => [...prev, data.message]);
                } else if (data.type === "message_updated") {
                    setMessages(prev => prev.map(msg =>
                        msg.id === data.messageId ? { ...msg, content: data.content } : msg
                    ));
                } else if (data.type === "typing") {
                    setTypingUsers(prev => {
                        const next = new Set(prev);
                        if (data.isTyping) {
                            next.add(data.senderName);
                        } else {
                            next.delete(data.senderName);
                        }
                        return next;
                    });
                }
            };
            ws.onclose = () => {
                console.log("Disconnected from chat");
                setSocket(null);
            };

            setSocket(ws);
        }

        return () => {
            if (socket) {
                socket.close();
            }
        };

    }, [activeTab, id, socket]);


    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchProject = useCallback(async () => {
        try {
            const res = await fetch(`/api/projects/${id}`);
            if (res.ok) {
                const data = await res.json() as Project;
                setProject(data);
            }
        } catch (error) {
            console.error("Failed to fetch project", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    const fetchTasks = useCallback(async () => {
        try {
            const res = await fetch(`/api/tasks?projectId=${id}`);
            if (res.ok) {
                const data = await res.json() as ProjectTask[];
                setTasks(data);
            }
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        }
    }, [id]);

    const fetchPeople = useCallback(async () => {
        try {
            const res = await fetch("/api/people");
            if (res.ok) {
                const data = await res.json() as Person[];
                setPeople(data);
            }
        } catch (error) {
            console.error("Failed to fetch people", error);
        }
    }, []);

    const fetchClients = useCallback(async () => {
        try {
            const res = await fetch("/api/clients");
            if (res.ok) {
                const data = await res.json() as Client[];
                setClients(data);
            }
        } catch (error) {
            console.error("Failed to fetch clients", error);
        }
    }, []);

    const fetchFiles = useCallback(async () => {
        try {
            const res = await fetch(`/api/projects/${id}/files`);
            if (res.ok) {
                const data = await res.json() as ProjectFile[];
                setFiles(data);
            }
        } catch (error) {
            console.error("Failed to fetch files", error);
        }
    }, [id]);

    const fetchNotes = useCallback(async () => {
        try {
            const res = await fetch(`/api/projects/${id}/notes`);
            if (res.ok) {
                const data = await res.json() as Note[];
                setNotes(data);
            }
        } catch (error) {
            console.error("Failed to fetch notes", error);
        }
    }, [id]);

    const fetchTeamMembers = useCallback(async () => {
        try {
            const res = await fetch(`/api/projects/${id}/team`);
            if (res.ok) {
                const data = await res.json() as TeamMember[];
                setTeamMembers(data);
            }
        } catch (error) {
            console.error("Failed to fetch team members", error);
        }
    }, [id]);


    useEffect(() => {
        if (id) {
            fetchProject();
            fetchTeamMembers();
        }
    }, [id, fetchProject, fetchTeamMembers]);


    useEffect(() => {
        if (id) {
            if (activeTab === "tasks") {
                fetchTasks();
                fetchPeople();
            }
            if (activeTab === "team") {
                fetchTeamMembers();
                fetchPeople();
            }
            if (activeTab === "files") fetchFiles();
            if (activeTab === "notes") fetchNotes();
        }
    }, [id, activeTab, fetchTasks, fetchTeamMembers, fetchFiles, fetchNotes, fetchPeople]);

    const openEditDialog = () => {
        if (!project) return;
        setEditName(project.name);
        setEditDescription(project.description);
        setEditClientId(project.clientId?.toString() || "none");
        setEditStatus(project.status);
        setEditStartDate(project.startDate);
        setEditEndDate(project.endDate);
        setEditProjectOpen(true);
    };

    const handleUpdateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/projects/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: editName,
                    description: editDescription,
                    clientId: editClientId === "none" ? null : (editClientId ? parseInt(editClientId) : null),
                    status: editStatus,
                    startDate: editStartDate,
                    endDate: editEndDate,
                }),
            });
            if (res.ok) {
                fetchProject();
                setEditProjectOpen(false);
            }
        } catch (error) {
            console.error("Failed to update project", error);
        }
    };

    const handleDeleteProject = async () => {
        try {
            const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
            if (res.ok) {
                router.push("/dashboard/projects");
            }
        } catch (error) {
            console.error("Failed to delete project", error);
        }
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !socket || !currentUser) return;

        socket.send(JSON.stringify({
            type: "message",
            projectId: parseInt(id as string),
            userId: currentUser.id,
            senderName: currentUser.username,
            content: newMessage
        }));
        setNewMessage("");


        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
        socket.send(JSON.stringify({
            type: "typing",
            userId: currentUser.id,
            senderName: currentUser.username,
            isTyping: false
        }));
    };

    const handleTyping = () => {
        if (!socket || !currentUser) return;

        socket.send(JSON.stringify({
            type: "typing",
            userId: currentUser.id,
            senderName: currentUser.username,
            isTyping: true
        }));

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            if (!socket || !currentUser) return;
            socket.send(JSON.stringify({
                type: "typing",
                userId: currentUser.id,
                senderName: currentUser.username,
                isTyping: false
            }));
        }, 2000);
    };

    const handleEditMessage = (messageId: number, content: string) => {
        setEditingMessageId(messageId);
        setEditContent(content);
    };

    const submitEditMessage = () => {
        if (!socket || !editContent.trim()) return;
        socket.send(JSON.stringify({
            type: "edit",
            messageId: editingMessageId,
            content: editContent
        }));
        setEditingMessageId(null);
        setEditContent("");
    };

    const handleQuickNote = async (msgId: number, content: string) => {
        const currentClicks = noteClickState[msgId] || 0;

        if (currentClicks === 0) {

            setNoteClickState(prev => ({ ...prev, [msgId]: 1 }));
            toast.info("Click again to save as note");


            setTimeout(() => {
                setNoteClickState(prev => {
                    const newState = { ...prev };
                    delete newState[msgId];
                    return newState;
                });
            }, 3000);
            return;
        }


        try {
            const res = await fetch(`/api/projects/${id}/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: "Quick Note from Chat",
                    content: content
                })
            });
            if (res.ok) {
                toast.success("Note added successfully");
                fetchNotes();

                setNoteClickState(prev => {
                    const newState = { ...prev };
                    delete newState[msgId];
                    return newState;
                });
            }
        } catch (error) {
            console.error("Failed to add note", error);
            toast.error("Failed to add note");
        }
    };

    const getClientName = () => {
        if (!project?.clientId) return "No client";
        const client = clients.find(c => c.id === project.clientId);
        return client ? `${client.name} (${client.company})` : "Unknown client";
    };

    if (loading) {
        return <div className="flex items-center justify-center h-96">Loading...</div>;
    }

    if (!project) {
        return <div className="flex items-center justify-center h-96">Project not found</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <ProjectHeader
                project={project}
                onEdit={openEditDialog}
                onDelete={() => setDeleteDialogOpen(true)}
            />

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                    <TabsTrigger value="files">Files</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="chat">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <ProjectOverview project={project} clientName={getClientName()} />
                </TabsContent>

                <TabsContent value="tasks">
                    <ProjectTasks
                        tasks={tasks}
                        people={people}
                        projectId={project.id}
                        onTasksChange={fetchTasks}
                    />
                </TabsContent>

                <TabsContent value="team">
                    <ProjectTeam
                        teamMembers={teamMembers}
                        people={people}
                        projectId={project.id}
                        onTeamChange={fetchTeamMembers}
                        currentUserRole={currentUser?.role}
                    />
                </TabsContent>

                <TabsContent value="files">
                    <ProjectFiles
                        files={files}
                        projectId={project.id}
                        onFilesChange={fetchFiles}
                    />
                </TabsContent>

                <TabsContent value="notes">
                    <ProjectNotes
                        notes={notes}
                        projectId={project.id}
                        onNotesChange={fetchNotes}
                    />
                </TabsContent>

                <TabsContent value="chat">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col h-[500px]">
                                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                                    {messages.length === 0 ? (
                                        <p className="text-center text-gray-500 py-8">No messages yet</p>
                                    ) : (
                                        messages.map((msg) => (
                                            <div key={msg.id} className="flex items-start gap-3 group">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback>
                                                        {msg.senderName?.charAt(0) || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-sm">
                                                            {msg.senderName || "Unknown"}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(msg.createdAt).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                    {editingMessageId === msg.id ? (
                                                        <div className="mt-1 flex gap-2">
                                                            <Input
                                                                value={editContent}
                                                                onChange={(e) => setEditContent(e.target.value)}
                                                                className="h-8 text-sm"
                                                            />
                                                            <Button size="sm" onClick={submitEditMessage}>Save</Button>
                                                            <Button size="sm" variant="ghost" onClick={() => setEditingMessageId(null)}>Cancel</Button>
                                                        </div>
                                                    ) : (
                                                        <div className="group relative">
                                                            <p className="text-sm mt-1">{msg.content}</p>
                                                            <div className="absolute top-0 right-0 hidden group-hover:flex gap-1 bg-white shadow-sm rounded-md border p-1">
                                                                {currentUser?.id === msg.userId && (
                                                                    <button
                                                                        onClick={() => handleEditMessage(msg.id, msg.content)}
                                                                        className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600"
                                                                        title="Edit"
                                                                    >
                                                                        <Edit2 className="h-3 w-3" />
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => handleQuickNote(msg.id, msg.content)}
                                                                    className={`p-1 hover:bg-gray-100 rounded transition-colors ${noteClickState[msg.id] ? "text-green-600 bg-green-50" : "text-gray-500 hover:text-green-600"}`}
                                                                    title={noteClickState[msg.id] ? "Click again to confirm" : "Save as Note"}
                                                                >
                                                                    <StickyNote className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    {typingUsers.size > 0 && (
                                        <div className="text-xs text-gray-500 italic">
                                            {Array.from(typingUsers).join(", ")} {typingUsers.size === 1 ? "is" : "are"} typing...
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Type a message..."
                                            value={newMessage}
                                            onChange={(e) => {
                                                setNewMessage(e.target.value);
                                                handleTyping();
                                            }}
                                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                        />
                                        <Button onClick={handleSendMessage}>
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Edit Project Dialog */}
            <Dialog open={editProjectOpen} onOpenChange={setEditProjectOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
                        <DialogDescription>Update project information</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateProject}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Project Name *</Label>
                                <Input
                                    id="name"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="client">Client</Label>
                                    <Select value={editClientId} onValueChange={setEditClientId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a client" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No Client</SelectItem>
                                            {clients.map((client) => (
                                                <SelectItem key={client.id} value={client.id.toString()}>
                                                    {client.name} {client.company && `(${client.company})`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={editStatus} onValueChange={setEditStatus}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="on-hold">On Hold</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={editStartDate}
                                        onChange={(e) => setEditStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={editEndDate}
                                        onChange={(e) => setEditEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setEditProjectOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Update Project</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteProject}
                title="Delete Project"
                description={`Are you sure you want to delete "${project.name}"? This action cannot be undone and will delete all associated tasks, files, and notes.`}
            />
        </div>
    );
}

export default function ProjectDetailsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProjectDetailsContent />
        </Suspense>
    );
}
