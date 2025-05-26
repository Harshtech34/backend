import { type NextRequest, NextResponse } from "next/server"
import { dlrDatabase } from "@/lib/data/dlr-database"
import { API_CONFIG } from "@/lib/config/api-config"
import { ApiErrorHandler, ERROR_CODES } from "@/lib/utils/error-handler"
import { logger } from "@/lib/utils/logger"
import { rateLimiter } from "@/lib/utils/rate-limiter"
import { cacheManager } from "@/lib/utils/cache-manager"
import { RequestValidator } from "@/lib/utils/request-validator"
import { generateRequestId } from "@/lib/utils/request-id"
import { getPropertyIdInDatabase, propertyExistsInDatabase } from "@/lib/utils/cross-reference"
import type { ApiResponse, DlrPropertyData } from "@/lib/types/api-types"

const portalConfig = API_CONFIG.portals.dlr

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
    const ownerName = searchParams.get("ownerName")
    const surveyNumber = searchParams.get("surveyNumber")
    const district = searchParams.get("district")
    const village = searchParams.get("village")

    // Get client IP for rate limiting
    const clientIp = request.headers.get("x-forwarded-for") || "unknown"

    // Check rate limit
    rateLimiter.handleRateLimit("dlr", clientIp, portalConfig)

    // Log request
    logger.info(`DLR API Request (${requestId})`, {
      method: "GET",
      params: { propertyId, registrationNumber, ownerName, surveyNumber, district, village },
      clientIp,
    })

    // Check if the property exists in DLR database (directly or via cross-reference)
    let dlrPropertyId = propertyId
    if (propertyId && !dlrDatabase[propertyId]) {
      // Try to find the property ID in DLR database via cross-reference
      dlrPropertyId = getPropertyIdInDatabase(propertyId, "dlr")

      if (!dlrPropertyId || !dlrDatabase[dlrPropertyId]) {
        logger.info(`Property ${propertyId} not found in DLR database, checking cross-references`)

        // If the property doesn't exist in DLR, check if it exists in other databases
        const existsInDoris = propertyExistsInDatabase(propertyId, "doris")
        const existsInCersai = propertyExistsInDatabase(propertyId, "cersai")
        const existsInMca21 = propertyExistsInDatabase(propertyId, "mca21")

        if (existsInDoris || existsInCersai || existsInMca21) {
          // Property exists in other databases but not in DLR
          logger.info(`Property ${propertyId} exists in other databases but not in DLR`)

          return NextResponse.json(
            {
              success: false,
              source: "DLR",
              requestId,
              timestamp: new Date().toISOString(),
              data: {},
              errors: [
                {
                  code: "PROPERTY_NOT_IN_DLR",
                  message: "The property exists in other databases but not in DLR",
                  details: {
                    propertyId,
                    existsInDoris,
                    existsInCersai,
                    existsInMca21,
                  },
                  source: "DLR",
                },
              ],
              metadata: {
                processingTimeMs: Date.now() - startTime,
              },
            },
            { status: 404 },
          )
        }
      }
    }

    // Validate request parameters
    RequestValidator.validateSearchParams(
      { propertyId: dlrPropertyId, registrationNumber, ownerName, surveyNumber, district, village },
      portalConfig,
    )

    // Check cache
    const cacheKey = `dlr:${dlrPropertyId || ""}:${registrationNumber || ""}:${ownerName || ""}:${surveyNumber || ""}:${district || ""}:${village || ""}`
    const { data: cachedData, hit: cacheHit } = cacheManager.get<ApiResponse<DlrPropertyData>>(cacheKey)

    if (cacheHit) {
      logger.info(`DLR API Cache Hit (${requestId})`, { cacheKey })
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
    if (dlrPropertyId && dlrDatabase[dlrPropertyId]) {
      const property = dlrDatabase[dlrPropertyId]

      // Apply filters
      if (!matchesFilters(property, { surveyNumber, district, village })) {
        throw ApiErrorHandler.createError(
          ERROR_CODES.NOT_FOUND,
          "No property found with the provided details",
          { propertyId: dlrPropertyId, surveyNumber, district, village },
          "DLR",
        )
      }

      const processingTime = Date.now() - startTime
      const response: ApiResponse<DlrPropertyData> = {
        success: true,
        source: "DLR",
        requestId,
        timestamp: new Date().toISOString(),
        data: property,
        metadata: {
          processingTimeMs: processingTime,
          rateLimitRemaining: rateLimiter.checkRateLimit("dlr", clientIp, portalConfig).remaining,
        },
      }

      // Cache the response
      cacheManager.set(cacheKey, response, API_CONFIG.baseConfig.caching.ttl)

      logger.info(`DLR API Response (${requestId})`, {
        success: true,
        processingTimeMs: processingTime,
      })

      return NextResponse.json(response)
    }

    // Search by registrationNumber
    if (registrationNumber) {
      const property = Object.values(dlrDatabase).find((p) => p.registrationNumber === registrationNumber)

      if (property) {
        // Apply filters
        if (!matchesFilters(property, { surveyNumber, district, village })) {
          throw ApiErrorHandler.createError(
            ERROR_CODES.NOT_FOUND,
            "No property found with the provided details",
            { registrationNumber, surveyNumber, district, village },
            "DLR",
          )
        }

        const processingTime = Date.now() - startTime
        const response: ApiResponse<DlrPropertyData> = {
          success: true,
          source: "DLR",
          requestId,
          timestamp: new Date().toISOString(),
          data: property,
          metadata: {
            processingTimeMs: processingTime,
            rateLimitRemaining: rateLimiter.checkRateLimit("dlr", clientIp, portalConfig).remaining,
          },
        }

        // Cache the response
        cacheManager.set(cacheKey, response, API_CONFIG.baseConfig.caching.ttl)

        logger.info(`DLR API Response (${requestId})`, {
          success: true,
          processingTimeMs: processingTime,
        })

        return NextResponse.json(response)
      }
    }

    // Search by ownerName
    if (ownerName) {
      const properties = Object.values(dlrDatabase).filter((p) =>
        p.ownerDetails?.some((owner) => owner.name.toLowerCase().includes(ownerName.toLowerCase())),
      )

      if (properties.length > 0) {
        // Apply filters
        const filteredProperties = properties.filter((property) =>
          matchesFilters(property, { surveyNumber, district, village }),
        )

        if (filteredProperties.length === 0) {
          throw ApiErrorHandler.createError(
            ERROR_CODES.NOT_FOUND,
            "No property found with the provided details",
            { ownerName, surveyNumber, district, village },
            "DLR",
          )
        }

        const processingTime = Date.now() - startTime
        const response: ApiResponse<DlrPropertyData | DlrPropertyData[]> = {
          success: true,
          source: "DLR",
          requestId,
          timestamp: new Date().toISOString(),
          data: filteredProperties.length === 1 ? filteredProperties[0] : filteredProperties,
          metadata: {
            processingTimeMs: processingTime,
            rateLimitRemaining: rateLimiter.checkRateLimit("dlr", clientIp, portalConfig).remaining,
          },
        }

        // Cache the response
        cacheManager.set(cacheKey, response, API_CONFIG.baseConfig.caching.ttl)

        logger.info(`DLR API Response (${requestId})`, {
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
      { propertyId, registrationNumber, ownerName, surveyNumber, district, village },
      "DLR",
    )
  } catch (error) {
    const processingTime = Date.now() - startTime

    // Handle known API errors
    if ("code" in (error as any)) {
      const apiError = error as ReturnType<typeof ApiErrorHandler.createError>

      logger.warn(`DLR API Error (${requestId})`, {
        error: apiError,
        processingTimeMs: processingTime,
      })

      return NextResponse.json(
        {
          success: false,
          source: "DLR",
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
    const apiError = ApiErrorHandler.handleError(error, "DLR")

    logger.error(`DLR API Unexpected Error (${requestId})`, {
      error,
      processingTimeMs: processingTime,
    })

    return NextResponse.json(
      {
        success: false,
        source: "DLR",
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

// Helper function to check if a property matches the provided filters
function matchesFilters(
  property: DlrPropertyData,
  filters: { surveyNumber?: string | null; district?: string | null; village?: string | null },
): boolean {
  // Check surveyNumber filter
  if (filters.surveyNumber && property.landRecordDetails?.khasraNumber !== filters.surveyNumber) {
    return false
  }

  // Check district filter
  if (
    filters.district &&
    (!property.landRecordDetails?.revenueDistrict ||
      !property.landRecordDetails.revenueDistrict.toLowerCase().includes(filters.district.toLowerCase()))
  ) {
    return false
  }

  // Check village filter
  if (
    filters.village &&
    (!property.landRecordDetails?.village ||
      !property.landRecordDetails.village.toLowerCase().includes(filters.village.toLowerCase()))
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
    const { propertyId, registrationNumber, ownerName, surveyNumber, district, village } = body

    // Get client IP for rate limiting
    const clientIp = request.headers.get("x-forwarded-for") || "unknown"

    // Check rate limit
    rateLimiter.handleRateLimit("dlr", clientIp, portalConfig)

    // Log request
    logger.info(`DLR API Request (${requestId})`, {
      method: "POST",
      body: { propertyId, registrationNumber, ownerName, surveyNumber, district, village },
      clientIp,
    })

    // Check if the property exists in DLR database (directly or via cross-reference)
    let dlrPropertyId = propertyId
    if (propertyId && !dlrDatabase[propertyId]) {
      // Try to find the property ID in DLR database via cross-reference
      dlrPropertyId = getPropertyIdInDatabase(propertyId, "dlr")

      if (!dlrPropertyId || !dlrDatabase[dlrPropertyId]) {
        logger.info(`Property ${propertyId} not found in DLR database, checking cross-references`)

        // If the property doesn't exist in DLR, check if it exists in other databases
        const existsInDoris = propertyExistsInDatabase(propertyId, "doris")
        const existsInCersai = propertyExistsInDatabase(propertyId, "cersai")
        const existsInMca21 = propertyExistsInDatabase(propertyId, "mca21")

        if (existsInDoris || existsInCersai || existsInMca21) {
          // Property exists in other databases but not in DLR
          logger.info(`Property ${propertyId} exists in other databases but not in DLR`)

          return NextResponse.json(
            {
              success: false,
              source: "DLR",
              requestId,
              timestamp: new Date().toISOString(),
              data: {},
              errors: [
                {
                  code: "PROPERTY_NOT_IN_DLR",
                  message: "The property exists in other databases but not in DLR",
                  details: {
                    propertyId,
                    existsInDoris,
                    existsInCersai,
                    existsInMca21,
                  },
                  source: "DLR",
                },
              ],
              metadata: {
                processingTimeMs: Date.now() - startTime,
              },
            },
            { status: 404 },
          )
        }
      }
    }

    // Validate request parameters
    RequestValidator.validateSearchParams(
      { propertyId: dlrPropertyId, registrationNumber, ownerName, surveyNumber, district, village },
      portalConfig,
    )

    // Check cache
    const cacheKey = `dlr:${dlrPropertyId || ""}:${registrationNumber || ""}:${ownerName || ""}:${surveyNumber || ""}:${district || ""}:${village || ""}`
    const { data: cachedData, hit: cacheHit } = cacheManager.get<ApiResponse<DlrPropertyData>>(cacheKey)

    if (cacheHit) {
      logger.info(`DLR API Cache Hit (${requestId})`, { cacheKey })
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
    if (dlrPropertyId && dlrDatabase[dlrPropertyId]) {
      const property = dlrDatabase[dlrPropertyId]

      // Apply filters
      if (!matchesFilters(property, { surveyNumber, district, village })) {
        throw ApiErrorHandler.createError(
          ERROR_CODES.NOT_FOUND,
          "No property found with the provided details",
          { propertyId: dlrPropertyId, surveyNumber, district, village },
          "DLR",
        )
      }

      const processingTime = Date.now() - startTime
      const response: ApiResponse<DlrPropertyData> = {
        success: true,
        source: "DLR",
        requestId,
        timestamp: new Date().toISOString(),
        data: property,
        metadata: {
          processingTimeMs: processingTime,
          rateLimitRemaining: rateLimiter.checkRateLimit("dlr", clientIp, portalConfig).remaining,
        },
      }

      // Cache the response
      cacheManager.set(cacheKey, response, API_CONFIG.baseConfig.caching.ttl)

      logger.info(`DLR API Response (${requestId})`, {
        success: true,
        processingTimeMs: processingTime,
      })

      return NextResponse.json(response)
    }

    // Search by registrationNumber
    if (registrationNumber) {
      const property = Object.values(dlrDatabase).find((p) => p.registrationNumber === registrationNumber)

      if (property) {
        // Apply filters
        if (!matchesFilters(property, { surveyNumber, district, village })) {
          throw ApiErrorHandler.createError(
            ERROR_CODES.NOT_FOUND,
            "No property found with the provided details",
            { registrationNumber, surveyNumber, district, village },
            "DLR",
          )
        }

        const processingTime = Date.now() - startTime
        const response: ApiResponse<DlrPropertyData> = {
          success: true,
          source: "DLR",
          requestId,
          timestamp: new Date().toISOString(),
          data: property,
          metadata: {
            processingTimeMs: processingTime,
            rateLimitRemaining: rateLimiter.checkRateLimit("dlr", clientIp, portalConfig).remaining,
          },
        }

        // Cache the response
        cacheManager.set(cacheKey, response, API_CONFIG.baseConfig.caching.ttl)

        logger.info(`DLR API Response (${requestId})`, {
          success: true,
          processingTimeMs: processingTime,
        })

        return NextResponse.json(response)
      }
    }

    // Search by ownerName
    if (ownerName) {
      const properties = Object.values(dlrDatabase).filter((p) =>
        p.ownerDetails?.some((owner) => owner.name.toLowerCase().includes(ownerName.toLowerCase())),
      )

      if (properties.length > 0) {
        // Apply filters
        const filteredProperties = properties.filter((property) =>
          matchesFilters(property, { surveyNumber, district, village }),
        )

        if (filteredProperties.length === 0) {
          throw ApiErrorHandler.createError(
            ERROR_CODES.NOT_FOUND,
            "No property found with the provided details",
            { ownerName, surveyNumber, district, village },
            "DLR",
          )
        }

        const processingTime = Date.now() - startTime
        const response: ApiResponse<DlrPropertyData | DlrPropertyData[]> = {
          success: true,
          source: "DLR",
          requestId,
          timestamp: new Date().toISOString(),
          data: filteredProperties.length === 1 ? filteredProperties[0] : filteredProperties,
          metadata: {
            processingTimeMs: processingTime,
            rateLimitRemaining: rateLimiter.checkRateLimit("dlr", clientIp, portalConfig).remaining,
          },
        }

        // Cache the response
        cacheManager.set(cacheKey, response, API_CONFIG.baseConfig.caching.ttl)

        logger.info(`DLR API Response (${requestId})`, {
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
      { propertyId, registrationNumber, ownerName, surveyNumber, district, village },
      "DLR",
    )
  } catch (error) {
    const processingTime = Date.now() - startTime

    // Handle known API errors
    if ("code" in (error as any)) {
      const apiError = error as ReturnType<typeof ApiErrorHandler.createError>

      logger.warn(`DLR API Error (${requestId})`, {
        error: apiError,
        processingTimeMs: processingTime,
      })

      return NextResponse.json(
        {
          success: false,
          source: "DLR",
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
    const apiError = ApiErrorHandler.handleError(error, "DLR")

    logger.error(`DLR API Unexpected Error (${requestId})`, {
      error,
      processingTimeMs: processingTime,
    })

    return NextResponse.json(
      {
        success: false,
        source: "DLR",
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
