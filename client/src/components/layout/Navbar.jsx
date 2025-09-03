// =============================================================================
// 1. UPDATED NAVIGATION COMPONENT (Navigation.jsx)
// =============================================================================
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: "Markets", href: "/markets" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Wallet", href: "/wallet" },
  ];

  const isActive = (href) => {
    return location.pathname === href;
  };

  return (
    <nav className="bg-white border-b-4 border-gray-300 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <svg
                className="h-6 w-6 text-amber-500 "
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
              <span className="text-xl font-bold text-amber-700 italic">
                TradeWise
              </span>
            </Link>
          </div>

          {/* Right side - Navigation and User items */}
          <div className="flex items-center space-x-6">
            {/* Desktop & Tablet Navigation */}
            <div className="hidden sm:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 text-sm font-semibold transition-all duration-200 whitespace-nowrap rounded-lg ${
                    isActive(item.href)
                      ? "text-amber-900 bg-gradient-to-r from-amber-200 to-yellow-200 shadow-md border-b-2 border-amber-500"
                      : "text-amber-700 hover:text-amber-900 hover:bg-amber-100"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right side user items */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              {/* Notification Bell */}
              <button className="relative p-2 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-lg transition-all duration-200 shadow-md">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.73 21a2 2 0 01-3.46 0"
                  />
                </svg>
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 shadow-lg"></span>
              </button>

              {/* User Avatar - Now clickable to navigate to settings */}
              <div className="relative">
                <Link
                  to="/setting"
                  className="p-1 rounded-full hover:bg-amber-100 transition-all duration-200 shadow-md block"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg">
                    <svg
                      className="h-5 w-5 text-amber-900"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                </Link>
              </div>

              {/* Mobile menu button */}
              <div className="sm:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-lg transition-all duration-200"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-to-r from-amber-50 to-yellow-50 border-t border-amber-200 shadow-inner">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-4 py-2 text-base font-semibold transition-all duration-200 rounded-lg ${
                    isActive(item.href)
                      ? "text-amber-900 bg-gradient-to-r from-amber-200 to-yellow-200 shadow-md"
                      : "text-amber-700 hover:text-amber-900 hover:bg-amber-100"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-amber-200 mt-4">
                <Link
                  to="/setting"
                  className="flex items-center px-3 py-2 hover:bg-amber-100 rounded-lg transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg">
                    <svg
                      className="h-6 w-6 text-amber-900"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-amber-900">
                      John Doe
                    </p>
                    <p className="text-sm text-amber-700">john@example.com</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
