"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  Share2,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Car,
  Wifi,
  Dumbbell,
  Shield,
  Trees,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Image from "next/image"
import Link from "next/link"

const propertyImages = [
  "/placeholder.svg?height=600&width=800",
  "/placeholder.svg?height=600&width=800",
  "/placeholder.svg?height=600&width=800",
  "/placeholder.svg?height=600&width=800",
  "/placeholder.svg?height=600&width=800",
]

const amenities = [
  { icon: Car, label: "Parking" },
  { icon: Wifi, label: "WiFi" },
  { icon: Dumbbell, label: "Gym" },
  { icon: Shield, label: "Security" },
  { icon: Trees, label: "Garden" },
]

export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/search">
            <Button variant="ghost" className="mb-6 rounded-xl">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Slider */}
            <motion.div
              className="relative rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative h-96 md:h-[500px]">
                <Image
                  src={propertyImages[currentImageIndex] || "/placeholder.svg"}
                  alt="Property"
                  fill
                  className="object-cover"
                />

                {/* Navigation Buttons */}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {propertyImages.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Property Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Luxury 3BHK Apartment</h1>
                    <div className="flex items-center text-muted-foreground mb-4">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>Powai, Mumbai, Maharashtra</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />3 Beds
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />2 Baths
                      </div>
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-1" />
                        1450 sq ft
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      onClick={() => setIsBookmarked(!isBookmarked)}
                    >
                      <Heart className={`w-4 h-4 ${isBookmarked ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-4xl font-bold text-primary">₹1.2 Cr</span>
                    <Badge className="ml-4 bg-green-500">Available</Badge>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Tabs Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 rounded-2xl">
                  <TabsTrigger value="overview" className="rounded-xl">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="specifications" className="rounded-xl">
                    Specifications
                  </TabsTrigger>
                  <TabsTrigger value="location" className="rounded-xl">
                    Location
                  </TabsTrigger>
                  <TabsTrigger value="contact" className="rounded-xl">
                    Contact
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Property Overview</h3>
                    <p className="text-muted-foreground mb-6">
                      This stunning 3BHK apartment in the heart of Powai offers modern living with premium amenities.
                      The property features spacious rooms, contemporary design, and breathtaking views of the city
                      skyline. Perfect for families looking for comfort and convenience in one of Mumbai's most
                      sought-after locations.
                    </p>

                    <h4 className="text-lg font-semibold mb-4">Amenities</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {amenities.map((amenity, index) => (
                        <div key={index} className="flex flex-col items-center p-4 bg-muted rounded-xl">
                          <amenity.icon className="w-6 h-6 mb-2 text-primary" />
                          <span className="text-sm text-center">{amenity.label}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="specifications" className="mt-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Property Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Basic Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Property Type:</span>
                            <span>Apartment</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Built-up Area:</span>
                            <span>1450 sq ft</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Carpet Area:</span>
                            <span>1200 sq ft</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Floor:</span>
                            <span>12th of 25</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Facing:</span>
                            <span>North-East</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Additional Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Age of Property:</span>
                            <span>2 years</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Furnishing:</span>
                            <span>Semi-Furnished</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Parking:</span>
                            <span>2 Covered</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Water Supply:</span>
                            <span>24 Hours</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Power Backup:</span>
                            <span>Full</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="location" className="mt-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Location & Connectivity</h3>
                    <div className="aspect-video bg-muted rounded-xl mb-6 flex items-center justify-center">
                      <span className="text-muted-foreground">Interactive Map Placeholder</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Nearby Landmarks</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Powai Lake:</span>
                            <span>0.5 km</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">IIT Bombay:</span>
                            <span>1.2 km</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Hiranandani Gardens:</span>
                            <span>2.0 km</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Phoenix MarketCity:</span>
                            <span>3.5 km</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Transportation</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Powai Metro Station:</span>
                            <span>0.8 km</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Bus Stop:</span>
                            <span>0.2 km</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Mumbai Airport:</span>
                            <span>8.5 km</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Railway Station:</span>
                            <span>12 km</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="contact" className="mt-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Contact Agent</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold">
                            JD
                          </div>
                          <div>
                            <h4 className="font-semibold">John Doe</h4>
                            <p className="text-muted-foreground">Senior Property Consultant</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                <span className="text-sm">+91 98765 43210</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm">john@propertyhub.com</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Your name" className="rounded-xl" />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" placeholder="Your phone number" className="rounded-xl" />
                          </div>
                          <div>
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                              id="message"
                              placeholder="I'm interested in this property..."
                              className="rounded-xl"
                            />
                          </div>
                          <Button className="w-full rounded-xl">Send Message</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Price & CTA */}
            <Card className="p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary mb-2">₹1.2 Cr</div>
                <div className="text-muted-foreground">₹8,276 per sq ft</div>
              </div>

              <div className="space-y-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full rounded-xl" size="lg">
                      Book Site Visit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Book Site Visit</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="visit-name">Name</Label>
                        <Input id="visit-name" placeholder="Your name" className="rounded-xl" />
                      </div>
                      <div>
                        <Label htmlFor="visit-phone">Phone</Label>
                        <Input id="visit-phone" placeholder="Your phone number" className="rounded-xl" />
                      </div>
                      <div>
                        <Label htmlFor="visit-date">Preferred Date</Label>
                        <Input id="visit-date" type="date" className="rounded-xl" />
                      </div>
                      <Button className="w-full rounded-xl">Confirm Booking</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full rounded-xl" size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Agent
                </Button>

                <Button variant="outline" className="w-full rounded-xl" size="lg">
                  Get Loan Info
                </Button>
              </div>
            </Card>

            {/* Property Highlights */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Property Highlights</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Prime location in Powai</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Modern amenities</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">24/7 security</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Ready to move</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Excellent connectivity</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
