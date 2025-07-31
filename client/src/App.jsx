"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"

// Import your existing components
import StockDetailPage from "./components/comman/stockDetailPage/stockDetailPage"
import HoldingsCard from "./components/market/holdingCards"
import TradeWiseLanding from "./components/landing/TradeWiseLanding.jsx"
import Navigation from "./components/layout/Navbar"
import Markets from "./pages/Market"
import Portfolio from "./pages/Portfolio"
import Wallet from "./pages/Wallet"
import Setting from "./pages/Setting"
import Footer from "./components/layout/Footer"

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
      <p className="text-white text-lg">Loading TradeWise...</p>
    </div>
  </div>
)

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const authContext = useAuth()

  if (!authContext) {
    console.error("❌ PROTECTEDROUTE: AuthContext is null/undefined")
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-red-500">AuthContext not available</p>
        </div>
      </div>
    )
  }

  const { isLoggedIn, loading } = authContext

  console.log("🔒 PROTECTEDROUTE: Checking authentication")
  console.log("  - Loading:", loading)
  console.log("  - IsLoggedIn:", isLoggedIn)

  // Show loading spinner while checking authentication
  if (loading) {
    console.log("🔒 PROTECTEDROUTE: Still loading, showing spinner")
    return <LoadingSpinner />
  }

  // If not logged in, redirect to landing page
  if (!isLoggedIn) {
    console.log("🔒 PROTECTEDROUTE: Not logged in, redirecting to /")
    return <Navigate to="/" replace />
  }

  console.log("🔒 PROTECTEDROUTE: Authenticated, showing protected content")
  return children
}

// Public Route Component
const PublicRoute = ({ children }) => {
  const authContext = useAuth()

  if (!authContext) {
    console.error("❌ PUBLICROUTE: AuthContext is null/undefined")
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-red-500">AuthContext not available</p>
        </div>
      </div>
    )
  }

  const { isLoggedIn, loading } = authContext

  console.log("🌐 PUBLICROUTE: Checking authentication")
  console.log("  - Loading:", loading)
  console.log("  - IsLoggedIn:", isLoggedIn)

  // Show loading spinner while checking authentication
  if (loading) {
    console.log("🌐 PUBLICROUTE: Still loading, showing spinner")
    return <LoadingSpinner />
  }

  // If logged in, redirect to markets page
  if (isLoggedIn) {
    console.log("🌐 PUBLICROUTE: User is logged in, redirecting to /markets")
    return <Navigate to="/markets" replace />
  }

  console.log("🌐 PUBLICROUTE: User not logged in, showing landing page")
  return children
}

// Main App Layout for authenticated users
const AuthenticatedLayout = ({ children }) => (
  <>
    <Navigation />
    <main className="min-h-screen">{children}</main>
    <Footer />
  </>
)

// Internal App Component (needs to be inside AuthProvider)
const AppContent = () => {
  return (
    <Routes>
      {/* Public Route - Landing Page */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <TradeWiseLanding />
          </PublicRoute>
        }
      />

      {/* Protected Routes - All dashboard pages */}
      <Route
        path="/markets"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Markets Page</h1>
                <Markets />
              </div>
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/portfolio"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Portfolio />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/wallet"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Wallet />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/setting"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Setting />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/holdings"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <HoldingsCard />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/stock/:symbol"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <StockDetailPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all route - redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App