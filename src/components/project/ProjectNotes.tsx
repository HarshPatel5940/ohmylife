import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Note {
    id: number;
    content: string;
    createdAt: string;
    creatorName?: string;
}

interface ProjectNotesProps {
    notes: Note[];
    projectId: number;
    onNotesChange: () => void;
}

export function ProjectNotes({ notes, projectId, onNotesChange }: ProjectNotesProps) {
    const [newNote, setNewNote] = useState("");
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState("");

    const filteredNotes = notes
        .filter(note => note.content.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        });

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        try {
            const res = await fetch(`/api/projects/${projectId}/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newNote }),
            });
            if (res.ok) {
                setNewNote("");
                onNotesChange();
            }
        } catch (error) {
            console.error("Failed to add note", error);
        }
    };

    const handleEditNote = (note: Note) => {
        setEditingNoteId(note.id);
        setEditContent(note.content);
    };

    const handleSaveEdit = async (noteId: number) => {
        if (!editContent.trim()) return;
        try {
            const res = await fetch(`/api/projects/${projectId}/notes/${noteId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: editContent }),
            });
            if (res.ok) {
                setEditingNoteId(null);
                setEditContent("");
                onNotesChange();
            }
        } catch (error) {
            console.error("Failed to update note", error);
        }
    };

    const handleCancelEdit = () => {
        setEditingNoteId(null);
        setEditContent("");
    };

    const handleDeleteNote = async (noteId: number) => {
        if (!confirm("Delete this note?")) return;
        try {
            const res = await fetch(`/api/projects/${projectId}/notes/${noteId}`, {
                method: "DELETE",
            });
            if (res.ok) onNotesChange();
        } catch (error) {
            console.error("Failed to delete note", error);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Textarea
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1"
                />
                <Button onClick={handleAddNote}>
                    <Plus className="h-4 w-4 mr-2" /> Add
                </Button>
            </div>

            <div className="flex gap-4 items-center">
                <div className="flex-1">
                    <Input
                        placeholder="Search notes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
                <Select value={sortOrder} onValueChange={(val: "newest" | "oldest") => setSortOrder(val)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-3">
                {filteredNotes.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No notes found</p>
                ) : (
                    filteredNotes.map((note) => (
                        <Card key={note.id}>
                            <CardContent className="pt-4">
                                {editingNoteId === note.id ? (
                                    // Edit mode
                                    <>
                                        <Textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="mb-3"
                                            rows={4}
                                        />
                                        <div className="flex gap-2 justify-end">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleCancelEdit}
                                            >
                                                <X className="h-4 w-4 mr-1" /> Cancel
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => handleSaveEdit(note.id)}
                                            >
                                                <Check className="h-4 w-4 mr-1" /> Save
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    // View mode
                                    <>
                                        <div className="flex justify-between items-start">
                                            <p className="flex-1 whitespace-pre-wrap">{note.content}</p>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEditNote(note)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteNote(note.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {new Date(note.createdAt).toLocaleString()}
                                            {note.creatorName && (
                                                <span className="ml-2">• by {note.creatorName}</span>
                                            )}
                                        </p>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
