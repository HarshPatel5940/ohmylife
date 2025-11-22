import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download, Trash2, FileIcon } from "lucide-react";

interface ProjectFile {
    id: number;
    name: string;
    size: number;
    url: string;
    uploadedAt: string;
}

interface ProjectFilesProps {
    files: ProjectFile[];
    projectId: number;
    onFilesChange: () => void;
}

export function ProjectFiles({ files, projectId, onFilesChange }: ProjectFilesProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                onFilesChange();
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
        } catch (error) {
            console.error("Failed to upload file", error);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteFile = async (fileId: number) => {
        if (!confirm("Delete this file?")) return;
        try {
            const res = await fetch(`/api/projects/${projectId}/files/${fileId}`, {
                method: "DELETE",
            });
            if (res.ok) onFilesChange();
        } catch (error) {
            console.error("Failed to delete file", error);
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
                <h3 className="text-lg font-medium">Project Files</h3>
                <div>
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
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading ? "Uploading..." : "Upload File"}
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                {files.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No files uploaded yet</p>
                ) : (
                    files.map((file) => (
                        <div
                            key={file.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 bg-white"
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <FileIcon className="h-5 w-5 text-gray-400" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                >
                                    <a href={file.url} download>
                                        <Download className="h-4 w-4" />
                                    </a>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteFile(file.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
