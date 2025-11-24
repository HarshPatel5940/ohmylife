export const CacheKeys = {
  projectMetadata: (projectId: number) => `project:${projectId}:metadata`,
  projectTeam: (projectId: number) => `project:${projectId}:team`,
  projectFiles: (projectId: number, filter: string) => `project:${projectId}:files:${filter}`,

  clientsList: () => `clients:list`,

  chatRecent: (projectId: number) => `project:${projectId}:chat:recent`,
} as const;

export const CacheTTL = {
  projectMetadata: 300,
  teamList: 600,
  fileList: 120,
  clientList: 1800,
  chatRecent: 60,
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
    return await fetcher();
  }

  const cached = await env.KV.get(key, "json");
  if (cached) {
    return cached as T;
  }

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
