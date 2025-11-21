"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
    revenue?: number;
}

interface Person {
    id: number;
    name: string;
    role: string;
    email: string;
    phone?: string;
    status: string;
}

export default function ProjectsPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [activeTab, setActiveTab] = useState("projects");


    const [clientDialogOpen, setClientDialogOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [clientName, setClientName] = useState("");
    const [clientCompany, setClientCompany] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientPhone, setClientPhone] = useState("");


    const [people, setPeople] = useState<Person[]>([]);
    const [personDialogOpen, setPersonDialogOpen] = useState(false);
    const [editingPerson, setEditingPerson] = useState<Person | null>(null);
    const [personName, setPersonName] = useState("");
    const [personRole, setPersonRole] = useState("");
    const [personEmail, setPersonEmail] = useState("");
    const [personPhone, setPersonPhone] = useState("");
    const [personStatus, setPersonStatus] = useState("active");


    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteType, setDeleteType] = useState<"project" | "client" | "person">("project");
    const [itemToDelete, setItemToDelete] = useState<any>(null);

    useEffect(() => {
        fetchProjects();
        fetchClients();
        fetchPeople();
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

    const fetchPeople = async () => {
        try {
            const res = await fetch("/api/people");
            if (res.ok) {
                const data = await res.json() as Person[];
                setPeople(data);
            }
        } catch (error) {
            console.error("Failed to fetch people", error);
        }
    };

    const openPersonDialog = (person?: Person) => {
        if (person) {
            setEditingPerson(person);
            setPersonName(person.name);
            setPersonRole(person.role);
            setPersonEmail(person.email);
            setPersonPhone(person.phone || "");
            setPersonStatus(person.status);
        } else {
            setEditingPerson(null);
            setPersonName("");
            setPersonRole("");
            setPersonEmail("");
            setPersonPhone("");
            setPersonStatus("active");
        }
        setPersonDialogOpen(true);
    };

    const handleSavePerson = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const personData = {
                name: personName,
                role: personRole,
                email: personEmail,
                phone: personPhone,
                status: personStatus,
            };

            if (editingPerson) {
                const res = await fetch(`/api/people/${editingPerson.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(personData),
                });
                if (res.ok) {
                    fetchPeople();
                    setPersonDialogOpen(false);
                }
            } else {
                const res = await fetch("/api/people", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(personData),
                });
                if (res.ok) {
                    fetchPeople();
                    setPersonDialogOpen(false);
                }
            }
        } catch (error) {
            console.error("Failed to save person", error);
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

    const filteredPeople = useMemo(() => {
        return people.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.role.toLowerCase().includes(search.toLowerCase()) ||
            p.email.toLowerCase().includes(search.toLowerCase())
        );
    }, [people, search]);


    const openDeleteDialog = (type: "project" | "client" | "person", item: any) => {
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
                if (res.ok) fetchProjects();
            } else if (deleteType === "client") {
                const res = await fetch(`/api/clients/${itemToDelete.id}`, {
                    method: "DELETE",
                });
                if (res.ok) {
                    fetchClients();
                    fetchProjects();
                }
            } else if (deleteType === "person") {
                const res = await fetch(`/api/people/${itemToDelete.id}`, {
                    method: "DELETE",
                });
                if (res.ok) fetchPeople();
            }
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    return (
        <div className="space-y-6">

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects Management</h1>
                    <div className="flex flex-row space-x-6 items-center">
                        <TabsList className="bg-gray-100 dark:bg-gray-800">
                            <TabsTrigger value="projects">Projects</TabsTrigger>
                            <TabsTrigger value="clients">Clients</TabsTrigger>
                            <TabsTrigger value="people">People</TabsTrigger>
                        </TabsList>

                        <div className="flex gap-2">
                            {activeTab === "clients" && (
                                <Button onClick={() => openClientDialog()}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Client
                                </Button>
                            )}
                            {activeTab === "projects" && (
                                <Button onClick={() => router.push('/dashboard/projects/new')}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Project
                                </Button>
                            )}
                            {activeTab === "people" && (
                                <Button onClick={() => openPersonDialog()}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Person
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <TabsContent value="projects" className="space-y-6">
                    {/* ... existing projects content ... */}
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
                                <Card key={project.id} className="hover:shadow-lg transition-shadow h-full relative group">
                                    <Link href={`/dashboard/projects/${project.id}`} className="absolute inset-0 z-10">
                                        <span className="sr-only">View Project</span>
                                    </Link>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <CardTitle className="group-hover:text-primary transition-colors">
                                                    {project.name}
                                                </CardTitle>
                                                <CardDescription className="mt-1">
                                                    {project.clientName || "No client"}
                                                </CardDescription>
                                            </div>
                                            <div className="relative z-20">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild onClick={(e) => e.stopPropagation()}>
                                                            <Link href={`/dashboard/projects/${project.id}`} className="flex items-center w-full">
                                                                <Edit2 className="h-4 w-4 mr-2" />
                                                                View/Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openDeleteDialog("project", project);
                                                            }}
                                                            className="text-red-600"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 h-10">
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
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={(e) => {
                                                        e.stopPropagation();
                                                        openClientDialog(client);
                                                    }}>
                                                        <Edit2 className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openDeleteDialog("client", client);
                                                        }}
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
                                            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100">
                                                ${(client.revenue || 0).toLocaleString()} Revenue
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="people" className="space-y-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search people..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredPeople.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                No people found
                            </div>
                        ) : (
                            filteredPeople.map((person) => (
                                <Card key={person.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {person.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <CardTitle>{person.name}</CardTitle>
                                                    <CardDescription>{person.role}</CardDescription>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={(e) => {
                                                        e.stopPropagation();
                                                        openPersonDialog(person);
                                                    }}>
                                                        <Edit2 className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openDeleteDialog("person", person);
                                                        }}
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
                                        <div className="flex items-center justify-between">
                                            <Badge variant={person.status === 'active' ? 'default' : 'secondary'}>
                                                {person.status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                            {person.email}
                                        </div>
                                        {person.phone && (
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                                {person.phone}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Client Dialog */}
            <Dialog open={clientDialogOpen} onOpenChange={setClientDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{editingClient ? "Client Details" : "Add New Client"}</DialogTitle>
                        <DialogDescription>
                            {editingClient ? `Manage information for ${editingClient.name}` : "Create a new client for your projects"}
                        </DialogDescription>
                    </DialogHeader>

                    {editingClient ? (
                        <Tabs defaultValue="details" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="projects">Projects</TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="space-y-4 pt-4">
                                <form onSubmit={handleSaveClient}>
                                    <div className="grid grid-cols-2 gap-4">
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
                                    <div className="flex justify-end mt-6">
                                        <Button type="submit">Update Client</Button>
                                    </div>
                                </form>
                            </TabsContent>

                            <TabsContent value="projects" className="space-y-4 pt-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium">Client Projects</h3>
                                    <Button size="sm" onClick={() => router.push(`/dashboard/projects/new?clientId=${editingClient.id}`)}>
                                        <Plus className="mr-2 h-4 w-4" /> New Project
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {projects.filter(p => p.clientId === editingClient.id).length === 0 ? (
                                        <p className="text-center text-gray-500 py-8">No projects for this client yet.</p>
                                    ) : (
                                        projects.filter(p => p.clientId === editingClient.id).map(project => (
                                            <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <div>
                                                    <Link href={`/dashboard/projects/${project.id}`} className="font-medium hover:underline">
                                                        {project.name}
                                                    </Link>
                                                    <p className="text-xs text-gray-500">{project.status}</p>
                                                </div>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/dashboard/projects/${project.id}`}>
                                                        <Edit2 className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="sales" className="space-y-4 pt-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium">Client Sales</h3>
                                    <Button size="sm" variant="outline" disabled>
                                        <Plus className="mr-2 h-4 w-4" /> New Invoice
                                    </Button>
                                </div>
                                <div className="text-center py-12 border rounded-lg border-dashed">
                                    <DollarSign className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                    <p className="text-gray-500">Sales tracking coming soon</p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    ) : (
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
                                <Button type="submit">Create Client</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Person Dialog */}
            <Dialog open={personDialogOpen} onOpenChange={setPersonDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingPerson ? "Edit Person" : "Add New Person"}</DialogTitle>
                        <DialogDescription>
                            {editingPerson ? "Update team member details." : "Add a new team member."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSavePerson}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="personName" className="text-right">Name</Label>
                                <Input
                                    id="personName"
                                    value={personName}
                                    onChange={(e) => setPersonName(e.target.value)}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="personRole" className="text-right">Role</Label>
                                <Input
                                    id="personRole"
                                    value={personRole}
                                    onChange={(e) => setPersonRole(e.target.value)}
                                    className="col-span-3"
                                    placeholder="e.g. Developer"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="personEmail" className="text-right">Email</Label>
                                <Input
                                    id="personEmail"
                                    type="email"
                                    value={personEmail}
                                    onChange={(e) => setPersonEmail(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="personPhone" className="text-right">Phone</Label>
                                <Input
                                    id="personPhone"
                                    type="tel"
                                    value={personPhone}
                                    onChange={(e) => setPersonPhone(e.target.value)}
                                    className="col-span-3"
                                    placeholder="+1 234 567 8900"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="personStatus" className="text-right">Status</Label>
                                <Select value={personStatus} onValueChange={setPersonStatus}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="hiring">Hiring</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="terminated">Terminated</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">{editingPerson ? "Update Person" : "Save Person"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
                title={`Delete ${deleteType === "project" ? "Project" : deleteType === "client" ? "Client" : "Person"}`}
                description={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
            />
        </div>
    );
}
