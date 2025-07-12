import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
  const location = useLocation();

  const navigationItems = [
    { name: "Markets", href: "/markets" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Wallet", href: "/wallet" },
    { name: "Profile", href: "/profile" },
  ];

  // Function to check if the current path matches the nav item
  const isActive = (href) => {
    return location.pathname === href;
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <svg
                className="h-6 w-6 text-gray-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              <span className="text-xl font-semibold text-gray-900">
                TradeWise
              </span>
            </Link>
          </div>
          // Add this inside the main flex container after the logo div:
          {/* Desktop & Tablet Navigation */}
          <div className="hidden sm:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                  isActive(item.href)
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
