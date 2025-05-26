"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type Property = {
  id: string
  address: string
  owner: string
  type: string
  hasEncumbrance: boolean
  lastUpdated: string
}

export function RecentProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching recent properties
    setTimeout(() => {
      setProperties([
        {
          id: "MH1234567",
          address: "123, Pali Hill, Bandra West, Mumbai - 400050",
          owner: "Rajesh Kumar",
          type: "RESIDENTIAL",
          hasEncumbrance: true,
          lastUpdated: "2023-05-20",
        },
        {
          id: "KA9876543",
          address: "789, Indiranagar, Bangalore - 560038",
          owner: "Venkatesh Rao",
          type: "RESIDENTIAL",
          hasEncumbrance: true,
          lastUpdated: "2022-05-12",
        },
        {
          id: "DL8765432",
          address: "789, Vasant Vihar, New Delhi - 110057",
          owner: "Amit Sharma",
          type: "RESIDENTIAL",
          hasEncumbrance: true,
          lastUpdated: "2023-04-10",
        },
        {
          id: "TN5544332",
          address: "Plot 78, OMR Road, Chennai - 600097",
          owner: "XYZ Developers Limited",
          type: "COMMERCIAL",
          hasEncumbrance: true,
          lastUpdated: "2023-01-10",
        },
        {
          id: "MH7654321",
          address: "456, Marine Drive, Mumbai - 400020",
          owner: "Suresh Mehta",
          type: "RESIDENTIAL",
          hasEncumbrance: false,
          lastUpdated: "2022-07-15",
        },
      ])
      setLoading(false)
    }, 1500)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Properties</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-slate-200 rounded"></div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property ID</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">
                    <Link href={`/properties/${property.id}`} className="text-blue-600 hover:underline">
                      {property.id}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{property.address}</TableCell>
                  <TableCell>{property.owner}</TableCell>
                  <TableCell>{property.type}</TableCell>
                  <TableCell>
                    {property.hasEncumbrance ? (
                      <Badge variant="destructive">Encumbered</Badge>
                    ) : (
                      <Badge variant="outline">Clear</Badge>
                    )}
                  </TableCell>
                  <TableCell>{property.lastUpdated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
