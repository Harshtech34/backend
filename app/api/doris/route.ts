import { type NextRequest, NextResponse } from "next/server"
import { dorisDatabase } from "@/lib/data/doris-database"
import { API_CONFIG } from "@/lib/config/api-config"
import { ApiErrorHandler, ERROR_CODES } from "@/lib/utils/error-handler"
import { logger } from "@/lib/utils/logger"
import { rateLimiter } from "@/lib/utils/rate-limiter"
import { cacheManager } from "@/lib/utils/cache-manager"
import { RequestValidator } from "@/lib/utils/request-validator"
import { generateRequestId } from "@/lib/utils/request-id"
import type { ApiResponse, DorisPropertyData } from "@/lib/types/api-types"

const portalConfig = API_CONFIG.portals.doris

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
    const propertyId = searchParams.get("propertyId")
    const registrationNumber = searchParams.get("registrationNumber")
    const district = searchParams.get("district")
    const subRegistrarOffice = searchParams.get("subRegistrarOffice")

    // Get client IP for rate limiting
    const clientIp = request.headers.get("x-forwarded-for") || "unknown"

    // Check rate limit
    rateLimiter.handleRateLimit("doris", clientIp, portalConfig)

    // Log request
    logger.info(`DORIS API Request (${requestId})`, {
      method: "GET",
      params: { propertyId, registrationNumber, district, subRegistrarOffice },
      clientIp,
    })

    // Validate request parameters
    RequestValidator.validateSearchParams(
      { propertyId, registrationNumber, district, subRegistrarOffice },
      portalConfig,
    )

    // Check cache
    const cacheKey = `doris:${propertyId || ""}:${registrationNumber || ""}:${district || ""}:${subRegistrarOffice || ""}`
    const { data: cachedData, hit: cacheHit } = cacheManager.get<ApiResponse<DorisPropertyData>>(cacheKey)

    if (cacheHit) {
      logger.info(`DORIS API Cache Hit (${requestId})`, { cacheKey })
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

    // Search by propertyId
    if (propertyId && dorisDatabase[propertyId]) {
      const property = dorisDatabase[propertyId]

      // Filter by district if provided
      if (district && property.propertyDetails?.address && !property.propertyDetails.address.includes(district)) {
        throw ApiErrorHandler.createError(
          ERROR_CODES.NOT_FOUND,
          "No property found with the provided details",
          { propertyId, district },
          "DORIS",
        )
      }

      // Filter by subRegistrarOffice if provided
      if (
        subRegistrarOffice &&
        property.registrationDetails?.registrationOffice &&
        !property.registrationDetails.registrationOffice.includes(subRegistrarOffice)
      ) {
        throw ApiErrorHandler.createError(
          ERROR_CODES.NOT_FOUND,
          "No property found with the provided details",
          { propertyId, subRegistrarOffice },
          "DORIS",
        )
      }

      const processingTime = Date.now() - startTime
      const response: ApiResponse<DorisPropertyData> = {
        success: true,
        source: "DORIS",
        requestId,
        timestamp: new Date().toISOString(),
        data: property,
        metadata: {
          processingTimeMs: processingTime,
          rateLimitRemaining: rateLimiter.checkRateLimit("doris", clientIp, portalConfig).remaining,
        },
      }

      // Cache the response
      cacheManager.set(cacheKey, response, API_CONFIG.baseConfig.caching.ttl)

      logger.info(`DORIS API Response (${requestId})`, {
        success: true,
        processingTimeMs: processingTime,
      })

      return NextResponse.json(response)
    }

    // Search by registrationNumber
    if (registrationNumber) {
      const property = Object.values(dorisDatabase).find((p) => p.registrationNumber === registrationNumber)

      if (property) {
        // Filter by district if provided
        if (district && property.propertyDetails?.address && !property.propertyDetails.address.includes(district)) {
          throw ApiErrorHandler.createError(
            ERROR_CODES.NOT_FOUND,
            "No property found with the provided details",
            { registrationNumber, district },
            "DORIS",
          )
        }

        // Filter by subRegistrarOffice if provided
        if (
          subRegistrarOffice &&
          property.registrationDetails?.registrationOffice &&
          !property.registrationDetails.registrationOffice.includes(subRegistrarOffice)
        ) {
          throw ApiErrorHandler.createError(
            ERROR_CODES.NOT_FOUND,
            "No property found with the provided details",
            { registrationNumber, subRegistrarOffice },
            "DORIS",
          )
        }

        const processingTime = Date.now() - startTime
        const response: ApiResponse<DorisPropertyData> = {
          success: true,
          source: "DORIS",
          requestId,
          timestamp: new Date().toISOString(),
          data: property,
          metadata: {
            processingTimeMs: processingTime,
            rateLimitRemaining: rateLimiter.checkRateLimit("doris", clientIp, portalConfig).remaining,
          },
        }

        // Cache the response
        cacheManager.set(cacheKey, response, API_CONFIG.baseConfig.caching.ttl)

        logger.info(`DORIS API Response (${requestId})`, {
          success: true,
          processingTimeMs: processingTime,
        })

        return NextResponse.json(response)
      }
    }

    // If no property found or no valid search parameters provided
    throw ApiErrorHandler.createError(
      ERROR_CODES.NOT_FOUND,
      "No property found with the provided details",
      { propertyId, registrationNumber, district, subRegistrarOffice },
      "DORIS",
    )
  } catch (error) {
    const processingTime = Date.now() - startTime

    // Handle known API errors
    if ("code" in (error as any)) {
      const apiError = error as ReturnType<typeof ApiErrorHandler.createError>

      logger.warn(`DORIS API Error (${requestId})`, {
        error: apiError,
        processingTimeMs: processingTime,
      })

      return NextResponse.json(
        {
          success: false,
          source: "DORIS",
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
    const apiError = ApiErrorHandler.handleError(error, "DORIS")

    logger.error(`DORIS API Unexpected Error (${requestId})`, {
      error,
      processingTimeMs: processingTime,
    })

    return NextResponse.json(
      {
        success: false,
        source: "DORIS",
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

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()
  const startTime = Date.now()

  try {
    const body = await request.json()
    const { propertyId, registrationNumber, district, subRegistrarOffice } = body

    // Get client IP for rate limiting
    const clientIp = request.headers.get("x-forwarded-for") || "unknown"

    // Check rate limit
    rateLimiter.handleRateLimit("doris", clientIp, portalConfig)

    // Log request
    logger.info(`DORIS API Request (${requestId})`, {
      method: "POST",
      body: { propertyId, registrationNumber, district, subRegistrarOffice },
      clientIp,
    })

    // Validate request parameters
    RequestValidator.validateSearchParams(
      { propertyId, registrationNumber, district, subRegistrarOffice },
      portalConfig,
    )

    // Check cache
    const cacheKey = `doris:${propertyId || ""}:${registrationNumber || ""}:${district || ""}:${subRegistrarOffice || ""}`
    const { data: cachedData, hit: cacheHit } = cacheManager.get<ApiResponse<DorisPropertyData>>(cacheKey)

    if (cacheHit) {
      logger.info(`DORIS API Cache Hit (${requestId})`, { cacheKey })
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

    // Search by propertyId
    if (propertyId && dorisDatabase[propertyId]) {
      const property = dorisDatabase[propertyId]

      // Filter by district if provided
      if (district && property.propertyDetails?.address && !property.propertyDetails.address.includes(district)) {
        throw ApiErrorHandler.createError(
          ERROR_CODES.NOT_FOUND,
          "No property found with the provided details",
          { propertyId, district },
          "DORIS",
        )
      }

      // Filter by subRegistrarOffice if provided
      if (
        subRegistrarOffice &&
        property.registrationDetails?.registrationOffice &&
        !property.registrationDetails.registrationOffice.includes(subRegistrarOffice)
      ) {
        throw ApiErrorHandler.createError(
          ERROR_CODES.NOT_FOUND,
          "No property found with the provided details",
          { propertyId, subRegistrarOffice },
          "DORIS",
        )
      }

      const processingTime = Date.now() - startTime
      const response: ApiResponse<DorisPropertyData> = {
        success: true,
        source: "DORIS",
        requestId,
        timestamp: new Date().toISOString(),
        data: property,
        metadata: {
          processingTimeMs: processingTime,
          rateLimitRemaining: rateLimiter.checkRateLimit("doris", clientIp, portalConfig).remaining,
        },
      }

      // Cache the response
      cacheManager.set(cacheKey, response, API_CONFIG.baseConfig.caching.ttl)

      logger.info(`DORIS API Response (${requestId})`, {
        success: true,
        processingTimeMs: processingTime,
      })

      return NextResponse.json(response)
    }

    // Search by registrationNumber
    if (registrationNumber) {
      const property = Object.values(dorisDatabase).find((p) => p.registrationNumber === registrationNumber)

      if (property) {
        // Filter by district if provided
        if (district && property.propertyDetails?.address && !property.propertyDetails.address.includes(district)) {
          throw ApiErrorHandler.createError(
            ERROR_CODES.NOT_FOUND,
            "No property found with the provided details",
            { registrationNumber, district },
            "DORIS",
          )
        }

        // Filter by subRegistrarOffice if provided
        if (
          subRegistrarOffice &&
          property.registrationDetails?.registrationOffice &&
          !property.registrationDetails.registrationOffice.includes(subRegistrarOffice)
        ) {
          throw ApiErrorHandler.createError(
            ERROR_CODES.NOT_FOUND,
            "No property found with the provided details",
            { registrationNumber, subRegistrarOffice },
            "DORIS",
          )
        }

        const processingTime = Date.now() - startTime
        const response: ApiResponse<DorisPropertyData> = {
          success: true,
          source: "DORIS",
          requestId,
          timestamp: new Date().toISOString(),
          data: property,
          metadata: {
            processingTimeMs: processingTime,
            rateLimitRemaining: rateLimiter.checkRateLimit("doris", clientIp, portalConfig).remaining,
          },
        }

        // Cache the response
        cacheManager.set(cacheKey, response, API_CONFIG.baseConfig.caching.ttl)

        logger.info(`DORIS API Response (${requestId})`, {
          success: true,
          processingTimeMs: processingTime,
        })

        return NextResponse.json(response)
      }
    }

    // If no property found or no valid search parameters provided
    throw ApiErrorHandler.createError(
      ERROR_CODES.NOT_FOUND,
      "No property found with the provided details",
      { propertyId, registrationNumber, district, subRegistrarOffice },
      "DORIS",
    )
  } catch (error) {
    const processingTime = Date.now() - startTime

    // Handle known API errors
    if ("code" in (error as any)) {
      const apiError = error as ReturnType<typeof ApiErrorHandler.createError>

      logger.warn(`DORIS API Error (${requestId})`, {
        error: apiError,
        processingTimeMs: processingTime,
      })

      return NextResponse.json(
        {
          success: false,
          source: "DORIS",
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
    const apiError = ApiErrorHandler.handleError(error, "DORIS")

    logger.error(`DORIS API Unexpected Error (${requestId})`, {
      error,
      processingTimeMs: processingTime,
    })

    return NextResponse.json(
      {
        success: false,
        source: "DORIS",
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
