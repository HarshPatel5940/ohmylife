"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { UserPermissions } from "@/lib/permissions";

interface PermissionContextValue {
    permissions: UserPermissions | null;
    isLoading: boolean;
    isAdmin: boolean;
    canAccessLeads: boolean;
    canAccessFinance: boolean;
    refetch: () => Promise<void>;
}

const PermissionContext = createContext<PermissionContextValue | undefined>(undefined);

export function PermissionProvider({ children }: { children: React.ReactNode }) {
    const [permissions, setPermissions] = useState<UserPermissions | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPermissions = async () => {
        try {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const data: UserPermissions = await res.json();
                setPermissions(data);
            } else {
                setPermissions(null);
            }
        } catch (error) {
            console.error("Failed to fetch permissions:", error);
            setPermissions(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    const value: PermissionContextValue = {
        permissions,
        isLoading,
        isAdmin: permissions?.role === "admin",
        canAccessLeads: permissions?.canAccessLeads || false,
        canAccessFinance: permissions?.canAccessFinance || false,
        refetch: fetchPermissions,
    };

    return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

export function usePermissions() {
    const context = useContext(PermissionContext);
    if (context === undefined) {
        throw new Error("usePermissions must be used within a PermissionProvider");
    }
    return context;
}
