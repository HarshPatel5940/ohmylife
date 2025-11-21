import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Project {
    id: number;
    name: string;
    description?: string;
    clientId?: number;
    startDate?: string;
    endDate?: string;
}

interface ProjectOverviewProps {
    project: Project;
    clientName: string;
}

export function ProjectOverview({ project, clientName }: ProjectOverviewProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="font-semibold mb-1">Description</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        {project.description || "No description provided."}
                    </p>
                </div>
                <div>
                    <h3 className="font-semibold mb-1">Client</h3>
                    <p className="text-gray-600 dark:text-gray-300">{clientName}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-semibold mb-1">Start Date</h3>
                        <p>
                            {project.startDate
                                ? new Date(project.startDate).toLocaleDateString()
                                : "N/A"}
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-1">End Date</h3>
                        <p>
                            {project.endDate
                                ? new Date(project.endDate).toLocaleDateString()
                                : "N/A"}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
