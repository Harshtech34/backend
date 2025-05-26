"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, Square, ArrowRight } from "lucide-react"
import Navbar from "@/components/navbar"
import Link from "next/link"
import Image from "next/image"

const featuredProperties = [
  {
    id: 1,
    title: "Modern Luxury Villa",
    price: "₹2.5 Cr",
    location: "Bandra West, Mumbai",
    image: "/placeholder.svg?height=300&width=400",
    beds: 4,
    baths: 3,
    area: "2500 sq ft",
    status: "Available",
  },
  {
    id: 2,
    title: "Cozy Apartment",
    price: "₹85 L",
    location: "Koramangala, Bangalore",
    image: "/placeholder.svg?height=300&width=400",
    beds: 2,
    baths: 2,
    area: "1200 sq ft",
    status: "Available",
  },
  {
    id: 3,
    title: "Commercial Space",
    price: "₹1.2 Cr",
    location: "Connaught Place, Delhi",
    image: "/placeholder.svg?height=300&width=400",
    beds: 0,
    baths: 2,
    area: "1800 sq ft",
    status: "Available",
  },
  {
    id: 4,
    title: "Penthouse Suite",
    price: "₹4.8 Cr",
    location: "Marine Drive, Mumbai",
    image: "/placeholder.svg?height=300&width=400",
    beds: 5,
    baths: 4,
    area: "3500 sq ft",
    status: "Premium",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 gradient-bg" />
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] bg-cover bg-center opacity-20" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to PropertyHub
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your journey to the perfect property starts here
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/search?type=buy">
              <Button size="lg" className="rounded-2xl px-8">
                Buy
              </Button>
            </Link>
            <Link href="/search?type=sell">
              <Button size="lg" variant="outline" className="rounded-2xl px-8">
                Sell
              </Button>
            </Link>
            <Link href="/search?type=rent">
              <Button size="lg" variant="outline" className="rounded-2xl px-8">
                Rent
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="rounded-2xl px-8">
                Register
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Featured Properties</h2>
            <p className="text-muted-foreground text-lg">Discover our handpicked selection of premium properties</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="property-card group">
                  <div className="relative overflow-hidden">
                    <Image
                      src={property.image || "/placeholder.svg"}
                      alt={property.title}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className="absolute top-4 left-4 bg-primary">{property.status}</Badge>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                    <div className="flex items-center text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">{property.price}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      {property.beds > 0 && (
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          {property.beds}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        {property.baths}
                      </div>
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-1" />
                        {property.area}
                      </div>
                    </div>

                    <Link href={`/property/${property.id}`}>
                      <Button className="w-full rounded-xl group">
                        View Deal
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6 gradient-bg">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Find Your Dream Home Today</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of satisfied customers who found their perfect property with us
          </p>
          <Link href="/search">
            <Button size="lg" className="rounded-2xl px-8 py-6 text-lg">
              Start Your Search
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
