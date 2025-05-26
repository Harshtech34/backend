"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Home, MapPin, Star, Shield, Award, Users, TrendingUp, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const luxuryProperties = [
  {
    id: 1,
    title: "Luxury Penthouse Suite",
    price: "₹8.5 Cr",
    location: "Worli, Mumbai",
    image: "/placeholder.svg?height=400&width=600",
    features: ["Sea View", "Private Pool", "Helipad"],
    badge: "Premium",
  },
  {
    id: 2,
    title: "Heritage Villa",
    price: "₹12 Cr",
    location: "Coonoor, Tamil Nadu",
    image: "/placeholder.svg?height=400&width=600",
    features: ["Heritage Property", "10 Acres", "Mountain View"],
    badge: "Exclusive",
  },
  {
    id: 3,
    title: "Modern Mansion",
    price: "₹15 Cr",
    location: "Whitefield, Bangalore",
    image: "/placeholder.svg?height=400&width=600",
    features: ["Smart Home", "Golf Course", "Private Cinema"],
    badge: "Ultra Luxury",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden gradient-bg">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

        {/* Government Certification Badge */}
        <motion.div
          className="absolute top-6 right-6 z-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Badge className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-semibold">
            <Shield className="w-4 h-4 mr-2" />
            Government Certified
          </Badge>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-20 text-primary/20"
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        >
          <Home size={40} />
        </motion.div>

        <motion.div
          className="absolute bottom-32 right-32 text-primary/20"
          animate={{ y: [20, -20, 20] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        >
          <MapPin size={32} />
        </motion.div>

        <motion.div
          className="absolute top-40 right-20 text-primary/20"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <Star size={24} />
        </motion.div>

        {/* Main Content */}
        <div className="text-center z-10 max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
              Find Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 block">
                Dream Property
              </span>
            </h1>
          </motion.div>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover thousands of verified properties, connect with trusted agents, and make your property dreams come
            true with India's most trusted real estate platform.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/search?type=buy">
              <Button
                size="lg"
                className="text-lg px-8 py-6 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground group"
              >
                Buy Property
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/search?type=sell">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 rounded-2xl border-primary/50 hover:bg-primary/10"
              >
                Sell Property
              </Button>
            </Link>

            <Link href="/search?type=rent">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 rounded-2xl border-primary/50 hover:bg-primary/10"
              >
                Rent Property
              </Button>
            </Link>

            <Link href="/auth/register">
              <Button variant="secondary" size="lg" className="text-lg px-8 py-6 rounded-2xl">
                Register Now
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Properties</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">2K+</div>
              <div className="text-muted-foreground">Agents</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-muted-foreground">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">1M+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Luxury Properties Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <Award className="w-4 h-4 mr-2" />
              Luxury Collection
            </Badge>
            <h2 className="text-5xl font-bold text-foreground mb-6">Premium Properties</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our exclusive collection of luxury properties, carefully curated for the most discerning buyers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {luxuryProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
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
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
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

                    <div className="flex flex-wrap gap-2 mb-6">
                      {property.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
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

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href="/luxury">
              <Button size="lg" variant="outline" className="rounded-2xl px-8">
                View All Luxury Properties
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">Why Choose PropertyHub?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of real estate with our cutting-edge platform and unmatched service.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Government Verified",
                description: "All properties are verified through government databases for complete transparency.",
              },
              {
                icon: TrendingUp,
                title: "Smart Analytics",
                description: "AI-powered market insights and price predictions to make informed decisions.",
              },
              {
                icon: Users,
                title: "Expert Support",
                description: "24/7 support from certified real estate professionals and legal experts.",
              },
              {
                icon: CheckCircle,
                title: "Automated Processes",
                description: "Streamlined documentation and automated compliance checks for faster transactions.",
              },
              {
                icon: MapPin,
                title: "Location Intelligence",
                description: "Detailed neighborhood insights, amenities mapping, and connectivity analysis.",
              },
              {
                icon: Award,
                title: "Premium Service",
                description: "White-glove service for luxury properties with dedicated relationship managers.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
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
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Ready to Find Your Dream Home?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join millions of satisfied customers who found their perfect property with PropertyHub. Start your journey
            today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <Button size="lg" className="rounded-2xl px-8 py-6 text-lg">
                Start Property Search
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                size="lg"
                variant="outline"
                className="rounded-2xl px-8 py-6 text-lg border-white/20 text-white hover:bg-white/10"
              >
                Create Free Account
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
