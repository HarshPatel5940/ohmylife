"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit2, Trash2, Save, X, Bold, Italic, List } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Note {
    id: number;
    title: string;
    content: string;
    projectId?: number;
    projectName?: string;
    createdAt: string;
}

interface Project {
    id: number;
    name: string;
}

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);


    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [projectId, setProjectId] = useState("");

    useEffect(() => {
        fetchNotes();
        fetchProjects();
    }, []);

    const fetchNotes = async () => {
        try {
            const res = await fetch("/api/notes");
            if (res.ok) {
                const data = await res.json() as Note[];
                setNotes(data);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await fetch("/api/projects");
            if (res.ok) {
                const data = await res.json() as Project[];
                setProjects(data);
            }
        } catch (error) {
            console.error("Failed to fetch projects", error);
        }
    };

    const openDialog = (note?: Note) => {
        if (note) {
            setEditingNote(note);
            setTitle(note.title);
            setContent(note.content);
            setProjectId(note.projectId?.toString() || "");
        } else {
            resetForm();
        }
        setOpen(true);
    };

    const resetForm = () => {
        setEditingNote(null);
        setTitle("");
        setContent("");
        setProjectId("");
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                title,
                content,
                projectId: projectId ? parseInt(projectId) : null,
            };

            if (editingNote) {





                const res = await fetch(`/api/notes/${editingNote.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    setOpen(false);
                    resetForm();
                    fetchNotes();
                }
            } else {
                const res = await fetch("/api/notes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    setOpen(false);
                    resetForm();
                    fetchNotes();
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (note: Note) => {
        if (!confirm("Are you sure you want to delete this note?")) return;
        try {
            const res = await fetch(`/api/notes/${note.id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchNotes();
            }
        } catch (error) {
            console.error(error);
        }
    };


    const insertFormat = (tag: string) => {
        const textarea = document.getElementById("note-content") as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);
        const selection = text.substring(start, end);

        let formatted = "";
        if (tag === "bold") formatted = `**${selection}**`;
        if (tag === "italic") formatted = `*${selection}*`;
        if (tag === "list") formatted = `\n- ${selection}`;

        const newText = before + formatted + after;
        setContent(newText);


        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + formatted.length, start + formatted.length);
        }, 0);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notes</h1>
                <Button onClick={() => openDialog()}>
                    <Plus className="mr-2 h-4 w-4" /> New Note
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                    <Card key={note.id} className="group hover:shadow-md transition-shadow cursor-pointer" onClick={() => openDialog(note)}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg truncate">{note.title}</CardTitle>
                                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 h-8 w-8" onClick={(e) => { e.stopPropagation(); handleDelete(note); }}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                            {note.projectName && (
                                <div className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded inline-block">
                                    {note.projectName}
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4 whitespace-pre-wrap">
                                {note.content}
                            </p>
                            <div className="mt-4 text-xs text-gray-400">
                                {new Date(note.createdAt).toLocaleDateString()}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {notes.length === 0 && !loading && (
                    <div className="col-span-full text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
                        No notes found. Create one to get started.
                    </div>
                )}
            </div>

            <Dialog open={open} onOpenChange={(val) => {
                setOpen(val);
                if (!val) resetForm();
            }}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingNote ? "Edit Note" : "New Note"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Note Title"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="project">Project (Optional)</Label>
                                <Select value={projectId} onValueChange={setProjectId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a project" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">None</SelectItem>
                                        {projects.map((p) => (
                                            <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="content">Content</Label>
                                <div className="border rounded-md">
                                    <div className="flex gap-1 p-2 border-b bg-gray-50 dark:bg-gray-900">
                                        <Button type="button" variant="ghost" size="sm" onClick={() => insertFormat("bold")} title="Bold">
                                            <Bold className="h-4 w-4" />
                                        </Button>
                                        <Button type="button" variant="ghost" size="sm" onClick={() => insertFormat("italic")} title="Italic">
                                            <Italic className="h-4 w-4" />
                                        </Button>
                                        <Button type="button" variant="ghost" size="sm" onClick={() => insertFormat("list")} title="List">
                                            <List className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <textarea
                                        id="note-content"
                                        className="w-full p-3 min-h-[200px] bg-transparent border-none focus:ring-0 resize-none outline-none"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Write your note here..."
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">{editingNote ? "Update Note" : "Save Note"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
