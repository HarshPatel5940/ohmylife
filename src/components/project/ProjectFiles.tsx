"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, Trash2, FileIcon, Pencil, Lock, LockOpen, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ProjectItem {
  id: number;
  name: string;
  size: number;
  url: string;
  uploadedAt: string;
  itemType: "file" | "drawing";
  type?: string;
  isPrivate?: boolean;
}

interface ProjectFilesProps {
  files: ProjectItem[];
  projectId: number;
  onFilesChange: () => void;
  currentUserRole?: string;
}

export function ProjectFiles({
  files,
  projectId,
  onFilesChange,
  currentUserRole,
}: ProjectFilesProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "files" | "drawings">("all");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ProjectItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [createDrawingOpen, setCreateDrawingOpen] = useState(false);
  const [newDrawingName, setNewDrawingName] = useState("");
  const [creating, setCreating] = useState(false);

  const isAdmin = currentUserRole === "admin";

  const filteredItems = files.filter((item) => {
    if (filter === "all") return true;
    if (filter === "files") return item.itemType === "file";
    if (filter === "drawings") return item.itemType === "drawing";
    return true;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/projects/${projectId}/files`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        toast.success("File uploaded");
        onFilesChange();
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        toast.error("Failed to upload file");
      }
    } catch (error) {
      console.error("Failed to upload file", error);
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

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
        const drawing = (await res.json()) as { id: number; name: string };
        toast.success("Drawing created");
        setCreateDrawingOpen(false);
        setNewDrawingName("");
        onFilesChange();
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

  const openDeleteDialog = (item: ProjectItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    setDeleting(true);
    try {
      const endpoint =
        itemToDelete.itemType === "drawing"
          ? `/api/projects/${projectId}/excalidraw/${itemToDelete.id}`
          : `/api/projects/${projectId}/files/${itemToDelete.id}`;

      const res = await fetch(endpoint, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success(`${itemToDelete.itemType === "drawing" ? "Drawing" : "File"} deleted`);
        setDeleteDialogOpen(false);
        setItemToDelete(null);
        onFilesChange();
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      console.error("Failed to delete:", error);
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const togglePrivacy = async (item: ProjectItem) => {
    if (!isAdmin) return;

    try {
      const endpoint =
        item.itemType === "drawing"
          ? `/api/projects/${projectId}/excalidraw/${item.id}`
          : `/api/projects/${projectId}/files/${item.id}`;

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPrivate: !item.isPrivate }),
      });

      if (res.ok) {
        toast.success(`Marked as ${!item.isPrivate ? "private" : "public"}`);
        onFilesChange();
      } else {
        toast.error("Failed to update privacy");
      }
    } catch (error) {
      console.error("Failed to update privacy:", error);
      toast.error("Failed to update privacy");
    }
  };

  const openItem = (item: ProjectItem) => {
    if (item.itemType === "drawing") {
      router.push(`/dashboard/projects/${projectId}/excalidraw/${item.id}`);
    } else {
      window.open(item.url, "_blank");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Files & Drawings</h3>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            variant="outline"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Uploading..." : "Upload File"}
          </Button>
          <Button onClick={() => setCreateDrawingOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Drawing
          </Button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All ({files.length})
        </Button>
        <Button
          variant={filter === "files" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("files")}
        >
          Files ({files.filter((f) => f.itemType === "file").length})
        </Button>
        <Button
          variant={filter === "drawings" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("drawings")}
        >
          Drawings ({files.filter((f) => f.itemType === "drawing").length})
        </Button>
      </div>

      <div className="space-y-2">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-gray-500 mb-4">No {filter === "all" ? "items" : filter} yet</p>
            {filter !== "files" && (
              <Button onClick={() => setCreateDrawingOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Drawing
              </Button>
            )}
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={`${item.itemType}-${item.id}`}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 bg-white"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {item.itemType === "drawing" ? (
                  <Pencil className="h-5 w-5 text-blue-500 flex-shrink-0" />
                ) : (
                  <FileIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{item.name}</p>
                    {item.isPrivate && <Lock className="h-4 w-4 text-gray-500 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-500">
                    {item.itemType === "drawing" ? "Excalidraw Drawing" : formatFileSize(item.size)}
                    {" • "}
                    {new Date(item.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => openItem(item)}>
                  {item.itemType === "drawing" ? (
                    <>
                      <Pencil className="h-4 w-4" />
                      <span className="ml-1 hidden sm:inline">Edit</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span className="ml-1 hidden sm:inline">Download</span>
                    </>
                  )}
                </Button>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePrivacy(item)}
                    title={item.isPrivate ? "Make public" : "Make private"}
                  >
                    {item.isPrivate ? (
                      <LockOpen className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(item)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Drawing Dialog */}
      <Dialog open={createDrawingOpen} onOpenChange={setCreateDrawingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Drawing</DialogTitle>
            <DialogDescription>Enter a name for your new Excalidraw drawing.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="drawing-name">Drawing Name</Label>
              <Input
                id="drawing-name"
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
              onClick={() => setCreateDrawingOpen(false)}
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

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete {itemToDelete?.itemType === "drawing" ? "Drawing" : "File"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{itemToDelete?.name}&quot;? This action cannot
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
            <Button variant="destructive" onClick={handleDeleteItem} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
