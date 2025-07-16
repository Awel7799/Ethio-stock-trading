import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/layout/Navbar' // Fixed: Changed from Navbar to Navigation
import Markets from './pages/Market'
import Portfoliopage from './pages/Portfolio'
import Wallet from './pages/Wallet'
import Profile from './pages/Profile'
import Footer from './components/layout/Footer'
import TradeWiseLanding from './components/landing/TradeWiseLanding'
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <main>
          <Routes>
            <Route path="/" element={<TradeWiseLanding />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/portfolio" element={<Portfoliopage />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/Setting" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App