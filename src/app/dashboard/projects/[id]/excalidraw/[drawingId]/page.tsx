"use client";

import { useParams } from "next/navigation";
import { ExcalidrawEditor } from "@/components/project/ExcalidrawEditor";
import { useEffect, useState } from "react";

interface Drawing {
  id: number;
  name: string;
}

export default function ExcalidrawEditorPage() {
  const params = useParams();
  const projectId = parseInt(params.id as string);
  const drawingId = parseInt(params.drawingId as string);
  const [drawing, setDrawing] = useState<Drawing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrawing = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/excalidraw/${drawingId}`);
        if (res.ok) {
          const data = (await res.json()) as { id: number; name: string };
          setDrawing({ id: data.id, name: data.name });
        }
      } catch (error) {
        console.error("Failed to fetch drawing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrawing();
  }, [projectId, drawingId]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!drawing) {
    return <div className="flex items-center justify-center h-screen">Drawing not found</div>;
  }

  return (
    <ExcalidrawEditor projectId={projectId} drawingId={drawingId} drawingName={drawing.name} />
  );
}
