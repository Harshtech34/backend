import { type NextRequest, NextResponse } from "next/server"
import { cersaiDatabase } from "@/lib/data/cersai-database"
import { API_CONFIG } from "@/lib/config/api-config"
import { ApiErrorHandler, ERROR_CODES } from "@/lib/utils/error-handler"
import { logger } from "@/lib/utils/logger"
import { rateLimiter } from "@/lib/utils/rate-limiter"
import { cacheManager } from "@/lib/utils/cache-manager"
import { RequestValidator } from "@/lib/utils/request-validator"
import { generateRequestId } from "@/lib/utils/request-id"
import type { ApiResponse, CersaiPropertyData } from "@/lib/types/api-types"

const portalConfig = API_CONFIG.portals.cersai

// Helper function to simulate processing delay
async function simulateProcessingDelay(): Promise<void> {
  const { min, max } = portalConfig.responseTime
  const delay = Math.floor(Math.random() * (max - min + 1)) + min
  await new Promise((resolve) => setTimeout(resolve, delay))
  return
}

export async function GET(request: NextRequest) {
  const requestId = generateRequestId()
  const startTime = Date.now()

  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const assetId = searchParams.get("assetId")
    const propertyId = searchParams.get("propertyId")
    const borrowerName = searchParams.get("borrowerName")
    const lenderName = searchParams.get("lenderName")
    const securityType = searchParams.get("securityType")

    // Get client IP for rate limiting
    const clientIp = request.headers.get("x-forwarded-for") || "unknown"

    // Check rate limit
    rateLimiter.handleRateLimit("cersai", clientIp, portalConfig)

    // Log request
    logger.info(`CERSAI API Request (${requestId})`, {
      method: "GET",
      params: { assetId, propertyId, borrowerName, lenderName, securityType },
      clientIp,
    })

    // Validate request parameters
    RequestValidator.validateSearchParams(
      { assetId, propertyId, borrowerName: borrowerName, lenderName, securityType },
      portalConfig,
    )

    // Check cache
    const cacheKey = `cersai:${assetId || ""}:${propertyId || ""}:${borrowerName || ""}:${lenderName || ""}:${securityType || ""}`
    const { data: cachedData, hit: cacheHit } = cacheManager.get<ApiResponse<CersaiPropertyData>>(cacheKey)

    if (cacheHit) {
      logger.info(`CERSAI API Cache Hit (${requestId})`, { cacheKey })
      return NextResponse.json({
        ...cachedData,
        metadata: {
          ...cachedData.metadata,
          cacheHit: true,
        },
      })
    }

    // Simulate processing delay
    await simulateProcessingDelay()

    // Search by assetId
    if (assetId && cersaiDatabase[assetId]) {
      const asset = cersaiDatabase[assetId]

      // Apply filters
      if (!matchesFilters(asset, { lenderName, securityType })) {
        throw ApiErrorHandler.createError(
          ERROR_CODES.NOT_FOUND,
          "No security interest found with the provided details",
          { assetId, lenderName, securityType },
          "CERSAI",
        )
      }

      const processingTime = Date.now() - startTime
      const response: ApiResponse<CersaiPropertyData> = {
        success: true,
        source: "CERSAI",
        requestId,
        timestamp: new Date().toISOString(),
        data: asset,
        metadata: {
          processingTimeMs: processingTime,
          rateLimitRemaining: rateLimiter.checkRateLimit("cersai", clientIp, portalConfig).remaining,
        },
      }

      // Cache the response
      cacheManager.set(cacheKey, response, API_CONFIG.baseConfig.caching.ttl)

      logger.info(`CERSAI API Response (${requestId})`, {
        success: true,
        processingTimeMs: processingTime,
      })

      return NextResponse.json(response)
    }

    // Search by propertyId
    if (propertyId) {
      const assets = Object.values(cersaiDatabase).filter((a) => a.propertyId === propertyId)

      if (assets.length > 0) {
        // Apply filters
        const filteredAssets = assets.filter((asset) => matchesFilters(asset, { lenderName, securityType }))

        if (filteredAssets.length === 0) {
          throw ApiErrorHandler.createError(
            ERROR_CODES.NOT_FOUND,
            "No security interest found with the provided details",
            { propertyId, lenderName, securityType },
            "CERSAI",
          )
        }

        const processingTime = Date.now() - startTime
        const response: ApiResponse<CersaiPropertyData | CersaiPropertyData[]> = {
          success: true,
          source: "CERSAI",
          requestId,
          timestamp: new Date().toISOString(),
          data: filteredAssets.length === 1 ? filteredAssets[0] : filteredAssets,
          metadata: {
            processingTimeMs: processingTime,
            rateLimitRemaining: rateLimiter.checkRateLimit("cersai", clientIp, portalConfig).remaining,
          },
        }

        // Cache the response
        cacheManager.set(cacheKey, response, API_CONFIG.baseConfig.caching.ttl)

        logger.info(`CERSAI API Response (${requestId})`, {
          success: true,
          processingTimeMs: processingTime,
        })

        return NextResponse.json(response)
      }
    }

    // Search by borrowerName
    if (borrowerName) {
      const assets = Object.values(cersaiDatabase).filter((a) =>
        a.borrowerDetails?.some((borrower) => borrower.name.toLowerCase().includes(borrowerName.toLowerCase())),
      )

      if (assets.length > 0) {
        // Apply filters
        const filteredAssets = assets.filter((asset) => matchesFilters(asset, { lenderName, securityType }))

        if (filteredAssets.length === 0) {
          throw ApiErrorHandler.createError(
            ERROR_CODES.NOT_FOUND,
            "No security interest found with the provided details",
            { borrowerName, lenderName, securityType },
            "CERSAI",
          )
        }

        const processingTime = Date.now() - startTime
        const response: ApiResponse<CersaiPropertyData | CersaiPropertyData[]> = {
          success: true,
          source: "CERSAI",
          requestId,
          timestamp: new Date().toISOString(),
          data: filteredAssets.length === 1 ? filteredAssets[0] : filteredAssets,
          metadata: {
            processingTimeMs: processingTime,
            rateLimitRemaining: rateLimiter.checkRateLimit("cersai", clientIp, portalConfig).remaining,
          },
        }

        // Cache the response
        cacheManager.set(cacheKey, response, API_CONFIG.baseConfig.caching.ttl)

        logger.info(`CERSAI API Response (${requestId})`, {
          success: true,
          processingTimeMs: processingTime,
        })

        return NextResponse.json(response)
      }
    }

    // If no asset found or no valid search parameters provided
    throw ApiErrorHandler.createError(
      ERROR_CODES.NOT_FOUND,
      "No security interest found with the provided details",
      { assetId, propertyId, borrowerName, lenderName, securityType },
      "CERSAI",
    )
  } catch (error) {
    const processingTime = Date.now() - startTime

    // Handle known API errors
    if ("code" in (error as any)) {
      const apiError = error as ReturnType<typeof ApiErrorHandler.createError>

      logger.warn(`CERSAI API Error (${requestId})`, {
        error: apiError,
        processingTimeMs: processingTime,
      })

      return NextResponse.json(
        {
          success: false,
          source: "CERSAI",
          requestId,
          timestamp: new Date().toISOString(),
          data: {},
          errors: [apiError],
          metadata: {
            processingTimeMs: processingTime,
          },
        },
        { status: apiError.code === ERROR_CODES.NOT_FOUND ? 404 : 400 },
      )
    }

    // Handle unexpected errors
    const apiError = ApiErrorHandler.handleError(error, "CERSAI")

    logger.error(`CERSAI API Unexpected Error (${requestId})`, {
      error,
      processingTimeMs: processingTime,
    })

    return NextResponse.json(
      {
        success: false,
        source: "CERSAI",
        requestId,
        timestamp: new Date().toISOString(),
        data: {},
        errors: [apiError],
        metadata: {
          processingTimeMs: processingTime,
        },
      },
      { status: 500 },
    )
  }
}

// Helper function to check if an asset matches the provided filters
function matchesFilters(
  asset: CersaiPropertyData,
  filters: { lenderName?: string | null; securityType?: string | null },
): boolean {
  // Check lenderName filter
  if (
    filters.lenderName &&
    (!asset.lenderDetails?.name || !asset.lenderDetails.name.toLowerCase().includes(filters.lenderName.toLowerCase()))
  ) {
    return false
  }

  // Check securityType filter
  if (
    filters.securityType &&
    (!asset.securityInterests ||
      !asset.securityInterests.some((interest) =>
        interest.type.toLowerCase().includes(filters.securityType!.toLowerCase()),
      ))
  ) {
    return false
  }

  return true
}

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()
  const startTime = Date.now()

  try {
    const body = await request.json()
    const { assetId, propertyId, borrowerName, lenderName, securityType } = body

    // Get client IP for rate limiting
    const clientIp = request.headers.get("x-forwarded-for") || "unknown"

    // Check rate limit
    rateLimiter.handleRateLimit("cersai", clientIp, portalConfig)

    // Log request
    logger.info(`CERSAI API Request (${requestId})`, {
      method: "POST",
      body: { assetId, propertyId, borrowerName, lenderName, securityType },
      clientIp,
    })

    // Validate request parameters
    RequestValidator.validateSearchParams({ assetId, propertyId, borrowerName, lenderName, securityType }, portalConfig)

    // Check cache
    const cacheKey = `cersai:${assetId || ""}:${propertyId || ""}:${borrowerName || ""}:${lenderName || ""}:${securityType || ""}`
    const { data: cachedData, hit: cacheHit } = cacheManager.get<ApiResponse<CersaiPropertyData>>(cacheKey)

    if (cacheHit) {
      logger.info(`CERSAI API Cache Hit (${requestId})`, { cacheKey })
      return NextResponse.json({
        ...cachedData,
        metadata: {
          ...cachedData.metadata,
          cacheHit: true,
        },
      })
    }

    // Simulate processing delay
    await simulateProcessingDelay()

    // Search by assetId
    if (assetId && cersaiDatabase[assetId]) {
      const asset = cersaiDatabase[assetId]

      // Apply filters
      if (!matchesFilters(asset, { lenderName, securityType })) {
        throw ApiErrorHandler.createError(
          ERROR_CODES.NOT_FOUND,
          "No security interest found with the provided details",
          { assetId, lenderName, securityType },
          "CERSAI",
        )
      }

      const processingTime = Date.now() - startTime
      const response: ApiResponse<CersaiPropertyData> = {
        success: true,
        source: "CERSAI",
        requestId,
        timestamp: new Date().toISOString(),
        data: asset,
        metadata: {
          processingTimeMs: processingTime,
          rateLimitRemaining: rateLimiter.checkRateLimit("cersai", clientIp, portalConfig).remaining,
        },
      }

      // Cache the response
      cacheManager.set(cacheKey, response, API_CONFIG.baseConfig.caching.ttl)

      logger.info(`CERSAI API Response (${requestId})`, {
        success: true,
        processingTimeMs: processingTime,
      })

      return NextResponse.json(response)
    }

    // Search by propertyId
    if (propertyId) {
      const assets = Object.values(cersaiDatabase).filter((a) => a.propertyId === propertyId)

      if (assets.length > 0) {
        // Apply filters
        const filteredAssets = assets.filter((asset) => matchesFilters(asset, { lenderName, securityType }))

        if (filteredAssets.length === 0) {
          throw ApiErrorHandler.createError(
            ERROR_CODES.NOT_FOUND,
            "No security interest found with the provided details",
            { propertyId, lenderName, securityType },
            "CERSAI",
          )
        }

        const processingTime = Date.now() - startTime
        const response: ApiResponse<CersaiPropertyData | CersaiPropertyData[]> = {
          success: true,
          source: "CERSAI",
          requestId,
          timestamp: new Date().toISOString(),
          data: filteredAssets.length === 1 ? filteredAssets[0] : filteredAssets,
          metadata: {
            processingTimeMs: processingTime,
            rateLimitRemaining: rateLimiter.checkRateLimit("cersai", clientIp, portalConfig).remaining,
          },
        }

        // Cache the response
        cacheManager.set(cacheKey, response, API_CONFIG.baseConfig.caching.ttl)

        logger.info(`CERSAI API Response (${requestId})`, {
          success: true,
          processingTimeMs: processingTime,
        })

        return NextResponse.json(response)
      }
    }

    // Search by borrowerName
    if (borrowerName) {
      const assets = Object.values(cersaiDatabase).filter((a) =>
        a.borrowerDetails?.some((borrower) => borrower.name.toLowerCase().includes(borrowerName.toLowerCase())),
      )

      if (assets.length > 0) {
        // Apply filters
        const filteredAssets = assets.filter((asset) => matchesFilters(asset, { lenderName, securityType }))

        if (filteredAssets.length === 0) {
          throw ApiErrorHandler.createError(
            ERROR_CODES.NOT_FOUND,
            "No security interest found with the provided details",
            { borrowerName, lenderName, securityType },
            "CERSAI",
          )
        }

        const processingTime = Date.now() - startTime
        const response: ApiResponse<CersaiPropertyData | CersaiPropertyData[]> = {
          success: true,
          source: "CERSAI",
          requestId,
          timestamp: new Date().toISOString(),
          data: filteredAssets.length === 1 ? filteredAssets[0] : filteredAssets,
          metadata: {
            processingTimeMs: processingTime,
            rateLimitRemaining: rateLimiter.checkRateLimit("cersai", clientIp, portalConfig).remaining,
          },
        }

        // Cache the response
        cacheManager.set(cacheKey, response, API_CONFIG.baseConfig.caching.ttl)

        logger.info(`CERSAI API Response (${requestId})`, {
          success: true,
          processingTimeMs: processingTime,
        })

        return NextResponse.json(response)
      }
    }

    // If no asset found or no valid search parameters provided
    throw ApiErrorHandler.createError(
      ERROR_CODES.NOT_FOUND,
      "No security interest found with the provided details",
      { assetId, propertyId, borrowerName, lenderName, securityType },
      "CERSAI",
    )
  } catch (error) {
    const processingTime = Date.now() - startTime

    // Handle known API errors
    if ("code" in (error as any)) {
      const apiError = error as ReturnType<typeof ApiErrorHandler.createError>

      logger.warn(`CERSAI API Error (${requestId})`, {
        error: apiError,
        processingTimeMs: processingTime,
      })

      return NextResponse.json(
        {
          success: false,
          source: "CERSAI",
          requestId,
          timestamp: new Date().toISOString(),
          data: {},
          errors: [apiError],
          metadata: {
            processingTimeMs: processingTime,
          },
        },
        { status: apiError.code === ERROR_CODES.NOT_FOUND ? 404 : 400 },
      )
    }

    // Handle unexpected errors
    const apiError = ApiErrorHandler.handleError(error, "CERSAI")

    logger.error(`CERSAI API Unexpected Error (${requestId})`, {
      error,
      processingTimeMs: processingTime,
    })

    return NextResponse.json(
      {
        success: false,
        source: "CERSAI",
        requestId,
        timestamp: new Date().toISOString(),
        data: {},
        errors: [apiError],
        metadata: {
          processingTimeMs: processingTime,
        },
      },
      { status: 500 },
    )
  }
}
