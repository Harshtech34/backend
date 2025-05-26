import { type NextRequest, NextResponse } from "next/server"
import { API_CONFIG } from "@/lib/config/api-config"
import { ApiErrorHandler, ERROR_CODES } from "@/lib/utils/error-handler"
import { logger } from "@/lib/utils/logger"
import { cacheManager } from "@/lib/utils/cache-manager"
import { generateRequestId } from "@/lib/utils/request-id"
import { getAllDatabaseIds, mergePropertyData } from "@/lib/utils/cross-reference"
import type { UnifiedPropertyResponse, PropertySearchParams } from "@/lib/types/api-types"

export async function GET(request: NextRequest) {
  const requestId = generateRequestId()
  const startTime = Date.now()

  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const propertyId = searchParams.get("propertyId")
    const registrationNumber = searchParams.get("registrationNumber")
    const ownerName = searchParams.get("ownerName")
    const sources = searchParams.get("sources")?.split(",") || ["doris", "dlr", "cersai", "mca21"]

    // Log request
    logger.info(`Unified Property API Request (${requestId})`, {
      method: "GET",
      params: { propertyId, registrationNumber, ownerName, sources },
    })

    if (!propertyId && !registrationNumber && !ownerName) {
      throw ApiErrorHandler.createError(
        ERROR_CODES.MISSING_PARAMETERS,
        "At least one search parameter must be provided",
        { providedParams: {} },
        "UNIFIED_API",
      )
    }

    // Check cache
    const cacheKey = `unified:${propertyId || ""}:${registrationNumber || ""}:${ownerName || ""}:${sources.join(",")}`
    const { data: cachedData, hit: cacheHit } = cacheManager.get<UnifiedPropertyResponse>(cacheKey)

    if (cacheHit) {
      logger.info(`Unified Property API Cache Hit (${requestId})`, { cacheKey })
      return NextResponse.json({
        ...cachedData,
        metadata: {
          ...cachedData.metadata,
          cacheHit: true,
        },
      })
    }

    // If propertyId is provided, try to get cross-referenced IDs
    let crossReferencedIds: Record<string, string> = {}
    if (propertyId) {
      crossReferencedIds = getAllDatabaseIds(propertyId)
      logger.info(`Cross-referenced IDs for ${propertyId}`, { crossReferencedIds })
    }

    // Prepare API calls
    const apiCalls = []
    const selectedSources = sources.map((s) => s.toLowerCase())

    if (selectedSources.includes("doris")) {
      const params = new URLSearchParams()
      if (propertyId) {
        // Use the DORIS-specific ID if available
        params.append("propertyId", crossReferencedIds.doris || propertyId)
      }
      if (registrationNumber) params.append("registrationNumber", registrationNumber)
      apiCalls.push(fetch(`${request.nextUrl.origin}/api/doris?${params.toString()}`))
    }

    if (selectedSources.includes("dlr")) {
      const params = new URLSearchParams()
      if (propertyId) {
        // Use the DLR-specific ID if available
        params.append("propertyId", crossReferencedIds.dlr || propertyId)
      }
      if (registrationNumber) params.append("registrationNumber", registrationNumber)
      if (ownerName) params.append("ownerName", ownerName)
      apiCalls.push(fetch(`${request.nextUrl.origin}/api/dlr?${params.toString()}`))
    }

    if (selectedSources.includes("cersai")) {
      const params = new URLSearchParams()
      if (propertyId) {
        // If we have a CERSAI-specific ID, use it as assetId
        if (crossReferencedIds.cersai) {
          params.append("assetId", crossReferencedIds.cersai)
        } else {
          // Otherwise use propertyId
          params.append("propertyId", crossReferencedIds.doris || crossReferencedIds.dlr || propertyId)
        }
      }
      if (ownerName) params.append("borrowerName", ownerName)
      apiCalls.push(fetch(`${request.nextUrl.origin}/api/cersai?${params.toString()}`))
    }

    if (selectedSources.includes("mca21")) {
      const params = new URLSearchParams()
      if (propertyId) {
        // If we have an MCA21-specific ID, use it as cinNumber
        if (crossReferencedIds.mca21) {
          params.append("cinNumber", crossReferencedIds.mca21)
        } else {
          // Otherwise use propertyId
          params.append("propertyId", crossReferencedIds.doris || crossReferencedIds.dlr || propertyId)
        }
      }
      if (ownerName) params.append("companyName", ownerName)
      apiCalls.push(fetch(`${request.nextUrl.origin}/api/mca21?${params.toString()}`))
    }

    // Execute all API calls in parallel
    const responses = await Promise.all(apiCalls)
    const results = await Promise.all(responses.map((res) => res.json()))

    // Try to use the merged data approach if propertyId is provided
    let mergedData = null
    if (propertyId) {
      mergedData = mergePropertyData(
        propertyId,
        selectedSources.includes("doris"),
        selectedSources.includes("dlr"),
        selectedSources.includes("cersai"),
        selectedSources.includes("mca21"),
      )
    }

    // Combine results
    const successfulResults = results.filter((result) => result.success)
    const failedResults = results.filter((result) => !result.success)

    const combinedResults: UnifiedPropertyResponse = {
      success: successfulResults.length > 0 || mergedData !== null,
      requestId,
      timestamp: new Date().toISOString(),
      sources: results.map((result) => result.source).filter(Boolean),
      data: mergedData
        ? [
            {
              source: "MERGED",
              data: mergedData,
            },
          ]
        : successfulResults.map((result) => ({
            source: result.source,
            data: result.data,
          })),
      errors: failedResults.flatMap((result) =>
        result.errors
          ? result.errors.map((error: any) => ({
              source: result.source,
              ...error,
            }))
          : [],
      ),
      metadata: {
        totalSources: sources.length,
        successfulSources: successfulResults.length,
        failedSources: failedResults.length,
        processingTimeMs: Date.now() - startTime,
      },
    }

    // Cache the response
    cacheManager.set(cacheKey, combinedResults, API_CONFIG.unifiedApi.caching.ttl)

    logger.info(`Unified Property API Response (${requestId})`, {
      success: combinedResults.success,
      processingTimeMs: combinedResults.metadata.processingTimeMs,
    })

    if (combinedResults.data.length === 0 && !mergedData) {
      return NextResponse.json(combinedResults, { status: 404 })
    }

    return NextResponse.json(combinedResults)
  } catch (error) {
    const processingTime = Date.now() - startTime

    // Handle known API errors
    if ("code" in (error as any)) {
      const apiError = error as ReturnType<typeof ApiErrorHandler.createError>

      logger.warn(`Unified Property API Error (${requestId})`, {
        error: apiError,
        processingTimeMs: processingTime,
      })

      return NextResponse.json(
        {
          success: false,
          requestId,
          timestamp: new Date().toISOString(),
          sources: [],
          data: [],
          errors: [apiError],
          metadata: {
            totalSources: 0,
            successfulSources: 0,
            failedSources: 0,
            processingTimeMs: processingTime,
          },
        },
        { status: apiError.code === ERROR_CODES.NOT_FOUND ? 404 : 400 },
      )
    }

    // Handle unexpected errors
    const apiError = ApiErrorHandler.handleError(error, "UNIFIED_API")

    logger.error(`Unified Property API Unexpected Error (${requestId})`, {
      error,
      processingTimeMs: processingTime,
    })

    return NextResponse.json(
      {
        success: false,
        requestId,
        timestamp: new Date().toISOString(),
        sources: [],
        data: [],
        errors: [apiError],
        metadata: {
          totalSources: 0,
          successfulSources: 0,
          failedSources: 0,
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
    const body = (await request.json()) as PropertySearchParams
    const { propertyId, registrationNumber, ownerName, sources = ["doris", "dlr", "cersai", "mca21"] } = body

    // Log request
    logger.info(`Unified Property API Request (${requestId})`, {
      method: "POST",
      body: { propertyId, registrationNumber, ownerName, sources },
    })

    if (!propertyId && !registrationNumber && !ownerName) {
      throw ApiErrorHandler.createError(
        ERROR_CODES.MISSING_PARAMETERS,
        "At least one search parameter must be provided",
        { providedParams: Object.keys(body) },
        "UNIFIED_API",
      )
    }

    // Check cache
    const selectedSources = Array.isArray(sources) ? sources : [sources]
    const cacheKey = `unified:${propertyId || ""}:${registrationNumber || ""}:${ownerName || ""}:${selectedSources.join(",")}`
    const { data: cachedData, hit: cacheHit } = cacheManager.get<UnifiedPropertyResponse>(cacheKey)

    if (cacheHit) {
      logger.info(`Unified Property API Cache Hit (${requestId})`, { cacheKey })
      return NextResponse.json({
        ...cachedData,
        metadata: {
          ...cachedData.metadata,
          cacheHit: true,
        },
      })
    }

    // If propertyId is provided, try to get cross-referenced IDs
    let crossReferencedIds: Record<string, string> = {}
    if (propertyId) {
      crossReferencedIds = getAllDatabaseIds(propertyId)
      logger.info(`Cross-referenced IDs for ${propertyId}`, { crossReferencedIds })
    }

    // Prepare API calls
    const apiCalls = []

    if (selectedSources.includes("doris")) {
      const dorisBody = {
        ...(propertyId && { propertyId: crossReferencedIds.doris || propertyId }),
        ...(registrationNumber && { registrationNumber }),
      }
      apiCalls.push(
        fetch(`${request.nextUrl.origin}/api/doris`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dorisBody),
        }),
      )
    }

    if (selectedSources.includes("dlr")) {
      const dlrBody = {
        ...(propertyId && { propertyId: crossReferencedIds.dlr || propertyId }),
        ...(registrationNumber && { registrationNumber }),
        ...(ownerName && { ownerName }),
      }
      apiCalls.push(
        fetch(`${request.nextUrl.origin}/api/dlr`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dlrBody),
        }),
      )
    }

    if (selectedSources.includes("cersai")) {
      const cersaiBody = {
        ...(crossReferencedIds.cersai && { assetId: crossReferencedIds.cersai }),
        ...(propertyId &&
          !crossReferencedIds.cersai && {
            propertyId: crossReferencedIds.doris || crossReferencedIds.dlr || propertyId,
          }),
        ...(ownerName && { borrowerName: ownerName }),
      }
      apiCalls.push(
        fetch(`${request.nextUrl.origin}/api/cersai`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cersaiBody),
        }),
      )
    }

    if (selectedSources.includes("mca21")) {
      const mca21Body = {
        ...(crossReferencedIds.mca21 && { cinNumber: crossReferencedIds.mca21 }),
        ...(propertyId &&
          !crossReferencedIds.mca21 && {
            propertyId: crossReferencedIds.doris || crossReferencedIds.dlr || propertyId,
          }),
        ...(ownerName && { companyName: ownerName }),
      }
      apiCalls.push(
        fetch(`${request.nextUrl.origin}/api/mca21`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mca21Body),
        }),
      )
    }

    // Execute all API calls in parallel
    const responses = await Promise.all(apiCalls)
    const results = await Promise.all(responses.map((res) => res.json()))

    // Try to use the merged data approach if propertyId is provided
    let mergedData = null
    if (propertyId) {
      mergedData = mergePropertyData(
        propertyId,
        selectedSources.includes("doris"),
        selectedSources.includes("dlr"),
        selectedSources.includes("cersai"),
        selectedSources.includes("mca21"),
      )
    }

    // Combine results
    const successfulResults = results.filter((result) => result.success)
    const failedResults = results.filter((result) => !result.success)

    const combinedResults: UnifiedPropertyResponse = {
      success: successfulResults.length > 0 || mergedData !== null,
      requestId,
      timestamp: new Date().toISOString(),
      sources: results.map((result) => result.source).filter(Boolean),
      data: mergedData
        ? [
            {
              source: "MERGED",
              data: mergedData,
            },
          ]
        : successfulResults.map((result) => ({
            source: result.source,
            data: result.data,
          })),
      errors: failedResults.flatMap((result) =>
        result.errors
          ? result.errors.map((error: any) => ({
              source: result.source,
              ...error,
            }))
          : [],
      ),
      metadata: {
        totalSources: selectedSources.length,
        successfulSources: successfulResults.length,
        failedSources: failedResults.length,
        processingTimeMs: Date.now() - startTime,
      },
    }

    // Cache the response
    cacheManager.set(cacheKey, combinedResults, API_CONFIG.unifiedApi.caching.ttl)

    logger.info(`Unified Property API Response (${requestId})`, {
      success: combinedResults.success,
      processingTimeMs: combinedResults.metadata.processingTimeMs,
    })

    if (combinedResults.data.length === 0 && !mergedData) {
      return NextResponse.json(combinedResults, { status: 404 })
    }

    return NextResponse.json(combinedResults)
  } catch (error) {
    const processingTime = Date.now() - startTime

    // Handle known API errors
    if ("code" in (error as any)) {
      const apiError = error as ReturnType<typeof ApiErrorHandler.createError>

      logger.warn(`Unified Property API Error (${requestId})`, {
        error: apiError,
        processingTimeMs: processingTime,
      })

      return NextResponse.json(
        {
          success: false,
          requestId,
          timestamp: new Date().toISOString(),
          sources: [],
          data: [],
          errors: [apiError],
          metadata: {
            totalSources: 0,
            successfulSources: 0,
            failedSources: 0,
            processingTimeMs: processingTime,
          },
        },
        { status: apiError.code === ERROR_CODES.NOT_FOUND ? 404 : 400 },
      )
    }

    // Handle unexpected errors
    const apiError = ApiErrorHandler.handleError(error, "UNIFIED_API")

    logger.error(`Unified Property API Unexpected Error (${requestId})`, {
      error,
      processingTimeMs: processingTime,
    })

    return NextResponse.json(
      {
        success: false,
        requestId,
        timestamp: new Date().toISOString(),
        sources: [],
        data: [],
        errors: [apiError],
        metadata: {
          totalSources: 0,
          successfulSources: 0,
          failedSources: 0,
          processingTimeMs: processingTime,
        },
      },
      { status: 500 },
    )
  }
}
