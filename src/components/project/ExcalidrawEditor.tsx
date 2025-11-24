"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import "@excalidraw/excalidraw/index.css";

const Excalidraw = dynamic(
    async () => (await import("@excalidraw/excalidraw")).Excalidraw,
    { ssr: false }
);

const exportToBlob = dynamic(
    async () => (await import("@excalidraw/excalidraw")).exportToBlob,
    { ssr: false }
);

interface ExcalidrawEditorProps {
    projectId: number;
    drawingId: number;
    drawingName: string;
}

export function ExcalidrawEditor({
    projectId,
    drawingId,
    drawingName,
}: ExcalidrawEditorProps) {
    const router = useRouter();
    const [drawingData, setDrawingData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [exporting, setExporting] = useState(false);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const excalidrawAPIRef = useRef<any>(null);

    // Load drawing data
    useEffect(() => {
        const loadDrawing = async () => {
            try {
                const res = await fetch(
                    `/api/projects/${projectId}/excalidraw/${drawingId}`
                );
                if (res.ok) {
                    const data = await res.json() as { data: any };
                    setDrawingData(data.data);
                } else {
                    toast.error("Failed to load drawing");
                }
            } catch (error) {
                console.error("Failed to load drawing:", error);
                toast.error("Failed to load drawing");
            } finally {
                setLoading(false);
            }
        };

        loadDrawing();
    }, [projectId, drawingId]);

    // Save drawing to API
    const saveDrawing = useCallback(
        async (data: any) => {
            try {
                setSaving(true);
                const res = await fetch(
                    `/api/projects/${projectId}/excalidraw/${drawingId}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ data }),
                    }
                );

                if (res.ok) {
                    toast.success("Drawing saved");
                } else {
                    toast.error("Failed to save drawing");
                }
            } catch (error) {
                console.error("Failed to save drawing:", error);
                toast.error("Failed to save drawing");
            } finally {
                setSaving(false);
            }
        },
        [projectId, drawingId]
    );

    // Debounced auto-save on change
    const handleChange = useCallback(
        (elements: any, appState: any, files: any) => {
            const data = {
                type: "excalidraw",
                version: 2,
                source: "ohmylife",
                elements,
                appState,
                files,
            };

            // Clear existing timeout
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }

            // Set new timeout for auto-save (3 seconds)
            saveTimeoutRef.current = setTimeout(() => {
                saveDrawing(data);
            }, 3000);
        },
        [saveDrawing]
    );

    // Manual save
    const handleManualSave = async () => {
        if (!excalidrawAPIRef.current) return;

        const elements = excalidrawAPIRef.current.getSceneElements();
        const appState = excalidrawAPIRef.current.getAppState();
        const files = excalidrawAPIRef.current.getFiles();

        const data = {
            type: "excalidraw",
            version: 2,
            source: "ohmylife",
            elements,
            appState,
            files,
        };

        await saveDrawing(data);
    };

    // Export to PNG
    const handleExportPNG = async () => {
        if (!excalidrawAPIRef.current || !exportToBlob) return;

        try {
            setExporting(true);
            const elements = excalidrawAPIRef.current.getSceneElements();
            const appState = excalidrawAPIRef.current.getAppState();
            const files = excalidrawAPIRef.current.getFiles();

            const blob = await (exportToBlob as any)({
                elements,
                appState,
                files,
                mimeType: "image/png",
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${drawingName}.png`;
            a.click();
            URL.revokeObjectURL(url);

            toast.success("Exported to PNG");
        } catch (error) {
            console.error("Failed to export:", error);
            toast.error("Failed to export");
        } finally {
            setExporting(false);
        }
    };

    // Export to SVG
    const handleExportSVG = async () => {
        if (!excalidrawAPIRef.current || !exportToBlob) return;

        try {
            setExporting(true);
            const elements = excalidrawAPIRef.current.getSceneElements();
            const appState = excalidrawAPIRef.current.getAppState();
            const files = excalidrawAPIRef.current.getFiles();

            const blob = await (exportToBlob as any)({
                elements,
                appState,
                files,
                mimeType: "image/svg+xml",
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${drawingName}.svg`;
            a.click();
            URL.revokeObjectURL(url);

            toast.success("Exported to SVG");
        } catch (error) {
            console.error("Failed to export:", error);
            toast.error("Failed to export");
        } finally {
            setExporting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            {/* Toolbar */}
            <div className="border-b bg-white dark:bg-gray-900 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <span className="text-sm font-medium">{drawingName}</span>
                </div>

                <div className="flex items-center gap-2">
                    {saving && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Saving...
                        </span>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleManualSave}
                        disabled={saving}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportPNG}
                        disabled={exporting}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        PNG
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportSVG}
                        disabled={exporting}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        SVG
                    </Button>
                </div>
            </div>

            {/* Excalidraw Canvas */}
            <div className="flex-1">
                <Excalidraw
                    initialData={drawingData}
                    onChange={handleChange}
                    excalidrawAPI={(api) => (excalidrawAPIRef.current = api)}
                />
            </div>
        </div>
    );
}
