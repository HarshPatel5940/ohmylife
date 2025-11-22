"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, UserCog } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface User {
    id: number;
    username: string;
    role: string;
    personId?: number;
    canAccessLeads: boolean;
    canAccessFinance: boolean;
    createdAt: string;
}

interface Person {
    id: number;
    name: string;
}

export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [people, setPeople] = useState<Person[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
        fetchPeople();
    }, []);

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

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users");
            if (res.ok) {
                const data = await res.json() as User[];
                setUsers(data);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            username: formData.get("username"),
            password: formData.get("password"),
            role: formData.get("role"),
            personId: formData.get("personId") ? Number(formData.get("personId")) : null,
            canAccessLeads: formData.get("canAccessLeads") === "on",
            canAccessFinance: formData.get("canAccessFinance") === "on",
        };

        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                setShowForm(false);
                fetchUsers();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin</h1>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="mr-2 h-4 w-4" /> Create User
                </Button>
            </div>

            {showForm && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>New User</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input id="username" name="username" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" name="password" type="password" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <select id="role" name="role" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="personId">Link to Person (Project Access)</Label>
                                    <select id="personId" name="personId" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                        <option value="">Select a person...</option>
                                        {people.map(person => (
                                            <option key={person.id} value={person.id}>{person.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center space-x-2 pt-8">
                                    <input type="checkbox" id="canAccessLeads" name="canAccessLeads" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <Label htmlFor="canAccessLeads">Access Leads</Label>
                                </div>
                                <div className="flex items-center space-x-2 pt-8">
                                    <input type="checkbox" id="canAccessFinance" name="canAccessFinance" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <Label htmlFor="canAccessFinance">Access Finance</Label>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
                                <Button type="submit">Create User</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserCog className="h-5 w-5" /> User Management
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Username</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.username}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
