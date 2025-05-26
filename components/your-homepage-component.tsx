"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const YourHomepageComponent = () => {
  return (
    <div className="container mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to the Property Portal</CardTitle>
          <CardDescription>Search for properties, view recent listings, and manage your account.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p>This is a demo property portal built with Next.js, TypeScript, and Radix UI.</p>
          <Button>Get Started</Button>
        </CardContent>
      </Card>
    </div>
  )
}
