"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import "@excalidraw/excalidraw/index.css";

const Excalidraw = dynamic(async () => (await import("@excalidraw/excalidraw")).Excalidraw, {
  ssr: false,
});

interface ExcalidrawEditorProps {
  projectId: number;
  drawingId: number;
  drawingName: string;
}

export function ExcalidrawEditor({ projectId, drawingId, drawingName }: ExcalidrawEditorProps) {
  const router = useRouter();
  const [drawingData, setDrawingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const excalidrawAPIRef = useRef<any>(null);

  useEffect(() => {
    const loadDrawing = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/excalidraw/${drawingId}`);
        if (res.ok) {
          const response = (await res.json()) as { data: any };
          const data = response.data;

          const drawingData = {
            elements: data?.elements || [],
            appState: {
              ...(data?.appState || {}),
              collaborators: data?.appState?.collaborators || [],
            },
            files: data?.files || {},
          };

          setDrawingData(drawingData);
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

  const saveDrawing = useCallback(
    async (data: any) => {
      try {
        setSaving(true);
        const res = await fetch(`/api/projects/${projectId}/excalidraw/${drawingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
        });

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

  const handleChange = useCallback(
    (elements: any, appState: any, files: any) => {
      const { collaborators, ...cleanAppState } = appState || {};

      const data = {
        type: "excalidraw",
        version: 2,
        source: "ohmylife",
        elements,
        appState: cleanAppState,
        files,
      };

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        saveDrawing(data);
      }, 10000);
    },
    [saveDrawing]
  );

  const handleManualSave = async () => {
    if (!excalidrawAPIRef.current) return;

    const elements = excalidrawAPIRef.current.getSceneElements();
    const appState = excalidrawAPIRef.current.getAppState();
    const files = excalidrawAPIRef.current.getFiles();

    const { collaborators, ...cleanAppState } = appState || {};

    const data = {
      type: "excalidraw",
      version: 2,
      source: "ohmylife",
      elements,
      appState: cleanAppState,
      files,
    };

    await saveDrawing(data);
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
      <div className="border-b bg-white dark:bg-gray-900 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
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
          <Button variant="outline" size="sm" onClick={handleManualSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

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
