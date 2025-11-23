"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  UserCog,
  MoreVertical,
  KeyRound,
  DollarSign,
  Users2,
  Shield,
  Monitor,
  Trash2,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface User {
  id: number;
  username: string;
  role: string;
  personId?: number;
  canAccessLeads: boolean;
  canAccessFinance: boolean;
  createdAt: string;
}

interface Session {
  id: number;
  ipAddress: string;
  userAgent: string;
  lastActivityAt: Date;
  createdAt: Date;
  expiresAt: Date;
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

  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [resetting, setResetting] = useState(false);

  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [selectedUserForPermissions, setSelectedUserForPermissions] = useState<User | null>(null);
  const [editCanAccessLeads, setEditCanAccessLeads] = useState(false);
  const [editCanAccessFinance, setEditCanAccessFinance] = useState(false);
  const [savingPermissions, setSavingPermissions] = useState(false);

  const [sessionsDialogOpen, setSessionsDialogOpen] = useState(false);
  const [selectedUserForSessions, setSelectedUserForSessions] = useState<User | null>(null);
  const [userSessions, setUserSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [revokingSession, setRevokingSession] = useState<number | null>(null);

  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      const res = await fetch("/api/people");
      if (res.ok) {
        const data = (await res.json()) as Person[];
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
        const data = (await res.json()) as User[];
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

  const openResetDialog = (user: User) => {
    setSelectedUser(user);
    setAdminPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setResetError("");
    setResetSuccess("");
    setResetDialogOpen(true);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    if (!selectedUser) return;

    if (!adminPassword || !newPassword || !confirmPassword) {
      setResetError("All fields are required");
      return;
    }

    if (newPassword.length < 4 || newPassword.length > 25) {
      setResetError("Password must be between 4 and 25 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match");
      return;
    }

    setResetting(true);

    try {
      const res = await fetch(`/api/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminPassword,
          newPassword,
        }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
      };

      if (res.ok) {
        setResetSuccess(`Password reset successfully for ${selectedUser.username}`);
        setTimeout(() => {
          setResetDialogOpen(false);
          setResetSuccess("");
        }, 2000);
      } else {
        setResetError(data.error || "Failed to reset password");
      }
    } catch (error) {
      console.error(error);
      setResetError("An error occurred while resetting password");
    } finally {
      setResetting(false);
    }
  };

  const openPermissionsDialog = (user: User) => {
    setSelectedUserForPermissions(user);
    setEditCanAccessLeads(user.canAccessLeads || false);
    setEditCanAccessFinance(user.canAccessFinance || false);
    setPermissionsDialogOpen(true);
  };

  const handleSavePermissions = async () => {
    if (!selectedUserForPermissions) return;

    setSavingPermissions(true);
    try {
      const res = await fetch(`/api/users/${selectedUserForPermissions.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          canAccessLeads: editCanAccessLeads,
          canAccessFinance: editCanAccessFinance,
        }),
      });

      if (res.ok) {
        fetchUsers();
        setPermissionsDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to update permissions", error);
    } finally {
      setSavingPermissions(false);
    }
  };

  const openSessionsDialog = async (user: User) => {
    setSelectedUserForSessions(user);
    setSessionsDialogOpen(true);
    setLoadingSessions(true);

    try {
      const res = await fetch(`/api/admin/users/${user.id}/sessions`);
      if (res.ok) {
        const data = (await res.json()) as Session[];
        setUserSessions(data);
      }
    } catch (error) {
      console.error("Failed to fetch user sessions", error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleRevokeSession = async (sessionId: number) => {
    if (!selectedUserForSessions) return;

    setRevokingSession(sessionId);
    try {
      const res = await fetch(`/api/admin/users/${selectedUserForSessions.id}/sessions`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (res.ok) {
        openSessionsDialog(selectedUserForSessions);
      }
    } catch (error) {
      console.error("Failed to revoke session", error);
    } finally {
      setRevokingSession(null);
    }
  };

  const handleRevokeAllSessions = async () => {
    if (!selectedUserForSessions) return;
    if (
      !confirm(
        `Are you sure you want to revoke all sessions for ${selectedUserForSessions.username}? This will log them out on all devices.`
      )
    ) {
      return;
    }

    setRevokingSession(-1);
    try {
      const res = await fetch(`/api/admin/users/${selectedUserForSessions.id}/sessions`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revokeAll: true }),
      });

      if (res.ok) {
        setSessionsDialogOpen(false);
        setUserSessions([]);
      }
    } catch (error) {
      console.error("Failed to revoke all sessions", error);
    } finally {
      setRevokingSession(null);
    }
  };

  const openDeleteUserDialog = (user: User) => {
    setUserToDelete(user);
    setAdminPassword("");
    setDeleteUserDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    if (!adminPassword) {
      alert("Please enter your admin password");
      return;
    }

    setDeletingUser(true);
    try {
      const res = await fetch(`/api/users/${userToDelete.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPassword }),
      });

      if (res.ok) {
        setDeleteUserDialogOpen(false);
        fetchUsers();
      } else {
        const data = (await res.json()) as { error?: string };
        alert(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Failed to delete user", error);
      alert("An error occurred while deleting user");
    } finally {
      setDeletingUser(false);
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
                  <select
                    id="role"
                    name="role"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="personId">Link to Person (Project Access)</Label>
                  <select
                    id="personId"
                    name="personId"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a person...</option>
                    {people.map((person) => (
                      <option key={person.id} value={person.id}>
                        {person.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <input
                    type="checkbox"
                    id="canAccessLeads"
                    name="canAccessLeads"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="canAccessLeads">Access Leads</Label>
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <input
                    type="checkbox"
                    id="canAccessFinance"
                    name="canAccessFinance"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="canAccessFinance">Access Finance</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
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
        <CardContent className="p-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                      {user.role === "admin" ? (
                        <Shield className="h-3 w-3 mr-1" />
                      ) : (
                        <Users2 className="h-3 w-3 mr-1" />
                      )}
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {user.canAccessLeads && (
                        <Badge variant="outline" className="text-xs">
                          <Users2 className="h-3 w-3 mr-1" />
                          Leads
                        </Badge>
                      )}
                      {user.canAccessFinance && (
                        <Badge variant="outline" className="text-xs">
                          <DollarSign className="h-3 w-3 mr-1" />
                          Finance
                        </Badge>
                      )}
                      {!user.canAccessLeads && !user.canAccessFinance && (
                        <span className="text-xs text-muted-foreground">
                          No special permissions
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openPermissionsDialog(user)}>
                          <Shield className="h-4 w-4 mr-2" />
                          Edit Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openSessionsDialog(user)}>
                          <Monitor className="h-4 w-4 mr-2" />
                          View Sessions
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openResetDialog(user)}>
                          <KeyRound className="h-4 w-4 mr-2" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteUserDialog(user)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Password Reset Dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Reset password for user: <strong>{selectedUser?.username}</strong>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPassword}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="adminPassword">Your Admin Password *</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter your admin password to confirm"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password (4-25 characters) *</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  minLength={4}
                  maxLength={25}
                  required
                />
                {newPassword && (
                  <p className="text-xs text-muted-foreground">
                    {newPassword.length}/25 characters
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>
              {resetError && (
                <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 p-3 rounded">
                  {resetError}
                </div>
              )}
              {resetSuccess && (
                <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded">
                  {resetSuccess}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setResetDialogOpen(false)}
                disabled={resetting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={resetting}>
                {resetting ? "Resetting..." : "Reset Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Permissions Edit Dialog */}
      <Dialog open={permissionsDialogOpen} onOpenChange={setPermissionsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Permissions</DialogTitle>
            <DialogDescription>
              Manage permissions for user: <strong>{selectedUserForPermissions?.username}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="canAccessLeads" className="font-medium">
                    Can Access Leads
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Allow user to view and manage leads
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                id="canAccessLeads"
                checked={editCanAccessLeads}
                onChange={(e) => setEditCanAccessLeads(e.target.checked)}
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="canAccessFinance" className="font-medium">
                    Can Access Finance
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Allow user to view and manage financial data
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                id="canAccessFinance"
                checked={editCanAccessFinance}
                onChange={(e) => setEditCanAccessFinance(e.target.checked)}
                className="h-4 w-4"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPermissionsDialogOpen(false)}
              disabled={savingPermissions}
            >
              Cancel
            </Button>
            <Button onClick={handleSavePermissions} disabled={savingPermissions}>
              {savingPermissions ? "Saving..." : "Save Permissions"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sessions View Dialog */}
      <Dialog open={sessionsDialogOpen} onOpenChange={setSessionsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Active Sessions</DialogTitle>
            <DialogDescription>
              Viewing sessions for user: <strong>{selectedUserForSessions?.username}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {loadingSessions ? (
              <p className="text-center text-muted-foreground py-8">Loading sessions...</p>
            ) : userSessions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No active sessions</p>
            ) : (
              <>
                <div className="flex justify-end mb-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRevokeAllSessions}
                    disabled={revokingSession === -1}
                  >
                    {revokingSession === -1 ? "Revoking..." : "Revoke All Sessions"}
                  </Button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {userSessions.map((session) => (
                    <Card key={session.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <Monitor className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {session.userAgent.substring(0, 80)}
                                ...
                              </p>
                              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                <span>IP: {session.ipAddress}</span>
                                <span>
                                  Last active: {new Date(session.lastActivityAt).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRevokeSession(session.id)}
                            disabled={revokingSession === session.id}
                          >
                            {revokingSession === session.id ? "Revoking..." : "Revoke"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSessionsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={deleteUserDialogOpen} onOpenChange={setDeleteUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user <strong>{userToDelete?.username}</strong>? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="deleteAdminPassword">Your Admin Password</Label>
            <Input
              id="deleteAdminPassword"
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter your password to confirm"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteUserDialogOpen(false)}
              disabled={deletingUser}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={deletingUser}>
              {deletingUser ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
