interface CacheEntry<T> {
  data: T
  expiresAt: number
}

export class CacheManager {
  private static instance: CacheManager
  private cache: Map<string, CacheEntry<any>> = new Map()

  private constructor() {
    // Clean up expired cache entries every 5 minutes
    setInterval(() => this.cleanupExpiredEntries(), 300000)
  }

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt <= now) {
        this.cache.delete(key)
      }
    }
  }

  public set<T>(key: string, data: T, ttlSeconds: number): void {
    const expiresAt = Date.now() + ttlSeconds * 1000
    this.cache.set(key, { data, expiresAt })
  }

  public get<T>(key: string): { data: T; hit: boolean } {
    const entry = this.cache.get(key)

    if (!entry) {
      return { data: null as T, hit: false }
    }

    // Check if entry has expired
    if (entry.expiresAt <= Date.now()) {
      this.cache.delete(key)
      return { data: null as T, hit: false }
    }

    return { data: entry.data as T, hit: true }
  }

  public delete(key: string): boolean {
    return this.cache.delete(key)
  }

  public clear(): void {
    this.cache.clear()
  }

  public getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }
}

export const cacheManager = CacheManager.getInstance()
