"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function PropertySearch() {
  const [searchParams, setSearchParams] = useState({
    propertyId: "",
    registrationNumber: "",
    ownerName: "",
    propertyType: "",
    sources: {
      doris: true,
      dlr: true,
      cersai: true,
      mca21: true,
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSourceChange = (source: string, checked: boolean) => {
    setSearchParams((prev) => ({
      ...prev,
      sources: {
        ...prev.sources,
        [source]: checked,
      },
    }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Search with params:", searchParams)
    // Implement search functionality
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="propertyId">Property ID</Label>
              <Input
                id="propertyId"
                name="propertyId"
                placeholder="e.g., MH1234567"
                value={searchParams.propertyId}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input
                id="registrationNumber"
                name="registrationNumber"
                placeholder="e.g., REG/MH/2022/12345"
                value={searchParams.registrationNumber}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input
                id="ownerName"
                name="ownerName"
                placeholder="e.g., Rajesh Kumar"
                value={searchParams.ownerName}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="propertyType">Property Type</Label>
              <Select
                onValueChange={(value) => setSearchParams((prev) => ({ ...prev, propertyType: value }))}
                value={searchParams.propertyType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                  <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                  <SelectItem value="INDUSTRIAL">Industrial</SelectItem>
                  <SelectItem value="AGRICULTURAL">Agricultural</SelectItem>
                  <SelectItem value="MIXED_USE">Mixed Use</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Data Sources</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="doris"
                  checked={searchParams.sources.doris}
                  onCheckedChange={(checked) => handleSourceChange("doris", checked as boolean)}
                />
                <Label htmlFor="doris" className="cursor-pointer">
                  DORIS
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dlr"
                  checked={searchParams.sources.dlr}
                  onCheckedChange={(checked) => handleSourceChange("dlr", checked as boolean)}
                />
                <Label htmlFor="dlr" className="cursor-pointer">
                  DLR
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cersai"
                  checked={searchParams.sources.cersai}
                  onCheckedChange={(checked) => handleSourceChange("cersai", checked as boolean)}
                />
                <Label htmlFor="cersai" className="cursor-pointer">
                  CERSAI
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mca21"
                  checked={searchParams.sources.mca21}
                  onCheckedChange={(checked) => handleSourceChange("mca21", checked as boolean)}
                />
                <Label htmlFor="mca21" className="cursor-pointer">
                  MCA21
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Search Properties</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
