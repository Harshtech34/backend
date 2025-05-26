"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Bed, Bath, Square, Filter, Grid, List, ArrowRight } from "lucide-react"
import Navbar from "@/components/navbar"
import Link from "next/link"
import Image from "next/image"
import { PropertyMap } from "@/components/property-map"

const searchResults = [
  {
    id: 1,
    title: "Luxury 3BHK Apartment",
    price: "₹1.2 Cr",
    location: "Powai, Mumbai",
    image: "/placeholder.svg?height=300&width=400",
    beds: 3,
    baths: 2,
    area: "1450 sq ft",
    status: "Available",
    type: "Apartment",
  },
  {
    id: 2,
    title: "Independent Villa",
    price: "₹3.5 Cr",
    location: "Whitefield, Bangalore",
    image: "/placeholder.svg?height=300&width=400",
    beds: 4,
    baths: 3,
    area: "2800 sq ft",
    status: "Available",
    type: "House",
  },
  {
    id: 3,
    title: "Commercial Plot",
    price: "₹80 L",
    location: "Sector 62, Noida",
    image: "/placeholder.svg?height=300&width=400",
    beds: 0,
    baths: 0,
    area: "1000 sq ft",
    status: "Available",
    type: "Plot",
  },
  {
    id: 4,
    title: "Studio Apartment",
    price: "₹45 L",
    location: "Hinjewadi, Pune",
    image: "/placeholder.svg?height=300&width=400",
    beds: 1,
    baths: 1,
    area: "650 sq ft",
    status: "Available",
    type: "Apartment",
  },
  {
    id: 5,
    title: "Office Space",
    price: "₹2.2 Cr",
    location: "Bandra Kurla Complex, Mumbai",
    image: "/placeholder.svg?height=300&width=400",
    beds: 0,
    baths: 2,
    area: "2200 sq ft",
    status: "Premium",
    type: "Commercial",
  },
  {
    id: 6,
    title: "2BHK Flat",
    price: "₹75 L",
    location: "Electronic City, Bangalore",
    image: "/placeholder.svg?height=300&width=400",
    beds: 2,
    baths: 2,
    area: "1100 sq ft",
    status: "Available",
    type: "Apartment",
  },
]

export default function SearchPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [filters, setFilters] = useState({
    location: "",
    propertyType: "",
    minPrice: 0,
    maxPrice: 500,
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Panel */}
          <motion.div
            className="lg:w-80 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Filters</h2>
              </div>

              <div className="space-y-6">
                {/* Location */}
                <div>
                  <Label htmlFor="location" className="text-sm font-medium mb-2 block">
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="Enter city, area, or pincode"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="rounded-xl"
                  />
                </div>

                {/* Property Type */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Property Type</Label>
                  <Select
                    value={filters.propertyType}
                    onValueChange={(value) => setFilters({ ...filters, propertyType: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="plot">Plot</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <Label className="text-sm font-medium mb-4 block">
                    Price Range: ₹{priceRange[0]}L - ₹{priceRange[1]}L
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={500}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1 rounded-xl">Apply Filters</Button>
                  <Button variant="outline" className="flex-1 rounded-xl">
                    Reset
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Results Section */}
          <div className="flex-1">
            {/* Results Header */}
            <motion.div
              className="flex flex-col sm:flex-row sm:items-center justify-between mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div>
                <h1 className="text-3xl font-bold mb-2">Search Results</h1>
                <p className="text-muted-foreground">{searchResults.length} properties found</p>
              </div>

              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-xl"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-xl"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("map")}
                  className="rounded-xl"
                >
                  <MapPin className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            {/* Map View */}
            {viewMode === "map" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              >
                <PropertyMap />
              </motion.div>
            )}

            {/* Results Grid */}
            {viewMode !== "map" && (
              <motion.div
                className={`grid gap-6 ${
                  viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {searchResults.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className={`property-card group ${viewMode === "list" ? "flex" : ""}`}>
                      <div className={`relative overflow-hidden ${viewMode === "list" ? "w-80" : ""}`}>
                        <Image
                          src={property.image || "/placeholder.svg"}
                          alt={property.title}
                          width={400}
                          height={300}
                          className={`object-cover group-hover:scale-110 transition-transform duration-500 ${
                            viewMode === "list" ? "w-80 h-full" : "w-full h-48"
                          }`}
                        />
                        <Badge className="absolute top-4 left-4 bg-primary">{property.status}</Badge>
                      </div>

                      <CardContent className="p-6 flex-1">
                        <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                        <div className="flex items-center text-muted-foreground mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{property.location}</span>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-primary">{property.price}</span>
                          <Badge variant="outline">{property.type}</Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          {property.beds > 0 && (
                            <div className="flex items-center">
                              <Bed className="w-4 h-4 mr-1" />
                              {property.beds}
                            </div>
                          )}
                          {property.baths > 0 && (
                            <div className="flex items-center">
                              <Bath className="w-4 h-4 mr-1" />
                              {property.baths}
                            </div>
                          )}
                          <div className="flex items-center">
                            <Square className="w-4 h-4 mr-1" />
                            {property.area}
                          </div>
                        </div>

                        <Link href={`/property/${property.id}`}>
                          <Button className="w-full rounded-xl group">
                            View Details
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            <motion.div
              className="flex justify-center mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl">
                  Previous
                </Button>
                <Button className="rounded-xl">1</Button>
                <Button variant="outline" className="rounded-xl">
                  2
                </Button>
                <Button variant="outline" className="rounded-xl">
                  3
                </Button>
                <Button variant="outline" className="rounded-xl">
                  Next
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
