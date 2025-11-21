import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit2, Trash2, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Project {
    id: number;
    name: string;
    status: string;
}

interface ProjectHeaderProps {
    project: Project;
    onEdit: () => void;
    onDelete: () => void;
}

export function ProjectHeader({ project, onEdit, onDelete }: ProjectHeaderProps) {
    const router = useRouter();

    return (
        <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {project.name}
                        <Badge variant={
                            project.status === "active" ? "default" :
                                project.status === "completed" ? "secondary" :
                                    project.status === "on_hold" ? "outline" : "destructive"
                        }>
                            {project.status}
                        </Badge>
                    </h1>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onEdit}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={onDelete} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Project
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
