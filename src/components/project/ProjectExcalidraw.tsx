"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ExcalidrawDrawing {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}

interface ProjectExcalidrawProps {
    drawings: ExcalidrawDrawing[];
    projectId: number;
    onDrawingsChange: () => void;
}

export function ProjectExcalidraw({
    drawings,
    projectId,
    onDrawingsChange,
}: ProjectExcalidrawProps) {
    const router = useRouter();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [drawingToDelete, setDrawingToDelete] = useState<number | null>(null);
    const [newDrawingName, setNewDrawingName] = useState("");
    const [creating, setCreating] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleCreateDrawing = async () => {
        if (!newDrawingName.trim()) {
            toast.error("Please enter a drawing name");
            return;
        }

        setCreating(true);
        try {
            const res = await fetch(`/api/projects/${projectId}/excalidraw`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newDrawingName }),
            });

            if (res.ok) {
                const drawing = await res.json() as ExcalidrawDrawing;
                toast.success("Drawing created");
                setCreateDialogOpen(false);
                setNewDrawingName("");
                onDrawingsChange();
                // Navigate to editor
                router.push(`/dashboard/projects/${projectId}/excalidraw/${drawing.id}`);
            } else {
                toast.error("Failed to create drawing");
            }
        } catch (error) {
            console.error("Failed to create drawing:", error);
            toast.error("Failed to create drawing");
        } finally {
            setCreating(false);
        }
    };

    const openDeleteDialog = (drawingId: number) => {
        setDrawingToDelete(drawingId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteDrawing = async () => {
        if (!drawingToDelete) return;

        setDeleting(true);
        try {
            const res = await fetch(
                `/api/projects/${projectId}/excalidraw/${drawingToDelete}`,
                {
                    method: "DELETE",
                }
            );

            if (res.ok) {
                toast.success("Drawing deleted");
                setDeleteDialogOpen(false);
                setDrawingToDelete(null);
                onDrawingsChange();
            } else {
                toast.error("Failed to delete drawing");
            }
        } catch (error) {
            console.error("Failed to delete drawing:", error);
            toast.error("Failed to delete drawing");
        } finally {
            setDeleting(false);
        }
    };

    const openDrawing = (drawingId: number) => {
        router.push(`/dashboard/projects/${projectId}/excalidraw/${drawingId}`);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Excalidraw Drawings</h3>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Drawing
                </Button>
            </div>

            <div className="space-y-2">
                {drawings.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <p className="text-gray-500 mb-4">No drawings yet</p>
                        <Button onClick={() => setCreateDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create your first drawing
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {drawings.map((drawing) => (
                            <div
                                key={drawing.id}
                                className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white transition-colors"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-medium truncate flex-1">
                                        {drawing.name}
                                    </h4>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openDrawing(drawing.id)}
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="text-xs text-gray-500 mb-3">
                                    <p>
                                        Created: {new Date(drawing.createdAt).toLocaleDateString()}
                                    </p>
                                    <p>
                                        Updated: {new Date(drawing.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => openDrawing(drawing.id)}
                                    >
                                        <Pencil className="h-3 w-3 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openDeleteDialog(drawing.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Drawing Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Drawing</DialogTitle>
                        <DialogDescription>
                            Enter a name for your new Excalidraw drawing.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Drawing Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Architecture Diagram"
                                value={newDrawingName}
                                onChange={(e) => setNewDrawingName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleCreateDrawing();
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setCreateDialogOpen(false)}
                            disabled={creating}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleCreateDrawing} disabled={creating}>
                            {creating ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Drawing Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Drawing</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this drawing? This action cannot
                            be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteDrawing}
                            disabled={deleting}
                        >
                            {deleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
