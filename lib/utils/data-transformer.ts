import type {
  StandardPropertyResponse,
  DorisPropertyData,
  DlrPropertyData,
  CersaiPropertyData,
  Mca21PropertyData,
} from "../types/api-types"
import { logger } from "./logger"
import { ApiErrorHandler, ERROR_CODES } from "./error-handler"

export class DataTransformer {
  public static transformDorisData(data: DorisPropertyData): StandardPropertyResponse {
    try {
      // DORIS data is already in standard format, just return it
      return {
        propertyId: data.propertyId,
        registrationNumber: data.registrationNumber,
        ownerDetails: data.ownerDetails,
        propertyDetails: data.propertyDetails,
        encumbrances: data.encumbrances,
        transactionHistory: data.transactionHistory,
        documents: data.documents,
        lastUpdated: data.lastUpdated,
        dataSource: "DORIS",
      }
    } catch (error) {
      logger.error("Error transforming DORIS data", { error, originalData: data })
      throw ApiErrorHandler.createError(
        ERROR_CODES.TRANSFORMATION_ERROR,
        "Failed to transform DORIS data",
        { originalData: data },
        "DORIS",
      )
    }
  }

  public static transformDlrData(data: DlrPropertyData): StandardPropertyResponse {
    try {
      // Transform DLR-specific fields to standard format
      return {
        propertyId: data.propertyId,
        registrationNumber: data.registrationNumber,
        ownerDetails: data.ownerDetails,
        propertyDetails: {
          ...data.propertyDetails,
          // Add any DLR-specific transformations here
          surveyNumber: data.landRecordDetails?.khasraNumber,
        },
        encumbrances: data.encumbrances,
        transactionHistory: data.transactionHistory,
        documents: data.documents,
        lastUpdated: data.lastUpdated,
        dataSource: "DLR",
      }
    } catch (error) {
      logger.error("Error transforming DLR data", { error, originalData: data })
      throw ApiErrorHandler.createError(
        ERROR_CODES.TRANSFORMATION_ERROR,
        "Failed to transform DLR data",
        { originalData: data },
        "DLR",
      )
    }
  }

  public static transformCersaiData(data: CersaiPropertyData): StandardPropertyResponse {
    try {
      // Transform CERSAI-specific fields to standard format
      return {
        propertyId: data.propertyId,
        registrationNumber: data.registrationNumber,
        ownerDetails: data.borrowerDetails || data.ownerDetails,
        propertyDetails: data.propertyDetails,
        encumbrances:
          data.securityInterests?.map((interest) => ({
            type: interest.type as any,
            holder: interest.holder,
            amount: interest.amount,
            dateCreated: interest.dateCreated,
            dateExpiry: interest.dateExpiry,
            status: interest.status as any,
            details: interest.details,
          })) || data.encumbrances,
        transactionHistory: data.transactionHistory,
        documents: data.documents,
        lastUpdated: data.lastUpdated,
        dataSource: "CERSAI",
      }
    } catch (error) {
      logger.error("Error transforming CERSAI data", { error, originalData: data })
      throw ApiErrorHandler.createError(
        ERROR_CODES.TRANSFORMATION_ERROR,
        "Failed to transform CERSAI data",
        { originalData: data },
        "CERSAI",
      )
    }
  }

  public static transformMca21Data(data: Mca21PropertyData): StandardPropertyResponse {
    try {
      // Transform MCA21-specific fields to standard format
      const propertyHolding = data.propertyHoldings?.[0]

      return {
        propertyId: data.propertyId || propertyHolding?.propertyId,
        registrationNumber: data.registrationNumber || propertyHolding?.registrationNumber,
        ownerDetails: data.ownerDetails || [
          {
            name: data.companyName || "",
            identificationNumber: data.cinNumber,
            identificationType: "CIN",
            ownershipType: "CORPORATE",
            contactInformation: {
              address: data.registeredAddress,
            },
          },
        ],
        propertyDetails:
          data.propertyDetails ||
          (propertyHolding
            ? {
                address: propertyHolding.address,
                area: propertyHolding.area,
                type: propertyHolding.type as any,
              }
            : undefined),
        encumbrances: data.encumbrances || propertyHolding?.encumbrances,
        transactionHistory: data.transactionHistory,
        documents: data.documents,
        lastUpdated: data.lastUpdated,
        dataSource: "MCA21",
      }
    } catch (error) {
      logger.error("Error transforming MCA21 data", { error, originalData: data })
      throw ApiErrorHandler.createError(
        ERROR_CODES.TRANSFORMATION_ERROR,
        "Failed to transform MCA21 data",
        { originalData: data },
        "MCA21",
      )
    }
  }
}
