"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone, Tablet, MapPin, Clock, Shield } from "lucide-react";
import { format } from "date-fns";

interface Session {
  id: number;
  ipAddress: string;
  userAgent: string;
  lastActivityAt: Date;
  createdAt: Date;
  expiresAt: Date;
  isCurrent: boolean;
}

export default function SessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<number | null>(null);

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
      setLoading(false);
    }
  };

  const revokeSession = async (sessionId: number) => {
    setRevoking(sessionId);
    try {
      const res = await fetch("/api/auth/sessions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (res.ok) {
        fetchSessions();
      }
    } catch (error) {
      console.error("Failed to revoke session", error);
    } finally {
      setRevoking(null);
    }
  };

  const revokeAllOthers = async () => {
    if (
      !confirm(
        "Are you sure you want to revoke all other sessions? This will log you out on all other devices."
      )
    ) {
      return;
    }

    setRevoking(-1);
    try {
      const res = await fetch("/api/auth/sessions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revokeAll: true }),
      });

      if (res.ok) {
        fetchSessions();
      }
    } catch (error) {
      console.error("Failed to revoke sessions", error);
    } finally {
      setRevoking(null);
    }
  };

  const getDeviceIcon = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
      return <Smartphone className="h-5 w-5" />;
    } else if (ua.includes("tablet") || ua.includes("ipad")) {
      return <Tablet className="h-5 w-5" />;
    }
    return <Monitor className="h-5 w-5" />;
  };

  const getBrowserName = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes("chrome")) return "Chrome";
    if (ua.includes("firefox")) return "Firefox";
    if (ua.includes("safari")) return "Safari";
    if (ua.includes("edge")) return "Edge";
    return "Unknown Browser";
  };

  return (
    <div className="space-y-6 max-w-[80%] mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Active Sessions
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your active login sessions across devices
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard/profile")}>
          Back to Profile
        </Button>
      </div>

      {sessions.filter((s) => !s.isCurrent).length > 0 && (
        <div className="flex justify-end">
          <Button variant="destructive" onClick={revokeAllOthers} disabled={revoking === -1}>
            {revoking === -1 ? "Revoking..." : "Revoke All Other Sessions"}
          </Button>
        </div>
      )}

      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Loading sessions...</p>
            </CardContent>
          </Card>
        ) : sessions.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">No active sessions found</p>
            </CardContent>
          </Card>
        ) : (
          sessions.map((session) => (
            <Card key={session.id} className={session.isCurrent ? "border-primary" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(session.userAgent)}
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getBrowserName(session.userAgent)}
                        {session.isCurrent && (
                          <Badge variant="default" className="ml-2">
                            <Shield className="h-3 w-3 mr-1" />
                            Current Session
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {session.userAgent.substring(0, 60)}...
                      </CardDescription>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => revokeSession(session.id)}
                      disabled={revoking === session.id}
                    >
                      {revoking === session.id ? "Revoking..." : "Revoke"}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>IP: {session.ipAddress}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      Last active: {format(new Date(session.lastActivityAt), "MMM d, yyyy HH:mm")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Expires: {format(new Date(session.expiresAt), "MMM d, yyyy HH:mm")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
