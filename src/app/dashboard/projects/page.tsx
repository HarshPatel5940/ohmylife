"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Calendar, Edit2, Trash2, User, Search, MoreVertical, Building2, DollarSign, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface Project {
    id: number;
    name: string;
    description: string;
    clientId?: number;
    status: string;
    startDate: string;
    endDate: string;
    clientName?: string;
}

interface Client {
    id: number;
    name: string;
    company: string;
    email: string;
    phone?: string;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [activeTab, setActiveTab] = useState("projects");

    // Client dialog state
    const [clientDialogOpen, setClientDialogOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [clientName, setClientName] = useState("");
    const [clientCompany, setClientCompany] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientPhone, setClientPhone] = useState("");

    // Delete confirmation dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteType, setDeleteType] = useState<"project" | "client">("project");
    const [itemToDelete, setItemToDelete] = useState<any>(null);

    useEffect(() => {
        fetchProjects();
        fetchClients();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch("/api/projects");
            if (res.ok) {
                const data = await res.json() as Project[];
                setProjects(data);
            }
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const res = await fetch("/api/clients");
            if (res.ok) {
                const data = await res.json() as Client[];
                setClients(data);
            }
        } catch (error) {
            console.error("Failed to fetch clients", error);
        }
    };

    const openClientDialog = (client?: Client) => {
        if (client) {
            setEditingClient(client);
            setClientName(client.name);
            setClientCompany(client.company);
            setClientEmail(client.email);
            setClientPhone(client.phone || "");
        } else {
            setEditingClient(null);
            setClientName("");
            setClientCompany("");
            setClientEmail("");
            setClientPhone("");
        }
        setClientDialogOpen(true);
    };

    const handleSaveClient = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const clientData = {
                name: clientName,
                company: clientCompany,
                email: clientEmail,
                phone: clientPhone,
            };

            if (editingClient) {
                const res = await fetch(`/api/clients/${editingClient.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(clientData),
                });
                if (res.ok) {
                    fetchClients();
                    setClientDialogOpen(false);
                }
            } else {
                const res = await fetch("/api/clients", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(clientData),
                });
                if (res.ok) {
                    fetchClients();
                    setClientDialogOpen(false);
                }
            }
        } catch (error) {
            console.error("Failed to save client", error);
        }
    };

    const openDeleteDialog = (type: "project" | "client", item: any) => {
        setDeleteType(type);
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;
        try {
            if (deleteType === "project") {
                const res = await fetch(`/api/projects/${itemToDelete.id}`, {
                    method: "DELETE",
                });
                if (res.ok) {
                    fetchProjects();
                }
            } else {
                const res = await fetch(`/api/clients/${itemToDelete.id}`, {
                    method: "DELETE",
                });
                if (res.ok) {
                    fetchClients();
                    fetchProjects(); // Refresh projects to update client names
                }
            }
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const filteredProjects = useMemo(() => {
        return projects.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.description?.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === "all" || p.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [projects, search, statusFilter]);

    const filteredClients = useMemo(() => {
        return clients.filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.company.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase())
        );
    }, [clients, search]);

    const getClientProjectCount = (clientId: number) => {
        return projects.filter(p => p.clientId === clientId).length;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects & Clients</h1>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <div className="flex items-center justify-between">
                    <TabsList className="bg-gray-100 dark:bg-gray-800">
                        <TabsTrigger value="projects">Projects</TabsTrigger>
                        <TabsTrigger value="clients">Clients</TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2">
                        {activeTab === "clients" && (
                            <Button onClick={() => openClientDialog()}>
                                <Plus className="mr-2 h-4 w-4" /> Add Client
                            </Button>
                        )}
                        {activeTab === "projects" && (
                            <Button asChild>
                                <Link href="/dashboard/projects/new">
                                    <Plus className="mr-2 h-4 w-4" /> Add Project
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <TabsContent value="projects" className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{projects.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{projects.filter(p => p.status === "active").length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{projects.filter(p => p.status === "completed").length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">On Hold</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{projects.filter(p => p.status === "on-hold").length}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search projects..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="on-hold">On Hold</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <Card key={i}>
                                    <CardHeader>
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-1/2 mt-2" />
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-20 w-full" />
                                    </CardContent>
                                </Card>
                            ))
                        ) : filteredProjects.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                No projects found
                            </div>
                        ) : (
                            filteredProjects.map((project) => (
                                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <Link href={`/dashboard/projects/${project.id}`}>
                                                    <CardTitle className="hover:text-primary cursor-pointer">
                                                        {project.name}
                                                    </CardTitle>
                                                </Link>
                                                <CardDescription className="mt-1">
                                                    {project.clientName || "No client"}
                                                </CardDescription>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/projects/${project.id}`}>
                                                            <Edit2 className="h-4 w-4 mr-2" />
                                                            View/Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => openDeleteDialog("project", project)}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                                            {project.description || "No description"}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <Badge variant={
                                                project.status === "active" ? "default" :
                                                    project.status === "completed" ? "secondary" :
                                                        "outline"
                                            }>
                                                {project.status}
                                            </Badge>
                                            {project.startDate && (
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    {new Date(project.startDate).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="clients" className="space-y-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search clients..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredClients.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                No clients found
                            </div>
                        ) : (
                            filteredClients.map((client) => (
                                <Card key={client.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <CardTitle className="flex items-center gap-2">
                                                    <Building2 className="h-5 w-5 text-primary" />
                                                    {client.name}
                                                </CardTitle>
                                                <CardDescription className="mt-1">
                                                    {client.company}
                                                </CardDescription>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openClientDialog(client)}>
                                                        <Edit2 className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => openDeleteDialog("client", client)}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                            {client.email}
                                        </div>
                                        {client.phone && (
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                                {client.phone}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 pt-2">
                                            <Badge variant="outline">
                                                {getClientProjectCount(client.id)} Projects
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Client Dialog */}
            <Dialog open={clientDialogOpen} onOpenChange={setClientDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingClient ? "Edit Client" : "Add New Client"}</DialogTitle>
                        <DialogDescription>
                            {editingClient ? "Update client information" : "Create a new client for your projects"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveClient}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    required
                                    placeholder="Client name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company">Company *</Label>
                                <Input
                                    id="company"
                                    value={clientCompany}
                                    onChange={(e) => setClientCompany(e.target.value)}
                                    required
                                    placeholder="Company name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={clientEmail}
                                    onChange={(e) => setClientEmail(e.target.value)}
                                    required
                                    placeholder="client@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={clientPhone}
                                    onChange={(e) => setClientPhone(e.target.value)}
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                        </div>
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setClientDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {editingClient ? "Update" : "Create"} Client
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
                title={`Delete ${deleteType === "project" ? "Project" : "Client"}`}
                description={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
            />
        </div>
    );
}
