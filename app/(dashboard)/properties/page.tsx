import { PropertySearch } from "@/components/property-search"
import { PropertyTable } from "@/components/property-table"

export default function PropertiesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Properties</h1>
      <PropertySearch />
      <PropertyTable />
    </div>
  )
}
