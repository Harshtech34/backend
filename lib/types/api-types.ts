// Common types for all APIs
export interface ApiResponse<T> {
  success: boolean
  source: string
  requestId: string
  timestamp: string
  data: T
  metadata?: {
    processingTimeMs: number
    cacheHit?: boolean
    rateLimitRemaining?: number
  }
  errors?: ApiError[]
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  source?: string
}

// Property-related types
export interface PropertyOwner {
  name: string
  identificationNumber?: string
  identificationType?: "PAN" | "AADHAAR" | "PASSPORT" | "DRIVING_LICENSE" | "VOTER_ID" | "CIN"
  ownershipPercentage?: number
  ownershipType?: "SOLE" | "JOINT" | "CORPORATE" | "TRUST"
  contactInformation?: {
    address?: string
    phone?: string
    email?: string
  }
}

export interface PropertyDetails {
  address?: string
  area?: string
  areaUnit?: "SQ_FT" | "SQ_M" | "ACRE" | "HECTARE"
  type?: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "MIXED_USE"
  subType?: string
  description?: string
  coordinates?: {
    latitude?: number
    longitude?: number
  }
  boundaries?: {
    north?: string
    south?: string
    east?: string
    west?: string
  }
  surveyNumber?: string
  landMark?: string
}

export interface Encumbrance {
  type: "MORTGAGE" | "LIEN" | "CHARGE" | "EASEMENT" | "ATTACHMENT" | "COURT_ORDER" | "OTHER"
  holder: string
  amount?: number
  dateCreated: string
  dateExpiry?: string
  status: "ACTIVE" | "DISCHARGED" | "PENDING" | "DISPUTED"
  details?: string
  documentReference?: string
  registrationNumber?: string
}

export interface Transaction {
  date: string
  type: "SALE" | "GIFT" | "INHERITANCE" | "LEASE" | "MORTGAGE" | "RELEASE" | "OTHER"
  parties: {
    role: "SELLER" | "BUYER" | "LESSOR" | "LESSEE" | "MORTGAGOR" | "MORTGAGEE" | "OTHER"
    name: string
    identificationNumber?: string
  }[]
  amount?: number
  documentReference?: string
  registrationNumber?: string
  registrationDate?: string
  registrationOffice?: string
}

export interface Document {
  type: string
  number: string
  issuedDate: string
  issuedBy: string
  expiryDate?: string
  url?: string
  status?: "VALID" | "EXPIRED" | "REVOKED"
}

// Standardized property response
export interface StandardPropertyResponse {
  propertyId?: string
  registrationNumber?: string
  ownerDetails?: PropertyOwner[]
  propertyDetails?: PropertyDetails
  encumbrances?: Encumbrance[]
  transactionHistory?: Transaction[]
  documents?: Document[]
  lastUpdated?: string
  dataSource?: string
}

// Portal-specific types
export interface DorisPropertyData extends StandardPropertyResponse {
  dorisSpecificField?: string
  registrationDetails?: {
    registrationDate: string
    registrationOffice: string
    registrationFee: number
    stampDuty: number
  }
}

export interface DlrPropertyData extends StandardPropertyResponse {
  dlrSpecificField?: string
  landRecordDetails?: {
    khasraNumber?: string
    khataNumber?: string
    landUse?: string
    landClassification?: string
    revenueDistrict?: string
    tehsil?: string
    village?: string
  }
}

export interface CersaiPropertyData extends StandardPropertyResponse {
  cersaiSpecificField?: string
  assetId?: string
  securityInterests?: {
    type: string
    holder: string
    amount?: number
    dateCreated: string
    dateExpiry?: string
    status: string
    details?: string
    loanAccountNumber?: string
    interestRate?: number
    loanTenure?: number
    monthlyInstallment?: number
  }[]
  borrowerDetails?: PropertyOwner[]
  lenderDetails?: {
    name: string
    branch?: string
    ifscCode?: string
    contactInformation?: {
      address?: string
      phone?: string
      email?: string
    }
  }
}

export interface Mca21PropertyData extends StandardPropertyResponse {
  mca21SpecificField?: string
  cinNumber?: string
  companyName?: string
  registeredAddress?: string
  dateOfIncorporation?: string
  authorizedCapital?: number
  paidUpCapital?: number
  companyStatus?: string
  directors?: {
    name: string
    din: string
    designation: string
    appointmentDate: string
  }[]
  propertyHoldings?: {
    propertyId: string
    registrationNumber: string
    address: string
    type: string
    area: string
    acquisitionDate: string
    acquisitionValue: number
    encumbrances: Encumbrance[]
  }[]
  financialInformation?: {
    lastFiledYear: string
    turnover: number
    netWorth: number
    profitAfterTax: number
  }
}

// Request types
export interface PropertySearchParams {
  propertyId?: string
  registrationNumber?: string
  ownerName?: string
  district?: string
  surveyNumber?: string
  cinNumber?: string
  companyName?: string
  assetId?: string
  borrowerName?: string
  lenderName?: string
  sources?: string[]
}

// Unified response type
export interface UnifiedPropertyResponse {
  success: boolean
  requestId: string
  timestamp: string
  sources: string[]
  data: {
    source: string
    data: StandardPropertyResponse
  }[]
  errors?: {
    source: string
    code: string
    message: string
    details?: Record<string, any>
  }[]
  metadata: {
    totalSources: number
    successfulSources: number
    failedSources: number
    processingTimeMs: number
    cacheHit?: boolean
  }
}
