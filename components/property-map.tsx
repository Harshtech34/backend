"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Maximize2, Minimize2, Navigation } from "lucide-react"

interface Property {
  id: string
  title: string
  price: string
  location: string
  coordinates: {
    lat: number
    lng: number
  }
  type: string
  status: string
}

const sampleProperties: Property[] = [
  {
    id: "1",
    title: "Luxury Apartment",
    price: "₹1.2 Cr",
    location: "Bandra West, Mumbai",
    coordinates: { lat: 19.0596, lng: 72.8295 },
    type: "Apartment",
    status: "Available",
  },
  {
    id: "2",
    title: "Modern Villa",
    price: "₹3.5 Cr",
    location: "Whitefield, Bangalore",
    coordinates: { lat: 12.9698, lng: 77.75 },
    type: "Villa",
    status: "Available",
  },
  {
    id: "3",
    title: "Commercial Space",
    price: "₹80 L",
    location: "Connaught Place, Delhi",
    coordinates: { lat: 28.6315, lng: 77.2167 },
    type: "Commercial",
    status: "Available",
  },
]

export function PropertyMap() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  return (
    <Card className={`${isFullscreen ? "fixed inset-4 z-50" : "h-96"} transition-all duration-300`}>
      <CardContent className="p-0 h-full relative">
        {/* Map Header */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
          <Badge className="bg-background/80 backdrop-blur-sm text-foreground">
            <MapPin className="w-3 h-3 mr-1" />
            {sampleProperties.length} Properties
          </Badge>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* Simulated Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
          </div>

          {/* Property Markers */}
          {sampleProperties.map((property, index) => (
            <div
              key={property.id}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{
                left: `${30 + index * 25}%`,
                top: `${40 + index * 15}%`,
              }}
              onClick={() => setSelectedProperty(property)}
            >
              <div className="relative">
                <div className="w-8 h-8 bg-primary rounded-full border-2 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                {selectedProperty?.id === property.id && (
                  <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-64">
                    <Card className="shadow-lg">
                      <CardContent className="p-3">
                        <h4 className="font-semibold text-sm">{property.title}</h4>
                        <p className="text-xs text-muted-foreground">{property.location}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-bold text-primary">{property.price}</span>
                          <Badge variant="outline" className="text-xs">
                            {property.type}
                          </Badge>
                        </div>
                        <Button size="sm" className="w-full mt-2 text-xs">
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Map Placeholder Content */}
          <div className="text-center z-10">
            <Navigation className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">Interactive Property Map</p>
            <p className="text-sm text-muted-foreground mt-2">Click on markers to view property details</p>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
          <Button variant="secondary" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
            +
          </Button>
          <Button variant="secondary" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
            -
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
