import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { WalletProvider } from "./context/WalletContext"
import AIAssistantIcon from "./components/AIChatBox/AIAssistantIcon.jsx"
import StockDetailPage from "./components/comman/stockDetailPage/stockDetailPage"
import HoldingsCard from "./components/market/holdingCards"
import TradeWiseLanding from "./components/landing/TradeWiseLanding.jsx"
import Navigation from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import Markets from "./pages/Market"
import Portfolio from "./pages/Portfolio"
import Wallet from "./pages/Wallet.jsx"
import Setting from "./pages/Setting"

const LoadingScreen = () => (
  <main className="app-loading" aria-live="polite">
    <span className="loading-mark" />
    <p>Loading your workspace</p>
  </main>
)

const RouteGuard = ({ children, publicOnly = false }) => {
  const { isLoggedIn, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (publicOnly ? isLoggedIn : !isLoggedIn) {
    return <Navigate to={publicOnly ? "/markets" : "/"} replace />
  }
  return children
}

const DashboardLayout = ({ children }) => (
  <div className="app-shell">
    <Navigation />
    <main className="dashboard-main">
      {children}
      <div className="assistant-dock"><AIAssistantIcon /></div>
    </main>
    <Footer />
  </div>
)

const ProtectedPage = ({ children }) => (
  <RouteGuard><DashboardLayout>{children}</DashboardLayout></RouteGuard>
)

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<RouteGuard publicOnly><TradeWiseLanding /></RouteGuard>} />
    <Route path="/markets" element={<ProtectedPage><Markets /></ProtectedPage>} />
    <Route path="/portfolio" element={<ProtectedPage><Portfolio /></ProtectedPage>} />
    <Route path="/wallet" element={<ProtectedPage><Wallet /></ProtectedPage>} />
    <Route path="/setting" element={<ProtectedPage><Setting /></ProtectedPage>} />
    <Route path="/holdings" element={<ProtectedPage><HoldingsCard /></ProtectedPage>} />
    <Route path="/stock/:symbol" element={<ProtectedPage><StockDetailPage /></ProtectedPage>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <Router><AppRoutes /></Router>
      </WalletProvider>
    </AuthProvider>
  )
}
