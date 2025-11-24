"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter, useSearchParams, usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send,
  MessageSquare,
  MoreVertical,
  Edit2,
  StickyNote,
  Reply,
  X,
  Check,
  CheckCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  deletedAt?: string | null;
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
  itemType: "file" | "drawing";
  isPrivate?: boolean;
}

interface ChatMessage {
  id: number;
  content: string;
  userId: number;
  senderName: string;
  createdAt: string;
  replyToId?: number;
  replyToContent?: string;
  replyToSender?: string;
  readBy?: Array<{
    userId: number;
    userName: string;
    readAt: number;
  }>;
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
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState<{
    id: number;
    username: string;
    role: string;
  } | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [noteClickState, setNoteClickState] = useState<{ [key: number]: number }>({});
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const messageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [unreadCount, setUnreadCount] = useState(0);
  const lastReadMessageIdRef = useRef<number>(0);
  const chatInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not authenticated");
      })
      .then((data) => setCurrentUser(data as { id: number; username: string; role: string }))
      .catch((err) => console.error("Failed to fetch user", err));
  }, []);

  useEffect(() => {
    if (activeTab === "chat" && id && !socket) {
      fetch(`/api/projects/${id}/chat/messages`)
        .then((res) => res.json())
        .then((data) => {
          const messages = data as ChatMessage[];
          setMessages(messages);

          if (messages.length > 0) {
            lastReadMessageIdRef.current = messages[messages.length - 1].id;
          }
        })
        .catch((err) => console.error("Failed to fetch chat history", err));

      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      const wsUrl = `${protocol}://${window.location.host}/api/projects/${id}/chat`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => console.log("Connected to chat");
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "message") {
          setMessages((prev) => [...prev, data.message]);

          if (activeTab !== "chat") {
            setUnreadCount((prev) => prev + 1);
          }
        } else if (data.type === "message_updated") {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === data.messageId ? { ...msg, content: data.content } : msg))
          );
        } else if (data.type === "read_receipt_update") {
          setMessages((prev) =>
            prev.map((msg) => {
              if (data.messageIds.includes(msg.id)) {
                const readBy = msg.readBy || [];
                const existingIndex = readBy.findIndex((r) => r.userId === data.userId);
                if (existingIndex >= 0) {
                  readBy[existingIndex] = {
                    userId: data.userId,
                    userName: data.userName,
                    readAt: data.readAt,
                  };
                } else {
                  readBy.push({
                    userId: data.userId,
                    userName: data.userName,
                    readAt: data.readAt,
                  });
                }
                return { ...msg, readBy: [...readBy] };
              }
              return msg;
            })
          );
        } else if (data.type === "typing") {
          setTypingUsers((prev) => {
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

  useEffect(() => {
    if (!socket || !currentUser || activeTab !== "chat") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleMessageIds: number[] = [];
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = parseInt(entry.target.getAttribute("data-message-id") || "0");
            if (messageId) visibleMessageIds.push(messageId);
          }
        });

        if (visibleMessageIds.length > 0) {
          socket.send(
            JSON.stringify({
              type: "mark_read",
              messageIds: visibleMessageIds,
              userId: currentUser.id,
              userName: currentUser.username,
            })
          );
        }
      },
      { threshold: 0.5 }
    );

    messageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [messages, socket, currentUser, activeTab]);

  useEffect(() => {
    if (activeTab === "chat") {
      setUnreadCount(0);

      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 100);
    }
  }, [activeTab]);

  useEffect(() => {
    if (replyingTo && activeTab === "chat") {
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 100);
    }
  }, [replyingTo, activeTab]);

  useEffect(() => {
    if (activeTab === "chat") {
      if (messages.length > 0) {
        lastReadMessageIdRef.current = messages[messages.length - 1].id;
      }
    }
  }, [activeTab, messages]);

  const fetchProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (res.ok) {
        const data = (await res.json()) as Project;
        setProject(data);
      } else if (res.status === 404) {
        setProject({
          id: parseInt(id as string),
          name: "Deleted Project",
          description: "",
          status: "archived",
          startDate: "",
          endDate: "",
          deletedAt: new Date().toISOString(),
        } as Project);
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
        const data = (await res.json()) as ProjectTask[];
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
        const data = (await res.json()) as Person[];
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
        const data = (await res.json()) as Client[];
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
        const data = (await res.json()) as ProjectFile[];
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
        const data = (await res.json()) as Note[];
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
        const data = (await res.json()) as TeamMember[];
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
      fetchClients();
    }
  }, [id, fetchProject, fetchTeamMembers, fetchClients]);

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
          clientId: editClientId === "none" ? null : editClientId ? parseInt(editClientId) : null,
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

  const handleDeleteProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletePassword) {
      setDeleteError("Password is required");
      return;
    }

    if (deleteConfirmText !== "CONFIRM") {
      setDeleteError("Please type CONFIRM to proceed");
      return;
    }

    setDeleting(true);
    setDeleteError("");

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });

      if (res.ok) {
        router.push("/dashboard/projects");
      } else {
        const data = (await res.json()) as { error: string };
        setDeleteError(data.error || "Failed to delete project");
      }
    } catch (error) {
      console.error("Failed to delete project", error);
      setDeleteError("An error occurred while deleting the project");
    } finally {
      setDeleting(false);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket || !currentUser) return;

    socket.send(
      JSON.stringify({
        type: "message",
        projectId: parseInt(id as string),
        userId: currentUser.id,
        senderName: currentUser.username,
        content: newMessage,
        replyToId: replyingTo?.id || null,
        replyToContent: replyingTo?.content || null,
        replyToSender: replyingTo?.senderName || null,
      })
    );
    setNewMessage("");
    setReplyingTo(null);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    socket.send(
      JSON.stringify({
        type: "typing",
        userId: currentUser.id,
        senderName: currentUser.username,
        isTyping: false,
      })
    );
  };

  const handleTyping = () => {
    if (!socket || !currentUser) return;

    socket.send(
      JSON.stringify({
        type: "typing",
        userId: currentUser.id,
        senderName: currentUser.username,
        isTyping: true,
      })
    );

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (!socket || !currentUser) return;
      socket.send(
        JSON.stringify({
          type: "typing",
          userId: currentUser.id,
          senderName: currentUser.username,
          isTyping: false,
        })
      );
    }, 2000);
  };

  const handleEditMessage = (messageId: number, content: string) => {
    setEditingMessageId(messageId);
    setEditContent(content);
  };

  const submitEditMessage = () => {
    if (!socket || !editContent.trim()) return;
    socket.send(
      JSON.stringify({
        type: "edit",
        messageId: editingMessageId,
        content: editContent,
      })
    );
    setEditingMessageId(null);
    setEditContent("");
  };

  const handleQuickNote = async (msgId: number, content: string) => {
    const currentClicks = noteClickState[msgId] || 0;

    if (currentClicks === 0) {
      setNoteClickState((prev) => ({ ...prev, [msgId]: 1 }));
      toast.info("Click again to save as note");

      setTimeout(() => {
        setNoteClickState((prev) => {
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
          content: content,
        }),
      });
      if (res.ok) {
        toast.success("Note added successfully");
        fetchNotes();

        setNoteClickState((prev) => {
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
    const client = clients.find((c) => c.id === project.clientId);
    return client ? `${client.name} (${client.company})` : "Unknown client";
  };

  if (!project) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (project.deletedAt) {
    return (
      <div className="space-y-6 lg:max-w-[90%] lg:mx-auto">
        <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-900">
          <CardContent className="flex flex-col items-center gap-4 pt-6 pb-8">
            <div className="text-center">
              <p className="text-red-700 dark:text-red-300 pt-5">
                The project has been deleted and is no longer accessible.
              </p>
            </div>
            <Button onClick={() => router.push("/dashboard/projects")} variant="outline">
              Back to Projects
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!project) {
    return <div className="flex items-center justify-center h-96">Project not found</div>;
  }

  return (
    <div className="space-y-6 lg:max-w-[90%] lg:mx-auto">
      {/* Header */}
      <ProjectHeader
        project={project}
        onEdit={openEditDialog}
        onDelete={() => setDeleteDialogOpen(true)}
      />

      {/* Tabs */}
      <div className="w-full">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full grid grid-cols-3 md:grid-cols-6 gap-2 h-auto p-2 bg-muted/50 bg-white rounded-lg ">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="tasks"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5"
            >
              Tasks
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5"
            >
              Team
            </TabsTrigger>
            <TabsTrigger
              value="files"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5"
            >
              Files
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5"
            >
              Notes
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5 col-span-3 md:col-span-1 relative"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1 text-xs">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            <ProjectOverview project={project} clientName={getClientName()} />
          </TabsContent>

          <TabsContent value="tasks" className="mt-6">
            <ProjectTasks
              tasks={tasks}
              people={people}
              projectId={project.id}
              onTasksChange={fetchTasks}
            />
          </TabsContent>

          <TabsContent value="team" className="mt-6">
            <ProjectTeam
              teamMembers={teamMembers}
              people={people}
              projectId={project.id}
              onTeamChange={fetchTeamMembers}
              currentUserRole={currentUser?.role}
            />
          </TabsContent>

          <TabsContent value="files" className="mt-6">
            <ProjectFiles
              files={files}
              projectId={project.id}
              onFilesChange={fetchFiles}
              currentUserRole={currentUser?.role}
            />
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <ProjectNotes notes={notes} projectId={project.id} onNotesChange={fetchNotes} />
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col h-[500px]">
                  <div className="flex-1 overflow-y-scroll overflow-x-visible space-y-3 mb-4">
                    {messages.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No messages yet</p>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          ref={(el) => {
                            if (el) messageRefs.current.set(msg.id, el);
                            else messageRefs.current.delete(msg.id);
                          }}
                          data-message-id={msg.id}
                          className="flex items-start gap-3 group"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{msg.senderName?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">
                                  {msg.senderName || "Unknown"}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(msg.createdAt).toLocaleTimeString()}
                                </span>
                                {currentUser?.id === msg.userId &&
                                  msg.readBy &&
                                  msg.readBy.length > 0 && (
                                    <div
                                      className="relative group/read"
                                      title={`Read by ${msg.readBy.map((r) => r.userName).join(", ")}`}
                                    >
                                      {msg.readBy.length === 1 ? (
                                        <Check className="h-3 w-3 text-blue-500" />
                                      ) : (
                                        <CheckCheck className="h-3 w-3 text-blue-500" />
                                      )}
                                    </div>
                                  )}
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                      <MoreVertical className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    side="bottom"
                                    sideOffset={5}
                                    className="z-50"
                                  >
                                    <DropdownMenuItem onClick={() => setReplyingTo(msg)}>
                                      <Reply className="h-4 w-4 mr-2" />
                                      Reply
                                    </DropdownMenuItem>
                                    {currentUser?.id === msg.userId && (
                                      <DropdownMenuItem
                                        onClick={() => handleEditMessage(msg.id, msg.content)}
                                      >
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        Edit
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleQuickNote(msg.id, msg.content)}
                                      onSelect={(e) => e.preventDefault()}
                                      className={noteClickState[msg.id] ? "text-green-600" : ""}
                                    >
                                      <StickyNote className="h-4 w-4 mr-2" />
                                      {noteClickState[msg.id] ? "Click to confirm" : "Save as Note"}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            {editingMessageId === msg.id ? (
                              <div className="mt-1 flex gap-2">
                                <Input
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="h-8 text-sm"
                                />
                                <Button size="sm" onClick={submitEditMessage}>
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingMessageId(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <div>
                                {msg.replyToId && (
                                  <div className="text-xs bg-muted/50 border-l-2 border-primary pl-2 py-1 mb-1 rounded">
                                    <span className="font-medium text-primary">
                                      {msg.replyToSender}
                                    </span>
                                    <p className="text-muted-foreground truncate">
                                      {msg.replyToContent}
                                    </p>
                                  </div>
                                )}
                                <p className="text-sm mt-1">{msg.content}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    {typingUsers.size > 0 && (
                      <div className="text-xs text-gray-500 italic">
                        {Array.from(typingUsers).join(", ")} {typingUsers.size === 1 ? "is" : "are"}{" "}
                        typing...
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="flex flex-col gap-2">
                    {replyingTo && (
                      <div className="flex items-center gap-2 bg-muted/50 border-l-2 border-primary pl-3 py-2 rounded">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Reply className="h-3 w-3 text-primary" />
                            <span className="text-xs font-medium text-primary">
                              Replying to {replyingTo.senderName}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {replyingTo.content}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setReplyingTo(null)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Input
                        ref={chatInputRef}
                        placeholder={
                          replyingTo ? `Reply to ${replyingTo.senderName}...` : "Type a message..."
                        }
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
      </div>

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
                      <SelectItem value="archived">Archived</SelectItem>
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
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the project &quot;
              {project.name}&quot; and all associated tasks, files, and notes.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDeleteProject}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="delete-confirm">Type CONFIRM to proceed *</Label>
                <Input
                  id="delete-confirm"
                  type="text"
                  placeholder="Type CONFIRM"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delete-password">Confirm your password *</Label>
                <Input
                  id="delete-password"
                  type="password"
                  placeholder="Enter your password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  required
                />
                {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setDeletePassword("");
                  setDeleteConfirmText("");
                  setDeleteError("");
                }}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={deleting}>
                {deleting ? "Deleting..." : "Delete Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
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
