import type { PortalConfig } from "../config/api-config"
import { ApiErrorHandler, ERROR_CODES } from "./error-handler"
import { logger } from "./logger"

interface RateLimitRecord {
  count: number
  resetAt: number
  lastRequest: number
}

export class RateLimiter {
  private static instance: RateLimiter
  private limits: Map<string, RateLimitRecord> = new Map()

  private constructor() {
    // Clean up expired rate limits every minute
    setInterval(() => this.cleanupExpiredLimits(), 60000)
  }

  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter()
    }
    return RateLimiter.instance
  }

  private cleanupExpiredLimits(): void {
    const now = Date.now()
    for (const [key, record] of this.limits.entries()) {
      if (record.resetAt <= now) {
        this.limits.delete(key)
      }
    }
  }

  public checkRateLimit(
    portalKey: string,
    clientId: string,
    portalConfig: PortalConfig,
  ): { allowed: boolean; remaining: number; resetAt: number } {
    const key = `${portalKey}:${clientId}`
    const now = Date.now()

    // Get or initialize rate limit record
    let record = this.limits.get(key)
    if (!record) {
      record = {
        count: 0,
        resetAt: now + 60000, // Reset after 1 minute
        lastRequest: now,
      }
      this.limits.set(key, record)
    }

    // Check if reset time has passed
    if (record.resetAt <= now) {
      record = {
        count: 0,
        resetAt: now + 60000,
        lastRequest: now,
      }
      this.limits.set(key, record)
    }

    // Check burst limit (requests in quick succession)
    const timeSinceLastRequest = now - record.lastRequest
    const isBurst = timeSinceLastRequest < 1000 // Less than 1 second

    // Check if rate limit is exceeded
    const allowed =
      record.count < portalConfig.rateLimits.requestsPerMinute &&
      (!isBurst || record.count < portalConfig.rateLimits.burstLimit)

    // Update record if allowed
    if (allowed) {
      record.count += 1
      record.lastRequest = now
      this.limits.set(key, record)
    } else {
      logger.warn(`Rate limit exceeded for ${key}`, {
        count: record.count,
        resetAt: new Date(record.resetAt).toISOString(),
        timeSinceLastRequest,
      })
    }

    return {
      allowed,
      remaining: portalConfig.rateLimits.requestsPerMinute - record.count,
      resetAt: record.resetAt,
    }
  }

  public handleRateLimit(portalKey: string, clientId: string, portalConfig: PortalConfig): void {
    const result = this.checkRateLimit(portalKey, clientId, portalConfig)

    if (!result.allowed) {
      throw ApiErrorHandler.createError(
        ERROR_CODES.RATE_LIMIT_EXCEEDED,
        `Rate limit exceeded for ${portalKey}. Try again after ${new Date(result.resetAt).toISOString()}`,
        {
          resetAt: result.resetAt,
          remaining: result.remaining,
        },
        portalKey.toUpperCase(),
      )
    }
  }
}

export const rateLimiter = RateLimiter.getInstance()
