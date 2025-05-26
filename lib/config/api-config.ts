export const API_CONFIG = {
  // Base configuration for all APIs
  baseConfig: {
    timeout: 10000, // 10 seconds
    retries: 3,
    rateLimits: {
      requestsPerMinute: 60,
      burstLimit: 10,
    },
    caching: {
      enabled: true,
      ttl: 300, // 5 minutes
    },
  },

  // Portal-specific configurations
  portals: {
    doris: {
      name: "DORIS",
      description: "Department of Registration and Stamps",
      endpoint: "/api/doris",
      timeout: 8000,
      rateLimits: {
        requestsPerMinute: 50,
        burstLimit: 8,
      },
      requiredParams: ["propertyId", "registrationNumber"],
      optionalParams: ["district", "subRegistrarOffice"],
      responseTime: {
        min: 300,
        max: 800,
      },
    },
    dlr: {
      name: "DLR",
      description: "Digital Land Records",
      endpoint: "/api/dlr",
      timeout: 12000,
      rateLimits: {
        requestsPerMinute: 40,
        burstLimit: 6,
      },
      requiredParams: ["propertyId", "registrationNumber", "ownerName"],
      optionalParams: ["surveyNumber", "district", "village"],
      responseTime: {
        min: 500,
        max: 1000,
      },
    },
    cersai: {
      name: "CERSAI",
      description: "Central Registry of Securitisation Asset Reconstruction and Security Interest",
      endpoint: "/api/cersai",
      timeout: 15000,
      rateLimits: {
        requestsPerMinute: 30,
        burstLimit: 5,
      },
      requiredParams: ["assetId", "propertyId", "borrowerName"],
      optionalParams: ["lenderName", "securityType"],
      responseTime: {
        min: 700,
        max: 1500,
      },
    },
    mca21: {
      name: "MCA21",
      description: "Ministry of Corporate Affairs",
      endpoint: "/api/mca21",
      timeout: 20000,
      rateLimits: {
        requestsPerMinute: 20,
        burstLimit: 4,
      },
      requiredParams: ["cinNumber", "companyName", "propertyId"],
      optionalParams: ["directorName", "registeredOffice"],
      responseTime: {
        min: 800,
        max: 2000,
      },
    },
  },

  // Unified API configuration
  unifiedApi: {
    name: "Unified Property API",
    description: "Unified API for property data across all portals",
    endpoint: "/api/property",
    timeout: 30000,
    caching: {
      enabled: true,
      ttl: 600, // 10 minutes
    },
  },
}

export type PortalKey = keyof typeof API_CONFIG.portals
export type PortalConfig = (typeof API_CONFIG.portals)[PortalKey]
