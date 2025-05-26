import { PropertyStats } from "@/components/property-stats"
import { RecentProperties } from "@/components/recent-properties"
import { SearchWidget } from "@/components/search-widget"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Property Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PropertyStats />
        <div className="md:col-span-2">
          <SearchWidget />
        </div>
      </div>

      <RecentProperties />
    </div>
  )
}
