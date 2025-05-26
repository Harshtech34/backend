"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PropertyStats() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    propertiesWithEncumbrances: 0,
    recentTransactions: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching stats
    setTimeout(() => {
      setStats({
        totalProperties: 1250,
        propertiesWithEncumbrances: 328,
        recentTransactions: 47,
      })
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProperties.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">With Encumbrances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.propertiesWithEncumbrances.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.recentTransactions.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  )
}
