"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2 } from "lucide-react";

interface Project {
    id: number;
    name: string;
    description: string;
    status: string;
    startDate: string;
    endDate: string;
}

export default function ProjectDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchProject();
    }, [id]);

    const fetchProject = async () => {
        try {
            const res = await fetch(`/api/projects/${id}`);
            if (res.ok) {
                const data = await res.json() as Project;
                setProject(data);
            } else {
                // Handle 404
            }
        } catch (error) {
            console.error("Failed to fetch project", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        try {
            const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
            if (res.ok) {
                router.push("/dashboard/projects");
            }
        } catch (error) {
            console.error("Failed to delete project", error);
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (!project) return <div className="p-6">Project not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {project.name}
                            <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>{project.status}</Badge>
                        </h1>
                    </div>
                </div>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="files">Files</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-1">Description</h3>
                                <p className="text-gray-600 dark:text-gray-300">{project.description || "No description provided."}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold mb-1">Start Date</h3>
                                    <p>{project.startDate ? new Date(project.startDate).toLocaleDateString() : "N/A"}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">End Date</h3>
                                    <p>{project.endDate ? new Date(project.endDate).toLocaleDateString() : "N/A"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="tasks" className="mt-6">
                    <div className="text-center py-10 text-gray-500 bg-white dark:bg-gray-800 rounded-lg border border-dashed">
                        Project Tasks will appear here.
                    </div>
                </TabsContent>

                <TabsContent value="notes" className="mt-6">
                    <div className="text-center py-10 text-gray-500 bg-white dark:bg-gray-800 rounded-lg border border-dashed">
                        Project Notes will appear here.
                    </div>
                </TabsContent>

                <TabsContent value="chat" className="mt-6">
                    <div className="text-center py-10 text-gray-500 bg-white dark:bg-gray-800 rounded-lg border border-dashed">
                        Project Chat (Coming Soon)
                    </div>
                </TabsContent>

                <TabsContent value="files" className="mt-6">
                    <div className="text-center py-10 text-gray-500 bg-white dark:bg-gray-800 rounded-lg border border-dashed">
                        Project Files (Coming Soon)
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
