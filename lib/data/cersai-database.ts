import type { CersaiPropertyData } from "../types/api-types"

export const cersaiDatabase: Record<string, CersaiPropertyData> = {
  CERSAI123456: {
    assetId: "CERSAI123456",
    propertyId: "MH1234567",
    registrationNumber: "REG/MH/2022/12345",
    securityInterests: [
      {
        type: "MORTGAGE",
        holder: "State Bank of India",
        amount: 5000000,
        dateCreated: "2022-01-15",
        dateExpiry: "2042-01-14",
        status: "ACTIVE",
        details: "Home loan against property",
        loanAccountNumber: "SBIHL12345",
        interestRate: 7.5,
        loanTenure: 240, // months
        monthlyInstallment: 40378,
      },
    ],
    propertyDetails: {
      address: "123, Pali Hill, Bandra West, Mumbai - 400050",
      type: "RESIDENTIAL",
      subType: "APARTMENT",
      area: "1200",
      areaUnit: "SQ_FT",
    },
    borrowerDetails: [
      {
        name: "Rajesh Kumar",
        identificationNumber: "ABCDE1234F",
        identificationType: "PAN",
        contactInformation: {
          address: "123, Pali Hill, Bandra West, Mumbai - 400050",
          phone: "+91-9876543210",
          email: "rajesh.kumar@example.com",
        },
      },
      {
        name: "Priya Kumar",
        identificationNumber: "FGHIJ5678K",
        identificationType: "PAN",
        contactInformation: {
          address: "123, Pali Hill, Bandra West, Mumbai - 400050",
          phone: "+91-9876543211",
          email: "priya.kumar@example.com",
        },
      },
    ],
    lenderDetails: {
      name: "State Bank of India",
      branch: "Bandra West Branch",
      ifscCode: "SBIN0005678",
      contactInformation: {
        address: "SBI Bandra West Branch, Mumbai - 400050",
        phone: "+91-2222345678",
        email: "sbi.05678@sbi.co.in",
      },
    },
    lastUpdated: "2023-02-15T11:45:30Z",
    dataSource: "CERSAI",
    cersaiSpecificField: "Sample CERSAI specific data",
  },
  CERSAI789012: {
    assetId: "CERSAI789012",
    propertyId: "KA9876543",
    registrationNumber: "REG/KA/2020/98765",
    securityInterests: [
      {
        type: "MORTGAGE",
        holder: "HDFC Bank",
        amount: 8000000,
        dateCreated: "2020-03-10",
        dateExpiry: "2035-03-09",
        status: "ACTIVE",
        details: "Home loan against property",
        loanAccountNumber: "HDFCHL67890",
        interestRate: 7.2,
        loanTenure: 180, // months
        monthlyInstallment: 59852,
      },
    ],
    propertyDetails: {
      address: "789, Indiranagar, Bangalore - 560038",
      type: "RESIDENTIAL",
      subType: "INDEPENDENT_HOUSE",
      area: "2400",
      areaUnit: "SQ_FT",
    },
    borrowerDetails: [
      {
        name: "Venkatesh Rao",
        identificationNumber: "QRSTU5678V",
        identificationType: "PAN",
        contactInformation: {
          address: "789, Indiranagar, Bangalore - 560038",
          phone: "+91-9876543213",
          email: "venkatesh.rao@example.com",
        },
      },
    ],
    lenderDetails: {
      name: "HDFC Bank",
      branch: "Indiranagar Branch",
      ifscCode: "HDFC0001234",
      contactInformation: {
        address: "HDFC Bank, Indiranagar, Bangalore - 560038",
        phone: "+91-8022345678",
        email: "indiranagar.bangalore@hdfcbank.com",
      },
    },
    lastUpdated: "2022-04-20T09:15:45Z",
    dataSource: "CERSAI",
    cersaiSpecificField: "Sample CERSAI specific data",
  },
  CERSAI345678: {
    assetId: "CERSAI345678",
    propertyId: "DL8765432",
    registrationNumber: "REG/DL/2020/87654",
    securityInterests: [
      {
        type: "MORTGAGE",
        holder: "HDFC Bank",
        amount: 15000000,
        dateCreated: "2020-08-15",
        dateExpiry: "2040-08-14",
        status: "ACTIVE",
        details: "Home loan against property",
        loanAccountNumber: "HDFCHL34567",
        interestRate: 7.4,
        loanTenure: 240, // months
        monthlyInstallment: 121135,
      },
    ],
    propertyDetails: {
      address: "789, Vasant Vihar, New Delhi - 110057",
      type: "RESIDENTIAL",
      subType: "INDEPENDENT_HOUSE",
      area: "3200",
      areaUnit: "SQ_FT",
    },
    borrowerDetails: [
      {
        name: "Amit Sharma",
        identificationNumber: "DEFGH1234I",
        identificationType: "PAN",
        contactInformation: {
          address: "789, Vasant Vihar, New Delhi - 110057",
          phone: "+91-9876543213",
          email: "amit.sharma@example.com",
        },
      },
    ],
    lenderDetails: {
      name: "HDFC Bank",
      branch: "Vasant Vihar Branch",
      ifscCode: "HDFC0002345",
      contactInformation: {
        address: "HDFC Bank, Vasant Vihar, New Delhi - 110057",
        phone: "+91-1122345678",
        email: "vasantvihar.delhi@hdfcbank.com",
      },
    },
    lastUpdated: "2022-09-10T14:30:20Z",
    dataSource: "CERSAI",
    cersaiSpecificField: "Sample CERSAI specific data",
  },
  CERSAI901234: {
    assetId: "CERSAI901234",
    propertyId: "TN5544332",
    registrationNumber: "REG/TN/2019/55443",
    securityInterests: [
      {
        type: "MORTGAGE",
        holder: "HDFC Bank",
        amount: 600000000,
        dateCreated: "2019-04-10",
        dateExpiry: "2029-04-09",
        status: "ACTIVE",
        details: "Project finance",
        loanAccountNumber: "HDFCPL90123",
        interestRate: 8.5,
        loanTenure: 120, // months
        monthlyInstallment: 7395833,
      },
    ],
    propertyDetails: {
      address: "Plot 78, OMR Road, Chennai - 600097",
      type: "COMMERCIAL",
      subType: "IT_PARK",
      area: "100000",
      areaUnit: "SQ_FT",
    },
    borrowerDetails: [
      {
        name: "XYZ Developers Limited",
        identificationNumber: "L67890KA2015PLC654321",
        identificationType: "CIN",
        contactInformation: {
          address: "42, MG Road, Bangalore - 560001",
          phone: "+91-8044556677",
          email: "info@xyzdevelopers.com",
        },
      },
    ],
    lenderDetails: {
      name: "HDFC Bank",
      branch: "Corporate Banking Branch, Chennai",
      ifscCode: "HDFC0003456",
      contactInformation: {
        address: "HDFC Bank, Corporate Banking Branch, Chennai - 600002",
        phone: "+91-4422345678",
        email: "corporate.chennai@hdfcbank.com",
      },
    },
    lastUpdated: "2023-03-05T16:20:10Z",
    dataSource: "CERSAI",
    cersaiSpecificField: "Sample CERSAI specific data",
  },
}
