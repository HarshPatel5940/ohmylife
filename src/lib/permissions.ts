export type UserRole = "admin" | "user";

export interface UserPermissions {
    id: number;
    username: string;
    role: UserRole;
    canAccessLeads: boolean;
    canAccessFinance: boolean;
    projectId?: number;
}

export type Permission =
    | "admin"
    | "leads"
    | "finance"
    | "projects.create"
    | "users.create"
    | "clients.create"
    | "people.create";

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: UserPermissions | null, permission: Permission): boolean {
    if (!user) return false;

    // Admin has all permissions
    if (user.role === "admin") return true;

    // Check specific permissions
    switch (permission) {
        case "admin":
            return false; // Already checked above
        case "leads":
            return user.canAccessLeads;
        case "finance":
            return user.canAccessFinance;
        case "projects.create":
        case "users.create":
        case "clients.create":
        case "people.create":
            return false; // Already checked above - only admins can do this
        default:
            return false;
    }
}

/**
 * Check if user is admin
 */
export function isAdmin(user: UserPermissions | null): boolean {
    return user?.role === "admin";
}

/**
 * Serialize user permissions for headers
 */
export function serializePermissions(user: UserPermissions): string {
    return JSON.stringify({
        id: user.id,
        username: user.username,
        role: user.role,
        canAccessLeads: user.canAccessLeads,
        canAccessFinance: user.canAccessFinance,
        projectId: user.projectId,
    });
}

/**
 * Deserialize user permissions from headers
 */
export function deserializePermissions(permissionsString: string): UserPermissions | null {
    try {
        return JSON.parse(permissionsString);
    } catch {
        return null;
    }
}
