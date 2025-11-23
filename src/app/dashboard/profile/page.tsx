"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Monitor, Smartphone, Laptop, Tablet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Session {
  id: number;
  ipAddress: string;
  userAgent: string;
  lastActivityAt: Date;
  createdAt: Date;
  expiresAt: Date;
}

export default function ProfilePage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [changing, setChanging] = useState(false);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [revokeSessionId, setRevokeSessionId] = useState<number | null>(null);
  const [revokeAllMode, setRevokeAllMode] = useState(false);
  const [revokePassword, setRevokePassword] = useState("");
  const [revokeError, setRevokeError] = useState("");
  const [revoking, setRevoking] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/auth/sessions");
      if (res.ok) {
        const data = (await res.json()) as Session[];
        setSessions(data);
      }
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword.length < 4 || newPassword.length > 25) {
      setError("Password must be between 4 and 25 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    setChanging(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
      };

      if (res.ok) {
        setSuccess("Password changed successfully! Redirecting to login...");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(data.error || "Failed to change password");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while changing password");
    } finally {
      setChanging(false);
    }
  };

  const openRevokeDialog = (sessionId: number | null, revokeAll: boolean) => {
    setRevokeSessionId(sessionId);
    setRevokeAllMode(revokeAll);
    setRevokeDialogOpen(true);
    setRevokePassword("");
    setRevokeError("");
  };

  const handleRevokeSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revokePassword) {
      setRevokeError("Password is required");
      return;
    }

    setRevoking(true);
    setRevokeError("");

    try {
      const res = await fetch("/api/auth/sessions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: revokeSessionId,
          revokeAll: revokeAllMode,
          password: revokePassword,
        }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
      };

      if (res.ok) {
        setRevokeDialogOpen(false);
        fetchSessions();
      } else {
        setRevokeError(data.error || "Failed to revoke session");
      }
    } catch (error) {
      console.error(error);
      setRevokeError("An error occurred while revoking session");
    } finally {
      setRevoking(false);
    }
  };

  const getDeviceIcon = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
      return <Smartphone className="h-5 w-5 text-muted-foreground" />;
    } else if (ua.includes("tablet") || ua.includes("ipad")) {
      return <Tablet className="h-5 w-5 text-muted-foreground" />;
    } else {
      return <Laptop className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6 max-w-[80%] mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password. You will be logged out after changing your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password *</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                required
                disabled={changing}
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
                disabled={changing}
              />
              {newPassword && (
                <p className="text-xs text-muted-foreground">{newPassword.length}/25 characters</p>
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
                disabled={changing}
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 p-3 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded">
                {success}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard")}
                disabled={changing}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={changing}>
                {changing ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Active Sessions
          </CardTitle>
          <CardDescription>
            View and manage your active login sessions across devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingSessions ? (
            <p className="text-center text-muted-foreground py-8">Loading sessions...</p>
          ) : sessions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No active sessions</p>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => openRevokeDialog(null, true)}
                >
                  Revoke All Other Sessions
                </Button>
              </div>
              <div className="space-y-3">
                {sessions.map((session) => (
                  <Card key={session.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {getDeviceIcon(session.userAgent)}
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {session.userAgent.substring(0, 80)}...
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
                          onClick={() => openRevokeDialog(session.id, false)}
                        >
                          Revoke
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Revoke Session Dialog */}
      <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Session</DialogTitle>
            <DialogDescription>
              {revokeAllMode
                ? "This will log you out from all other devices. Your current session will remain active."
                : "This will log you out from this specific device."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRevokeSession}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="revoke-password">Confirm your password *</Label>
                <Input
                  id="revoke-password"
                  type="password"
                  placeholder="Enter your password"
                  value={revokePassword}
                  onChange={(e) => setRevokePassword(e.target.value)}
                  required
                />
                {revokeError && <p className="text-sm text-red-600">{revokeError}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setRevokeDialogOpen(false);
                  setRevokePassword("");
                  setRevokeError("");
                }}
                disabled={revoking}
              >
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={revoking}>
                {revoking ? "Revoking..." : "Revoke Session"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
