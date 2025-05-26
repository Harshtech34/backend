"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock } from "lucide-react"

interface DeploymentStatus {
  status: "healthy" | "unhealthy" | "checking"
  timestamp: string
  version: string
}

export function DeploymentStatus() {
  const [status, setStatus] = useState<DeploymentStatus>({
    status: "checking",
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
  })

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch("/api/health")
        if (response.ok) {
          setStatus({
            status: "healthy",
            timestamp: new Date().toISOString(),
            version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
          })
        } else {
          setStatus((prev) => ({ ...prev, status: "unhealthy" }))
        }
      } catch (error) {
        setStatus((prev) => ({ ...prev, status: "unhealthy" }))
      }
    }

    checkHealth()
    const interval = setInterval(checkHealth, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = () => {
    switch (status.status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "unhealthy":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = () => {
    switch (status.status) {
      case "healthy":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "unhealthy":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Badge variant="outline" className={`${getStatusColor()} flex items-center gap-2`}>
        {getStatusIcon()}
        <span className="text-xs">
          {status.status === "healthy" ? "Live" : status.status === "unhealthy" ? "Issues" : "Checking..."}
        </span>
        <span className="text-xs opacity-60">v{status.version}</span>
      </Badge>
    </div>
  )
}

// Default export for compatibility
export default DeploymentStatus
