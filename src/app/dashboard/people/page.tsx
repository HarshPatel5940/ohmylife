"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, User, Mail, Edit2, Trash2, Phone } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Person {
    id: number;
    name: string;
    role: string;
    email: string;
    phone?: string;
    status: string;
}

export default function PeoplePage() {
    const [people, setPeople] = useState<Person[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingPerson, setEditingPerson] = useState<Person | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [personToDelete, setPersonToDelete] = useState<Person | null>(null);

    // Form State
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [status, setStatus] = useState("active");

    useEffect(() => {
        fetchPeople();
    }, []);

    const fetchPeople = async () => {
        try {
            const res = await fetch("/api/people");
            if (res.ok) {
                const data = await res.json() as Person[];
                setPeople(data);
            }
        } finally {
            setLoading(false);
        }
    };

    const openDialog = (person?: Person) => {
        if (person) {
            setEditingPerson(person);
            setName(person.name);
            setRole(person.role || "");
            setEmail(person.email || "");
            setPhone(person.phone || "");
            setStatus(person.status || "active");
        } else {
            resetForm();
        }
        setOpen(true);
    };

    const resetForm = () => {
        setEditingPerson(null);
        setName("");
        setRole("");
        setEmail("");
        setPhone("");
        setStatus("active");
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            const payload = { name, role, email, phone, status };

            if (editingPerson) {
                // Update
                const res = await fetch(`/api/people/${editingPerson.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    setOpen(false);
                    resetForm();
                    fetchPeople();
                }
            } else {
                // Create
                const res = await fetch("/api/people", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    setOpen(false);
                    resetForm();
                    fetchPeople();
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const openDeleteDialog = (person: Person) => {
        setPersonToDelete(person);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!personToDelete) return;
        try {
            const res = await fetch(`/api/people/${personToDelete.id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchPeople();
                setDeleteDialogOpen(false);
                setPersonToDelete(null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">People</h1>
                <Button onClick={() => openDialog()}>
                    <Plus className="mr-2 h-4 w-4" /> Add Person
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {people.map((person) => (
                    <Card key={person.id}>
                        <CardContent className="p-6 flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${person.name}`} />
                                <AvatarFallback>{person.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1 flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold">{person.name}</h3>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => openDialog(person)}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                            onClick={() => openDeleteDialog(person)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={person.status === 'active' ? 'default' : 'secondary'}>{person.status}</Badge>
                                </div>
                                <p className="text-sm text-gray-500">{person.role}</p>
                                {person.email && (
                                    <div className="flex items-center text-xs text-gray-400 mt-1">
                                        <Mail className="h-3 w-3 mr-1" /> {person.email}
                                    </div>
                                )}
                                {person.phone && (
                                    <div className="flex items-center text-xs text-gray-400 mt-1">
                                        <Phone className="h-3 w-3 mr-1" /> {person.phone}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={open} onOpenChange={(val) => {
                setOpen(val);
                if (!val) resetForm();
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingPerson ? "Edit Person" : "Add New Person"}</DialogTitle>
                        <DialogDescription>
                            {editingPerson ? "Update team member details." : "Add a new team member."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSave}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="role" className="text-right">Role</Label>
                                <Input
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="col-span-3"
                                    placeholder="e.g. Developer"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phone" className="text-right">Phone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="col-span-3"
                                    placeholder="+1 234 567 8900"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">Status</Label>
                                <Select value={status} onValueChange={setStatus}>
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

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDelete}
                title="Delete Person"
                description={`Are you sure you want to delete ${personToDelete?.name}? This action cannot be undone.`}
                confirmText="Delete"
            />
        </div>
    );
}
