import type { PropertySearchParams } from "../types/api-types"
import type { PortalConfig } from "../config/api-config"
import { ApiErrorHandler, ERROR_CODES } from "./error-handler"

export class RequestValidator {
  public static validateSearchParams(params: PropertySearchParams, portalConfig: PortalConfig): void {
    // Check if at least one required parameter is provided
    const hasRequiredParam = portalConfig.requiredParams.some((param) => params[param as keyof PropertySearchParams])

    if (!hasRequiredParam) {
      throw ApiErrorHandler.createError(
        ERROR_CODES.MISSING_PARAMETERS,
        `At least one of these parameters is required: ${portalConfig.requiredParams.join(", ")}`,
        { providedParams: Object.keys(params) },
        portalConfig.name,
      )
    }

    // Validate parameter formats if needed
    this.validateParameterFormats(params)
  }

  private static validateParameterFormats(params: PropertySearchParams): void {
    // Validate propertyId format if provided
    if (params.propertyId && !/^[A-Z]{2}\d{5,7}$/.test(params.propertyId)) {
      throw ApiErrorHandler.createError(
        ERROR_CODES.VALIDATION_ERROR,
        "Property ID must be in the format: 2 uppercase letters followed by 5-7 digits (e.g., MH1234567)",
        { providedValue: params.propertyId },
      )
    }

    // Validate registrationNumber format if provided
    if (params.registrationNumber && !/^REG\/[A-Z]{2}\/\d{4}\/\d{5}$/.test(params.registrationNumber)) {
      throw ApiErrorHandler.createError(
        ERROR_CODES.VALIDATION_ERROR,
        "Registration Number must be in the format: REG/XX/YYYY/NNNNN (e.g., REG/MH/2022/12345)",
        { providedValue: params.registrationNumber },
      )
    }

    // Validate cinNumber format if provided
    if (params.cinNumber && !/^[UL]\d{5}[A-Z]{2}\d{4}PLC\d{6}$/.test(params.cinNumber)) {
      throw ApiErrorHandler.createError(
        ERROR_CODES.VALIDATION_ERROR,
        "CIN Number must be in the format: U/L followed by 5 digits, 2 letters, 4 digits, PLC, and 6 digits",
        { providedValue: params.cinNumber },
      )
    }
  }
}
