"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit2, Trash2, TrendingUp, Search, Users, Phone, Trophy, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    name: string;
    contactMode?: string;
    description?: string;
    status: "new" | "contacted" | "lost" | "won";
    value?: number;
    createdAt: string;
}

import { useRouter, useSearchParams } from "next/navigation";

import { Suspense } from "react";

function LeadsContent() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    const [name, setName] = useState("");
    const [contactMode, setContactMode] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("new");
    const [value, setValue] = useState("");

    const fetchLeads = useCallback(async () => {
        try {
            const res = await fetch("/api/leads");
            if (res.ok) {
                const data = await res.json() as Lead[];
                setLeads(data);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const resetForm = useCallback(() => {
        setEditingLead(null);
        setName("");
        setContactMode("");
        setDescription("");
        setStatus("new");
        setValue("");
    }, []);

    const openDialog = useCallback((lead?: Lead) => {
        if (lead) {
            setEditingLead(lead);
            setName(lead.name);
            setContactMode(lead.contactMode || "");
            setDescription(lead.description || "");
            setStatus(lead.status);
            setValue(lead.value?.toString() || "");
        } else {
            resetForm();
        }
        setOpen(true);
    }, [resetForm]);

    useEffect(() => {
        fetchLeads();
        if (searchParams.get("new") === "true") {
            openDialog();
            // Optional: Remove the param from URL to prevent reopening on refresh
            router.replace("/dashboard/leads");
        }
    }, [searchParams, fetchLeads, openDialog, router]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("Name is required");
            return;
        }
        try {
            const leadData = {
                name,
                contactMode,
                description,
                status,
                value: value ? parseFloat(value) : null,
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



    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "won": return "default";
            case "lost": return "destructive";
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
        { id: "won", label: "Won" },
        { id: "lost", label: "Lost" },
    ];

    const filteredLeads = useMemo(() => {
        return leads.filter(l => {
            return l.name.toLowerCase().includes(search.toLowerCase()) ||
                l.contactMode?.toLowerCase().includes(search.toLowerCase()) ||
                l.description?.toLowerCase().includes(search.toLowerCase()) ||
                l.value?.toString().includes(search);
        });
    }, [leads, search]);

    return (
        <div className="space-y-6">
            <Tabs value={view} onValueChange={(v) => setView(v as "list" | "board")} className="w-full">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leads</h1>
                    <div className="flex gap-2 items-center">
                        <TabsList>
                            <TabsTrigger value="board">Board</TabsTrigger>
                            <TabsTrigger value="list">List</TabsTrigger>
                        </TabsList>
                        <Button onClick={() => openDialog()}>
                            <Plus className="mr-2 h-4 w-4" /> Add Lead
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                            <Users className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{leads.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">All time</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-orange-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New</CardTitle>
                            <Target className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{leads.filter(l => l.status === "new").length}</div>
                            <p className="text-xs text-muted-foreground mt-1">Needs follow-up</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-purple-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Contacted</CardTitle>
                            <Phone className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{leads.filter(l => l.status === "contacted").length}</div>
                            <p className="text-xs text-muted-foreground mt-1">In progress</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Won</CardTitle>
                            <Trophy className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{leads.filter(l => l.status === "won").length}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {leads.length > 0 ? `${((leads.filter(l => l.status === "won").length / leads.length) * 100).toFixed(1)}% conversion` : 'No data'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search leads..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 max-w-md"
                    />
                </div>

                <TabsContent value="list">
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Value</TableHead>
                                        <TableHead>Contact Mode</TableHead>
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
                                            <TableCell className="font-medium">{lead.name}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusBadgeVariant(lead.status)}>
                                                    {lead.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{lead.value ? `₹${lead.value.toLocaleString('en-IN')}` : "-"}</TableCell>
                                            <TableCell>{lead.contactMode || "-"}</TableCell>
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
                </TabsContent>

                <TabsContent value="board">
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
                                        className="cursor-pointer hover:shadow-md transition-shadow"
                                        onClick={() => openDialog(lead)}
                                    >
                                        <CardContent className="p-4 space-y-2">
                                            <div className="font-medium">{lead.name}</div>
                                            <div className="flex justify-between items-center text-sm text-gray-500">
                                                <span>{lead.value ? `₹${lead.value.toLocaleString('en-IN')}` : "No Value"}</span>
                                                <span className="text-xs">{new Date(lead.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            {lead.contactMode && (
                                                <div className="text-xs text-gray-400 truncate">
                                                    via {lead.contactMode}
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
                </TabsContent>
            </Tabs>

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
                                <Label htmlFor="name" className="text-right">Name *</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="col-span-3"
                                    placeholder="Lead name"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="contactMode" className="text-right">Contact Mode</Label>
                                <Input
                                    id="contactMode"
                                    value={contactMode}
                                    onChange={(e) => setContactMode(e.target.value)}
                                    className="col-span-3"
                                    placeholder="e.g. Email, Phone, LinkedIn"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">Description</Label>
                                <Input
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="col-span-3"
                                    placeholder="Brief description"
                                />
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
                        </div>
                        <DialogFooter>
                            <Button type="submit">{editingLead ? "Update Lead" : "Save Lead"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div >
    );
}

export default function LeadsPage() {
    return (
        <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
            <LeadsContent />
        </Suspense>
    );
}
