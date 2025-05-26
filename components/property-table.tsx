"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Eye, FileText } from "lucide-react"

type Property = {
  id: string
  address: string
  owner: string
  type: string
  hasEncumbrance: boolean
  lastUpdated: string
  sources: string[]
}

export function PropertyTable() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    // Simulate fetching properties with pagination
    setLoading(true)
    setTimeout(() => {
      // Generate 20 sample properties
      const sampleProperties: Property[] = Array.from({ length: 20 }, (_, i) => {
        const types = ["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL", "AGRICULTURAL", "MIXED_USE"]
        const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad"]
        const randomType = types[Math.floor(Math.random() * types.length)]
        const randomCity = cities[Math.floor(Math.random() * cities.length)]
        const randomHasEncumbrance = Math.random() > 0.5
        const randomSources = ["DORIS", "DLR", "CERSAI", "MCA21"].filter(() => Math.random() > 0.3)

        return {
          id: `PROP${(i + 1).toString().padStart(6, "0")}`,
          address: `${100 + i}, Sample Street, ${randomCity}`,
          owner: `Owner ${i + 1}`,
          type: randomType,
          hasEncumbrance: randomHasEncumbrance,
          lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split("T")[0],
          sources: randomSources.length ? randomSources : ["DORIS"],
        }
      })

      setProperties(sampleProperties)
      setTotalPages(5) // Simulate 5 pages of results
      setLoading(false)
    }, 1000)
  }, [page])

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-6 animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-slate-200 rounded"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property ID</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sources</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
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
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {property.sources.map((source) => (
                            <Badge key={source} variant="secondary" className="text-xs">
                              {source}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{property.lastUpdated}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" asChild>
                            <Link href={`/properties/${property.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="icon" asChild>
                            <Link href={`/properties/${property.id}/documents`}>
                              <FileText className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing page {page} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={handleNextPage} disabled={page === totalPages}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
