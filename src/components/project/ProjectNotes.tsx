import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Note {
    id: number;
    content: string;
    createdAt: string;
}

interface ProjectNotesProps {
    notes: Note[];
    projectId: number;
    onNotesChange: () => void;
}

export function ProjectNotes({ notes, projectId, onNotesChange }: ProjectNotesProps) {
    const [newNote, setNewNote] = useState("");

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

            <div className="space-y-3">
                {notes.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No notes yet</p>
                ) : (
                    notes.map((note) => (
                        <Card key={note.id}>
                            <CardContent className="pt-4">
                                <div className="flex justify-between items-start">
                                    <p className="flex-1 whitespace-pre-wrap">{note.content}</p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteNote(note.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    {new Date(note.createdAt).toLocaleString()}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
