"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Maximize2, Minimize2, Navigation, Loader2 } from "lucide-react"
import { getMapConfig, getPropertyLocations } from "@/lib/actions/map-actions"

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

interface MapConfig {
  center: {
    lat: number
    lng: number
  }
  zoom: number
  style: string
}

export function PropertyMap() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [mapConfig, setMapConfig] = useState<MapConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMapData() {
      try {
        setLoading(true)
        const [config, propertyData] = await Promise.all([getMapConfig(), getPropertyLocations()])
        setMapConfig(config)
        setProperties(propertyData)
      } catch (error) {
        console.error("Failed to load map data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMapData()
  }, [])

  if (loading) {
    return (
      <Card className="h-96">
        <CardContent className="p-0 h-full flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${isFullscreen ? "fixed inset-4 z-50" : "h-96"} transition-all duration-300`}>
      <CardContent className="p-0 h-full relative">
        {/* Map Header */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
          <Badge className="bg-background/80 backdrop-blur-sm text-foreground">
            <MapPin className="w-3 h-3 mr-1" />
            {properties.length} Properties
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
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          </div>

          {/* Property Markers */}
          {properties.map((property, index) => (
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
            <p className="text-muted-foreground font-medium">Secure Property Map</p>
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
