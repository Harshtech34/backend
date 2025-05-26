import { dorisDatabase } from "../data/doris-database"
import { dlrDatabase } from "../data/dlr-database"
import { cersaiDatabase } from "../data/cersai-database"
import { mca21Database } from "../data/mca21-database"
import type { StandardPropertyResponse } from "../types/api-types"

// Map of property IDs to their corresponding IDs in other databases
export const propertyIdMap: Record<string, Record<string, string>> = {
  // DORIS property IDs
  MH1234567: {
    doris: "MH1234567",
    dlr: "MH1234567",
    cersai: "CERSAI123456",
  },
  MH7654321: {
    doris: "MH7654321",
    dlr: "MH7654321",
    mca21: "U12345MH2010PLC123456", // Company that owns this property
  },
  DL8765432: {
    doris: "DL8765432",
    dlr: "DL8765432",
    cersai: "CERSAI345678",
    mca21: "U98765DL2012PLC987654", // Company that owns this property
  },

  // DLR property IDs
  KA9876543: {
    dlr: "KA9876543",
    cersai: "CERSAI789012",
  },
  KA1122334: {
    dlr: "KA1122334",
    mca21: "L67890KA2015PLC654321", // Company that owns this property
  },
  TN5544332: {
    dlr: "TN5544332",
    cersai: "CERSAI901234",
    mca21: "L67890KA2015PLC654321", // Company that owns this property
  },

  // CERSAI asset IDs
  CERSAI123456: {
    cersai: "CERSAI123456",
    doris: "MH1234567",
    dlr: "MH1234567",
  },
  CERSAI789012: {
    cersai: "CERSAI789012",
    dlr: "KA9876543",
  },
  CERSAI345678: {
    cersai: "CERSAI345678",
    doris: "DL8765432",
    dlr: "DL8765432",
    mca21: "U98765DL2012PLC987654",
  },
  CERSAI901234: {
    cersai: "CERSAI901234",
    dlr: "TN5544332",
    mca21: "L67890KA2015PLC654321",
  },

  // MCA21 CIN numbers
  U12345MH2010PLC123456: {
    mca21: "U12345MH2010PLC123456",
    doris: "MH7654321",
    dlr: "MH7654321",
  },
  L67890KA2015PLC654321: {
    mca21: "L67890KA2015PLC654321",
    dlr: "KA1122334",
    dlr2: "TN5544332", // This company owns multiple properties
    cersai: "CERSAI901234",
  },
  U98765DL2012PLC987654: {
    mca21: "U98765DL2012PLC987654",
    doris: "DL8765432",
    dlr: "DL8765432",
    cersai: "CERSAI345678",
  },
}

// Function to get property ID in a specific database
export function getPropertyIdInDatabase(
  propertyId: string,
  targetDatabase: "doris" | "dlr" | "cersai" | "mca21",
): string | null {
  const mapping = propertyIdMap[propertyId]
  if (!mapping) return null

  return mapping[targetDatabase] || null
}

// Function to check if a property exists in a specific database
export function propertyExistsInDatabase(propertyId: string, database: "doris" | "dlr" | "cersai" | "mca21"): boolean {
  const targetId = getPropertyIdInDatabase(propertyId, database)
  if (!targetId) return false

  switch (database) {
    case "doris":
      return !!dorisDatabase[targetId]
    case "dlr":
      return !!dlrDatabase[targetId]
    case "cersai":
      return !!cersaiDatabase[targetId]
    case "mca21":
      return !!mca21Database[targetId]
    default:
      return false
  }
}

// Function to get all database IDs for a property
export function getAllDatabaseIds(propertyId: string): Record<string, string> {
  return propertyIdMap[propertyId] || { [determineDatabase(propertyId)]: propertyId }
}

// Function to determine which database a property ID belongs to based on its format
function determineDatabase(propertyId: string): "doris" | "dlr" | "cersai" | "mca21" {
  if (propertyId.startsWith("CERSAI")) return "cersai"
  if (/^[UL]\d{5}[A-Z]{2}\d{4}PLC\d{6}$/.test(propertyId)) return "mca21"
  if (propertyId.startsWith("MH") || propertyId.startsWith("DL")) return "doris"
  if (propertyId.startsWith("KA") || propertyId.startsWith("TN")) return "dlr"

  // Default to doris if can't determine
  return "doris"
}

// Function to merge property data from multiple databases
export function mergePropertyData(
  propertyId: string,
  includeDoris = true,
  includeDlr = true,
  includeCersai = true,
  includeMca21 = true,
): StandardPropertyResponse | null {
  const databaseIds = getAllDatabaseIds(propertyId)
  const mergedData: StandardPropertyResponse = {
    propertyId,
    dataSource: "MERGED",
  }

  let foundAnyData = false

  // Get data from DORIS
  if (includeDoris && databaseIds.doris && dorisDatabase[databaseIds.doris]) {
    const dorisData = dorisDatabase[databaseIds.doris]
    mergeData(mergedData, dorisData)
    foundAnyData = true
  }

  // Get data from DLR
  if (includeDlr && databaseIds.dlr && dlrDatabase[databaseIds.dlr]) {
    const dlrData = dlrDatabase[databaseIds.dlr]
    mergeData(mergedData, dlrData)
    foundAnyData = true
  }

  // Get data from CERSAI
  if (includeCersai && databaseIds.cersai && cersaiDatabase[databaseIds.cersai]) {
    const cersaiData = cersaiDatabase[databaseIds.cersai]
    mergeData(mergedData, cersaiData)
    foundAnyData = true
  }

  // Get data from MCA21
  if (includeMca21 && databaseIds.mca21 && mca21Database[databaseIds.mca21]) {
    const mca21Data = mca21Database[databaseIds.mca21]
    // For MCA21, we need to find the specific property in the company's holdings
    const propertyHolding = mca21Data.propertyHoldings?.find(
      (p) => p.propertyId === propertyId || p.propertyId === databaseIds.doris || p.propertyId === databaseIds.dlr,
    )

    if (propertyHolding) {
      mergeData(mergedData, {
        propertyId: propertyHolding.propertyId,
        registrationNumber: propertyHolding.registrationNumber,
        propertyDetails: {
          address: propertyHolding.address,
          area: propertyHolding.area,
          type: propertyHolding.type as any,
        },
        encumbrances: propertyHolding.encumbrances,
        ownerDetails: [
          {
            name: mca21Data.companyName,
            identificationNumber: mca21Data.cinNumber,
            identificationType: "CIN",
            ownershipType: "CORPORATE",
            contactInformation: {
              address: mca21Data.registeredAddress,
            },
          },
        ],
        dataSource: "MCA21",
      })
      foundAnyData = true
    }
  }

  return foundAnyData ? mergedData : null
}

// Helper function to merge property data
function mergeData(target: StandardPropertyResponse, source: any): void {
  // Merge basic properties
  if (!target.registrationNumber && source.registrationNumber) {
    target.registrationNumber = source.registrationNumber
  }

  // Merge owner details
  if (source.ownerDetails && source.ownerDetails.length > 0) {
    if (!target.ownerDetails) {
      target.ownerDetails = []
    }

    // Add owners that don't already exist in the target
    for (const sourceOwner of source.ownerDetails) {
      const ownerExists = target.ownerDetails.some(
        (targetOwner) => targetOwner.identificationNumber === sourceOwner.identificationNumber,
      )

      if (!ownerExists) {
        target.ownerDetails.push(sourceOwner)
      }
    }
  }

  // Merge property details
  if (source.propertyDetails) {
    if (!target.propertyDetails) {
      target.propertyDetails = source.propertyDetails
    } else {
      target.propertyDetails = {
        ...target.propertyDetails,
        ...Object.fromEntries(
          Object.entries(source.propertyDetails).filter(([_, value]) => value !== undefined && value !== null),
        ),
      }
    }
  }

  // Merge encumbrances
  if (source.encumbrances && source.encumbrances.length > 0) {
    if (!target.encumbrances) {
      target.encumbrances = []
    }

    // Add encumbrances that don't already exist in the target
    for (const sourceEncumbrance of source.encumbrances) {
      const encumbranceExists = target.encumbrances.some(
        (targetEncumbrance) =>
          targetEncumbrance.holder === sourceEncumbrance.holder &&
          targetEncumbrance.dateCreated === sourceEncumbrance.dateCreated,
      )

      if (!encumbranceExists) {
        target.encumbrances.push(sourceEncumbrance)
      }
    }
  }

  // Merge transaction history
  if (source.transactionHistory && source.transactionHistory.length > 0) {
    if (!target.transactionHistory) {
      target.transactionHistory = []
    }

    // Add transactions that don't already exist in the target
    for (const sourceTransaction of source.transactionHistory) {
      const transactionExists = target.transactionHistory.some(
        (targetTransaction) =>
          targetTransaction.date === sourceTransaction.date &&
          targetTransaction.documentReference === sourceTransaction.documentReference,
      )

      if (!transactionExists) {
        target.transactionHistory.push(sourceTransaction)
      }
    }
  }

  // Merge documents
  if (source.documents && source.documents.length > 0) {
    if (!target.documents) {
      target.documents = []
    }

    // Add documents that don't already exist in the target
    for (const sourceDocument of source.documents) {
      const documentExists = target.documents.some((targetDocument) => targetDocument.number === sourceDocument.number)

      if (!documentExists) {
        target.documents.push(sourceDocument)
      }
    }
  }

  // Update last updated timestamp if newer
  if (source.lastUpdated) {
    if (!target.lastUpdated || new Date(source.lastUpdated) > new Date(target.lastUpdated)) {
      target.lastUpdated = source.lastUpdated
    }
  }
}
