import StockDetailPage from './components/comman/stockDetailPage/stockDetailPage';
import HoldingsCard from './components/market/holdingCards';
import TradeWiseLanding from './components/landing/TradeWiseLanding.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/layout/Navbar' // Fixed: Changed from Navbar to Navigation
import Markets from './pages/Market'
import Portfolio from './pages/Portfolio'
import Wallet from './pages/Wallet'
import Setting from './pages/Setting'
import Footer from './components/layout/Footer'
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Render navbar only after login (not on landing)*/}
        <Routes>
          <Route path="/" element={<TradeWiseLanding />} />
          <Route
            path="*"
            element={
              <>
                <Navigation />
                <main>
                  <Routes>
                    <Route path="/markets" element={<Markets />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/wallet" element={<Wallet />} />
                    <Route path="/Setting" element={<Setting />} />
                    <Route path="/holdings" element={<HoldingsCard />} />
                    <Route path="/stock/:symbol" element={<StockDetailPage />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App