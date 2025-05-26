export interface StandardPropertyResponse {
  success: boolean
  source: string
  timestamp: string
  data: {
    propertyId?: string
    registrationNumber?: string
    ownerDetails?: {
      name: string
      identificationNumber?: string
      contactInformation?: {
        address?: string
        phone?: string
        email?: string
      }
    }[]
    propertyDetails?: {
      address?: string
      area?: string
      type?: string
      description?: string
      coordinates?: {
        latitude?: number
        longitude?: number
      }
    }
    encumbrances?: {
      type: string
      holder: string
      amount?: number
      dateCreated: string
      dateExpiry?: string
      status: string
      details?: string
    }[]
    transactionHistory?: {
      date: string
      type: string
      parties: {
        role: string
        name: string
      }[]
      amount?: number
      documentReference?: string
    }[]
    documents?: {
      type: string
      number: string
      issuedDate: string
      issuedBy: string
      url?: string
    }[]
  }
  errors?: {
    code: string
    message: string
  }[]
}

export function formatResponse(
  source: string,
  data: any,
  success = true,
  errors: any[] = [],
): StandardPropertyResponse {
  return {
    success,
    source,
    timestamp: new Date().toISOString(),
    data,
    errors: errors.length > 0 ? errors : undefined,
  }
}
