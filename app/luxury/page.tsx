"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Bed, Bath, Square, ArrowRight, Star, Crown, Award, Search } from "lucide-react"
import Navbar from "@/components/navbar"
import Link from "next/link"
import Image from "next/image"

const luxuryProperties = [
  {
    id: 1,
    title: "Royal Penthouse Suite",
    price: "₹25 Cr",
    location: "Altamount Road, Mumbai",
    image: "/placeholder.svg?height=400&width=600",
    beds: 6,
    baths: 7,
    area: "8500 sq ft",
    features: ["Private Elevator", "Helipad", "Wine Cellar", "Home Theater"],
    badge: "Ultra Luxury",
    rating: 5.0,
  },
  {
    id: 2,
    title: "Heritage Palace",
    price: "₹45 Cr",
    location: "Lutyens Delhi, New Delhi",
    image: "/placeholder.svg?height=400&width=600",
    beds: 12,
    baths: 15,
    area: "25000 sq ft",
    features: ["Heritage Property", "20 Acres", "Private Lake", "Guest House"],
    badge: "Palace",
    rating: 5.0,
  },
  {
    id: 3,
    title: "Modern Mansion",
    price: "₹18 Cr",
    location: "Koregaon Park, Pune",
    image: "/placeholder.svg?height=400&width=600",
    beds: 8,
    baths: 10,
    area: "12000 sq ft",
    features: ["Smart Home", "Indoor Pool", "Tennis Court", "Spa"],
    badge: "Smart Luxury",
    rating: 4.9,
  },
  {
    id: 4,
    title: "Beachfront Villa",
    price: "₹35 Cr",
    location: "ECR, Chennai",
    image: "/placeholder.svg?height=400&width=600",
    beds: 10,
    baths: 12,
    area: "15000 sq ft",
    features: ["Private Beach", "Infinity Pool", "Yacht Dock", "Guest Villas"],
    badge: "Beachfront",
    rating: 5.0,
  },
  {
    id: 5,
    title: "Sky Villa",
    price: "₹22 Cr",
    location: "UB City, Bangalore",
    image: "/placeholder.svg?height=400&width=600",
    beds: 5,
    baths: 6,
    area: "7500 sq ft",
    features: ["Sky Garden", "Private Pool", "Concierge", "Valet Parking"],
    badge: "Sky Villa",
    rating: 4.8,
  },
  {
    id: 6,
    title: "Golf Course Mansion",
    price: "₹28 Cr",
    location: "DLF Golf Links, Gurugram",
    image: "/placeholder.svg?height=400&width=600",
    beds: 9,
    baths: 11,
    area: "18000 sq ft",
    features: ["Golf Course View", "Private Club", "Wine Room", "Library"],
    badge: "Golf Estate",
    rating: 4.9,
  },
]

export default function LuxuryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-6 gradient-bg">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <Crown className="w-4 h-4 mr-2" />
              Exclusive Luxury Collection
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">Luxury Properties</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover India's most exclusive properties. From heritage palaces to modern penthouses, find your perfect
              luxury home with our curated collection.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-12 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input placeholder="Search luxury properties..." className="pl-10 rounded-xl" />
                  </div>

                  <Select>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="penthouse">Penthouse</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="mansion">Mansion</SelectItem>
                      <SelectItem value="palace">Palace</SelectItem>
                      <SelectItem value="estate">Estate</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10-20">₹10-20 Cr</SelectItem>
                      <SelectItem value="20-30">₹20-30 Cr</SelectItem>
                      <SelectItem value="30-50">₹30-50 Cr</SelectItem>
                      <SelectItem value="50+">₹50+ Cr</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="pune">Pune</SelectItem>
                      <SelectItem value="chennai">Chennai</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">Exclusive Properties</h2>
            <p className="text-muted-foreground">{luxuryProperties.length} luxury properties available</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {luxuryProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="property-card group overflow-hidden">
                  <div className="relative">
                    <Image
                      src={property.image || "/placeholder.svg"}
                      alt={property.title}
                      width={600}
                      height={400}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      {property.badge}
                    </Badge>
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm font-medium">{property.rating}</span>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{property.title}</h3>
                    <div className="flex items-center text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-bold text-primary">{property.price}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        {property.beds}
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        {property.baths}
                      </div>
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-1" />
                        {property.area}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-6">
                      {property.features.slice(0, 3).map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {property.features.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{property.features.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <Link href={`/property/${property.id}`}>
                      <Button className="w-full rounded-xl group bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
                        View Luxury Details
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Button size="lg" variant="outline" className="rounded-2xl px-8">
              Load More Properties
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Luxury Services */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">Luxury Services</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience white-glove service with our exclusive luxury property division
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Crown,
                title: "Dedicated Relationship Manager",
                description: "Personal luxury property specialist assigned to your account",
              },
              {
                icon: Award,
                title: "Exclusive Property Access",
                description: "First access to off-market and pre-launch luxury properties",
              },
              {
                icon: Star,
                title: "Concierge Services",
                description: "Complete assistance with legal, financial, and relocation services",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 gradient-bg">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Ready for Luxury Living?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with our luxury property specialists and discover exclusive opportunities in India's most
            prestigious locations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="rounded-2xl px-8 py-6 text-lg">
                Schedule Private Viewing
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                size="lg"
                variant="outline"
                className="rounded-2xl px-8 py-6 text-lg border-white/20 text-white hover:bg-white/10"
              >
                Join Luxury Club
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
