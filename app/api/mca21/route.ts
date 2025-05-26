import { type NextRequest, NextResponse } from "next/server"
import { formatResponse } from "@/lib/utils/api-formatter"

// Mock database for MCA21
const mca21Database = {
  U12345MH2010PLC123456: {
    cinNumber: "U12345MH2010PLC123456",
    companyName: "ABC Properties Private Limited",
    registeredAddress: "10th Floor, Express Towers, Nariman Point, Mumbai - 400021",
    dateOfIncorporation: "2010-05-15",
    authorizedCapital: 10000000,
    paidUpCapital: 5000000,
    companyStatus: "Active",
    directors: [
      {
        name: "Vikram Mehta",
        din: "00123456",
        designation: "Managing Director",
        appointmentDate: "2010-05-15",
      },
      {
        name: "Sunita Sharma",
        din: "00654321",
        designation: "Director",
        appointmentDate: "2010-05-15",
      },
      {
        name: "Rahul Kapoor",
        din: "00789012",
        designation: "Director",
        appointmentDate: "2015-08-20",
      },
    ],
    propertyHoldings: [
      {
        propertyId: "MH7654321",
        registrationNumber: "REG/MH/2021/54321",
        address: "456, Marine Drive, Mumbai - 400020",
        type: "Commercial Office",
        area: "5000 sq ft",
        acquisitionDate: "2021-06-20",
        acquisitionValue: 120000000,
        encumbrances: [],
      },
      {
        propertyId: "DL9876543",
        registrationNumber: "REG/DL/2018/87654",
        address: "Plot 123, Sector 44, Gurugram - 122003",
        type: "Commercial Land",
        area: "10000 sq ft",
        acquisitionDate: "2018-11-10",
        acquisitionValue: 200000000,
        encumbrances: [
          {
            type: "Mortgage",
            holder: "ICICI Bank",
            amount: 150000000,
            dateCreated: "2018-12-05",
            dateExpiry: "2028-12-04",
            status: "Active",
            details: "Corporate loan against property",
          },
        ],
      },
    ],
    financialInformation: {
      lastFiledYear: "2022-2023",
      turnover: 250000000,
      netWorth: 180000000,
      profitAfterTax: 35000000,
    },
  },
  L67890KA2015PLC654321: {
    cinNumber: "L67890KA2015PLC654321",
    companyName: "XYZ Developers Limited",
    registeredAddress: "42, MG Road, Bangalore - 560001",
    dateOfIncorporation: "2015-02-28",
    authorizedCapital: 500000000,
    paidUpCapital: 300000000,
    companyStatus: "Active",
    directors: [
      {
        name: "Arjun Singh",
        din: "00345678",
        designation: "Chairman",
        appointmentDate: "2015-02-28",
      },
      {
        name: "Priya Patel",
        din: "00876543",
        designation: "Managing Director",
        appointmentDate: "2015-02-28",
      },
      {
        name: "Sanjay Gupta",
        din: "00901234",
        designation: "Independent Director",
        appointmentDate: "2018-04-15",
      },
      {
        name: "Meera Reddy",
        din: "00567890",
        designation: "Independent Director",
        appointmentDate: "2018-04-15",
      },
    ],
    propertyHoldings: [
      {
        propertyId: "KA1122334",
        registrationNumber: "REG/KA/2021/11223",
        address: "101, Koramangala, Bangalore - 560034",
        type: "Residential Complex",
        area: "50000 sq ft",
        acquisitionDate: "2016-07-12",
        acquisitionValue: 500000000,
        encumbrances: [
          {
            type: "Mortgage",
            holder: "Axis Bank",
            amount: 350000000,
            dateCreated: "2016-08-01",
            dateExpiry: "2026-07-31",
            status: "Active",
            details: "Project finance",
          },
        ],
      },
      {
        propertyId: "TN5544332",
        registrationNumber: "REG/TN/2019/55443",
        address: "Plot 78, OMR Road, Chennai - 600097",
        type: "IT Park",
        area: "100000 sq ft",
        acquisitionDate: "2019-03-25",
        acquisitionValue: 800000000,
        encumbrances: [
          {
            type: "Mortgage",
            holder: "HDFC Bank",
            amount: 600000000,
            dateCreated: "2019-04-10",
            dateExpiry: "2029-04-09",
            status: "Active",
            details: "Project finance",
          },
        ],
      },
    ],
    financialInformation: {
      lastFiledYear: "2022-2023",
      turnover: 1200000000,
      netWorth: 750000000,
      profitAfterTax: 180000000,
    },
  },
}

// Function to convert MCA21 data to standard format
function convertMca21ToStandard(mca21Data: any) {
  // Extract property holdings
  const properties = mca21Data.propertyHoldings.map((property: any) => ({
    propertyId: property.propertyId,
    registrationNumber: property.registrationNumber,
    ownerDetails: [
      {
        name: mca21Data.companyName,
        identificationNumber: mca21Data.cinNumber,
        contactInformation: {
          address: mca21Data.registeredAddress,
        },
      },
    ],
    propertyDetails: {
      address: property.address,
      area: property.area,
      type: property.type,
    },
    encumbrances: property.encumbrances || [],
  }))

  return properties.length === 1 ? properties[0] : properties
}

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const cinNumber = searchParams.get("cinNumber")
  const companyName = searchParams.get("companyName")
  const propertyId = searchParams.get("propertyId")

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // If cinNumber is provided, search by cinNumber
  if (cinNumber && mca21Database[cinNumber]) {
    const standardData = convertMca21ToStandard(mca21Database[cinNumber])
    return NextResponse.json(formatResponse("MCA21", standardData))
  }

  // If companyName is provided, search by companyName
  if (companyName) {
    const company = Object.values(mca21Database).find((c) =>
      c.companyName.toLowerCase().includes(companyName.toLowerCase()),
    )

    if (company) {
      const standardData = convertMca21ToStandard(company)
      return NextResponse.json(formatResponse("MCA21", standardData))
    }
  }

  // If propertyId is provided, search by propertyId
  if (propertyId) {
    const companies = Object.values(mca21Database).filter((c) =>
      c.propertyHoldings.some((property: any) => property.propertyId === propertyId),
    )

    if (companies.length > 0) {
      // For each company, find the matching property
      const matchingProperties = companies.map((company) => {
        const property = company.propertyHoldings.find((p: any) => p.propertyId === propertyId)
        return {
          propertyId: property.propertyId,
          registrationNumber: property.registrationNumber,
          ownerDetails: [
            {
              name: company.companyName,
              identificationNumber: company.cinNumber,
              contactInformation: {
                address: company.registeredAddress,
              },
            },
          ],
          propertyDetails: {
            address: property.address,
            area: property.area,
            type: property.type,
          },
          encumbrances: property.encumbrances || [],
        }
      })

      return NextResponse.json(
        formatResponse("MCA21", matchingProperties.length === 1 ? matchingProperties[0] : matchingProperties),
      )
    }
  }

  // If no company or property found or no valid search parameters provided
  return NextResponse.json(
    formatResponse("MCA21", {}, false, [
      {
        code: "NOT_FOUND",
        message: "No company or property found with the provided details",
      },
    ]),
    { status: 404 },
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Required fields validation
    if (!body.cinNumber && !body.companyName && !body.propertyId) {
      return NextResponse.json(
        formatResponse("MCA21", {}, false, [
          {
            code: "MISSING_PARAMETERS",
            message: "At least one search parameter must be provided",
          },
        ]),
        { status: 400 },
      )
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Search by cinNumber
    if (body.cinNumber && mca21Database[body.cinNumber]) {
      const standardData = convertMca21ToStandard(mca21Database[body.cinNumber])
      return NextResponse.json(formatResponse("MCA21", standardData))
    }

    // Search by companyName
    if (body.companyName) {
      const company = Object.values(mca21Database).find((c) =>
        c.companyName.toLowerCase().includes(body.companyName.toLowerCase()),
      )

      if (company) {
        const standardData = convertMca21ToStandard(company)
        return NextResponse.json(formatResponse("MCA21", standardData))
      }
    }

    // Search by propertyId
    if (body.propertyId) {
      const companies = Object.values(mca21Database).filter((c) =>
        c.propertyHoldings.some((property: any) => property.propertyId === body.propertyId),
      )

      if (companies.length > 0) {
        // For each company, find the matching property
        const matchingProperties = companies.map((company) => {
          const property = company.propertyHoldings.find((p: any) => p.propertyId === body.propertyId)
          return {
            propertyId: property.propertyId,
            registrationNumber: property.registrationNumber,
            ownerDetails: [
              {
                name: company.companyName,
                identificationNumber: company.cinNumber,
                contactInformation: {
                  address: company.registeredAddress,
                },
              },
            ],
            propertyDetails: {
              address: property.address,
              area: property.area,
              type: property.type,
            },
            encumbrances: property.encumbrances || [],
          }
        })

        return NextResponse.json(
          formatResponse("MCA21", matchingProperties.length === 1 ? matchingProperties[0] : matchingProperties),
        )
      }
    }

    // If no company or property found
    return NextResponse.json(
      formatResponse("MCA21", {}, false, [
        {
          code: "NOT_FOUND",
          message: "No company or property found with the provided details",
        },
      ]),
      { status: 404 },
    )
  } catch (error) {
    return NextResponse.json(
      formatResponse("MCA21", {}, false, [
        {
          code: "INVALID_REQUEST",
          message: "Invalid request format",
        },
      ]),
      { status: 400 },
    )
  }
}
