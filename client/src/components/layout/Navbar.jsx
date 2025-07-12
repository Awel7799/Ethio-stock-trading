import { useState } from "react"
import { Link, useLocation } from "react-router-dom"

export default function Navigation() {
  const location = useLocation()

  const navigationItems = [
    { name: "Markets", href: "/markets" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Wallet", href: "/wallet" }, 
    { name: "Profile", href: "/profile" },
  ]

  // Function to check if the current path matches the nav item
  const isActive = (href) => {
    return location.pathname === href
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <svg className="h-6 w-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-xl font-semibold text-gray-900">TradeWise</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}