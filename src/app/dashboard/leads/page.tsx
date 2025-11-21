"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit2, Trash2, TrendingUp, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Lead {
    id: number;
    clientId?: number;
    status: "new" | "contacted" | "qualified" | "lost" | "won";
    value?: number;
    source?: string;
    createdAt: string;
}

interface Client {
    id: number;
    name: string;
    company: string;
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);

    // Form State
    const [clientId, setClientId] = useState("");
    const [status, setStatus] = useState("new");
    const [value, setValue] = useState("");
    const [source, setSource] = useState("");

    useEffect(() => {
        fetchLeads();
        fetchClients();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await fetch("/api/leads");
            if (res.ok) {
                const data = await res.json() as Lead[];
                setLeads(data);
            }
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

    const openDialog = (lead?: Lead) => {
        if (lead) {
            setEditingLead(lead);
            setClientId(lead.clientId?.toString() || "");
            setStatus(lead.status);
            setValue(lead.value?.toString() || "");
            setSource(lead.source || "");
        } else {
            resetForm();
        }
        setOpen(true);
    };

    const resetForm = () => {
        setEditingLead(null);
        setClientId("none");
        setStatus("new");
        setValue("");
        setSource("");
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const leadData = {
                clientId: clientId === "none" ? null : (clientId ? parseInt(clientId) : null),
                status,
                value: value ? parseFloat(value) : null,
                source,
            };

            if (editingLead) {
                const res = await fetch(`/api/leads/${editingLead.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(leadData),
                });
                if (res.ok) {
                    fetchLeads();
                    setOpen(false);
                    resetForm();
                }
            } else {
                // Create
                const res = await fetch("/api/leads", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(leadData),
                });
                if (res.ok) {
                    setOpen(false);
                    resetForm();
                    fetchLeads();
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (lead: Lead) => {
        if (!confirm("Are you sure you want to delete this lead?")) return;
        try {
            const res = await fetch(`/api/leads/${lead.id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchLeads();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getClientName = (clientId?: number) => {
        if (!clientId) return "No Client";
        const client = clients.find(c => c.id === clientId);
        return client ? `${client.name}${client.company ? ` (${client.company})` : ''}` : "Unknown";
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "won": return "default";
            case "lost": return "destructive";
            case "qualified": return "secondary";
            default: return "outline";
        }
    };

    const [view, setView] = useState<"list" | "board">("board");
    const [draggedLead, setDraggedLead] = useState<Lead | null>(null);

    const handleDragStart = (lead: Lead) => {
        setDraggedLead(lead);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = async (e: React.DragEvent, newStatus: Lead["status"]) => {
        e.preventDefault();
        if (!draggedLead || draggedLead.status === newStatus) return;

        // Optimistic update
        const updatedLeads = leads.map(l =>
            l.id === draggedLead.id ? { ...l, status: newStatus } : l
        );
        setLeads(updatedLeads);
        setDraggedLead(null);

        try {
            const res = await fetch(`/api/leads/${draggedLead.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) {
                // Revert if failed
                fetchLeads();
            }
        } catch (error) {
            console.error("Failed to update lead status", error);
            fetchLeads();
        }
    };

    const columns: { id: Lead["status"], label: string }[] = [
        { id: "new", label: "New" },
        { id: "contacted", label: "Contacted" },
        { id: "qualified", label: "Qualified" },
        { id: "won", label: "Won" },
        { id: "lost", label: "Lost" },
    ];

    const filteredLeads = useMemo(() => {
        return leads.filter(l => {
            const clientName = getClientName(l.clientId).toLowerCase();
            return clientName.includes(search.toLowerCase()) ||
                l.source?.toLowerCase().includes(search.toLowerCase()) ||
                l.value?.toString().includes(search);
        });
    }, [leads, search, clients]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leads</h1>
                <div className="flex gap-2">
                    <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex">
                        <Button
                            variant={view === "list" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setView("list")}
                        >
                            List
                        </Button>
                        <Button
                            variant={view === "board" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setView("board")}
                        >
                            Board
                        </Button>
                    </div>
                    <Button onClick={() => openDialog()}>
                        <Plus className="mr-2 h-4 w-4" /> Add Lead
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{leads.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{leads.filter(l => l.status === "new").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Qualified</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{leads.filter(l => l.status === "qualified").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Won</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{leads.filter(l => l.status === "won").length}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search leads..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 max-w-md"
                />
            </div>

            {view === "list" ? (
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Value</TableHead>
                                    <TableHead>Source</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredLeads.map((lead) => (
                                    <TableRow key={lead.id}>
                                        <TableCell className="font-medium">{getClientName(lead.clientId)}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(lead.status)}>
                                                {lead.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{lead.value ? `₹${lead.value.toLocaleString('en-IN')}` : "-"}</TableCell>
                                        <TableCell>{lead.source || "-"}</TableCell>
                                        <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openDialog(lead)}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(lead)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredLeads.length === 0 && !loading && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            No leads found. Click &quot;Add Lead&quot; to create one.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ) : (
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="min-w-[280px] w-full bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 flex flex-col gap-3">
                                <Skeleton className="h-6 w-24 mb-2" />
                                <Skeleton className="h-24 w-full rounded-xl" />
                                <Skeleton className="h-24 w-full rounded-xl" />
                            </div>
                        ))
                    ) : columns.map(col => (
                        <div
                            key={col.id}
                            className="min-w-[280px] w-full bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 flex flex-col gap-3"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, col.id)}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-gray-700 dark:text-gray-300">{col.label}</h3>
                                <Badge variant="secondary" className="text-xs">
                                    {filteredLeads.filter(l => l.status === col.id).length}
                                </Badge>
                            </div>

                            {filteredLeads.filter(l => l.status === col.id).map(lead => (
                                <Card
                                    key={lead.id}
                                    className="cursor-move hover:shadow-md transition-shadow"
                                    draggable
                                    onDragStart={() => handleDragStart(lead)}
                                    onClick={() => openDialog(lead)}
                                >
                                    <CardContent className="p-4 space-y-2">
                                        <div className="font-medium">{getClientName(lead.clientId)}</div>
                                        <div className="flex justify-between items-center text-sm text-gray-500">
                                            <span>{lead.value ? `₹${lead.value.toLocaleString('en-IN')}` : "No Value"}</span>
                                            <span className="text-xs">{new Date(lead.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        {lead.source && (
                                            <div className="text-xs text-gray-400 truncate">
                                                via {lead.source}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}

                            {filteredLeads.filter(l => l.status === col.id).length === 0 && (
                                <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
                                    Empty
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={open} onOpenChange={(val) => {
                setOpen(val);
                if (!val) resetForm();
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingLead ? "Edit Lead" : "Add New Lead"}</DialogTitle>
                        <DialogDescription>
                            {editingLead ? "Update lead details." : "Create a new sales lead."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSave}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="client" className="text-right">Client</Label>
                                <Select value={clientId} onValueChange={setClientId}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select a client" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">No Client</SelectItem>
                                        {clients.map((client) => (
                                            <SelectItem key={client.id} value={client.id.toString()}>
                                                {client.name} {client.company && `(${client.company})`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">Status</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="contacted">Contacted</SelectItem>
                                        <SelectItem value="qualified">Qualified</SelectItem>
                                        <SelectItem value="won">Won</SelectItem>
                                        <SelectItem value="lost">Lost</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="value" className="text-right">Value (₹)</Label>
                                <Input
                                    id="value"
                                    type="number"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    className="col-span-3"
                                    placeholder="Estimated value"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="source" className="text-right">Source</Label>
                                <Input
                                    id="source"
                                    value={source}
                                    onChange={(e) => setSource(e.target.value)}
                                    className="col-span-3"
                                    placeholder="e.g. Website, Referral"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">{editingLead ? "Update Lead" : "Save Lead"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
