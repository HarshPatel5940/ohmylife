/**
 * KV Cache utilities for OhMyLife
 * Provides centralized caching and invalidation for frequently accessed data
 */

// Cache key patterns
export const CacheKeys = {
    // Project caching
    projectMetadata: (projectId: number) => `project:${projectId}:metadata`,
    projectTeam: (projectId: number) => `project:${projectId}:team`,
    projectFiles: (projectId: number, filter: string) => `project:${projectId}:files:${filter}`,

    // Client caching
    clientsList: () => `clients:list`,

    // Chat caching
    chatRecent: (projectId: number) => `project:${projectId}:chat:recent`,
} as const;

// Cache TTLs (in seconds)
export const CacheTTL = {
    projectMetadata: 300,    // 5 minutes
    teamList: 600,           // 10 minutes
    fileList: 120,           // 2 minutes
    clientList: 1800,        // 30 minutes
    chatRecent: 60,          // 1 minute
} as const;

/**
 * Get cached data or fetch and cache it
 */
export async function getOrCache<T>(
    env: any,
    key: string,
    fetcher: () => Promise<T>,
    ttl: number
): Promise<T> {
    if (!env.KV) {
        // KV not available, just fetch
        return await fetcher();
    }

    // Try cache first
    const cached = await env.KV.get(key, "json");
    if (cached) {
        return cached as T;
    }

    // Cache miss - fetch and store
    const data = await fetcher();
    await env.KV.put(key, JSON.stringify(data), { expirationTtl: ttl });

    return data;
}

/**
 * Invalidate project-related caches
 */
export async function invalidateProjectCache(env: any, projectId: number) {
    if (!env.KV) return;

    const keys = [
        CacheKeys.projectMetadata(projectId),
        CacheKeys.projectTeam(projectId),
        CacheKeys.projectFiles(projectId, "all"),
        CacheKeys.projectFiles(projectId, "files"),
        CacheKeys.projectFiles(projectId, "drawings"),
        CacheKeys.chatRecent(projectId),
    ];

    await Promise.all(keys.map((key) => env.KV.delete(key)));
}

/**
 * Invalidate team member cache
 */
export async function invalidateTeamCache(env: any, projectId: number) {
    if (!env.KV) return;

    await env.KV.delete(CacheKeys.projectTeam(projectId));
}

/**
 * Invalidate file/drawing cache
 */
export async function invalidateFileCache(env: any, projectId: number) {
    if (!env.KV) return;

    const keys = [
        CacheKeys.projectFiles(projectId, "all"),
        CacheKeys.projectFiles(projectId, "files"),
        CacheKeys.projectFiles(projectId, "drawings"),
    ];

    await Promise.all(keys.map((key) => env.KV.delete(key)));
}

/**
 * Invalidate client list cache
 */
export async function invalidateClientCache(env: any) {
    if (!env.KV) return;

    await env.KV.delete(CacheKeys.clientsList());
}

/**
 * Invalidate chat cache
 */
export async function invalidateChatCache(env: any, projectId: number) {
    if (!env.KV) return;

    await env.KV.delete(CacheKeys.chatRecent(projectId));
}
