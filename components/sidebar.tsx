"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, FileText, Database, Settings, LogOut } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Search", href: "/search", icon: Search },
    { name: "Properties", href: "/properties", icon: FileText },
    { name: "Databases", href: "/databases", icon: Database },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <div className="w-64 bg-slate-800 text-white p-4 flex flex-col h-screen">
      <div className="text-xl font-bold mb-8 p-2">Property Portal</div>

      <nav className="space-y-2 flex-1">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span>{link.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-700 pt-4 mt-4">
        <button className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white w-full">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
