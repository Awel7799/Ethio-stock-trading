
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
import Profile from "./pages/Profile"
import Footer from "./components/layout/Footer"

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
    <p className="mt-4 text-gray-600">Loading...</p>
  </div>
)

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const authContext = useAuth()

  if (!authContext) {
    console.error("AuthContext is null/undefined")
    return <div className="p-4 bg-red-100">Error: AuthContext not available</div>
  }

  const { isLoggedIn, loading } = authContext

  console.log("🔒 PROTECTEDROUTE: Checking authentication")
  console.log("  - Loading:", loading)
  console.log("  - IsLoggedIn:", isLoggedIn)

  if (loading) {
    console.log("🔒 PROTECTEDROUTE: Still loading, showing spinner")
    return <LoadingSpinner />
  }

  if (!isLoggedIn) {
    console.log("🔒 PROTECTEDROUTE: Not logged in, redirecting to /")
    return <Navigate to="/" replace />
  }

  console.log("🔒 PROTECTEDROUTE: Authenticated, showing protected content")
  return children
}

// Public Route Component (redirect to markets if already logged in)
const PublicRoute = ({ children }) => {
  const authContext = useAuth()

  if (!authContext) {
    console.error("AuthContext is null/undefined")
    return <div className="p-4 bg-red-100">Error: AuthContext not available</div>
  }

  const { isLoggedIn, loading } = authContext

  console.log("🌐 PUBLICROUTE: Checking authentication")
  console.log("  - Loading:", loading)
  console.log("  - IsLoggedIn:", isLoggedIn)
  console.log("  - Should redirect:", isLoggedIn && !loading)

  if (loading) {
    console.log("🌐 PUBLICROUTE: Still loading, showing spinner")
    return <LoadingSpinner />
  }

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
    <main>{children}</main>
    <Footer />
  </>
)

// Internal App Component (needs to be inside AuthProvider)
const AppContent = () => {
  return (
    <Routes>
      {/* Public Route - Landing Page (Full Screen) */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <TradeWiseLanding />
          </PublicRoute>
        }
      />

      {/* Protected Routes - All other pages */}
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
              <Profile />
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
  );
}

export default App
