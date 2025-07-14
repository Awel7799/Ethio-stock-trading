import StockSearchBar from "../components/market/stockSearchBar"
import TotalInvestmentCard from "../components/market/totalBalance"
import PerformanceChart from "../components/market/performanceChart"
import TopMovers from "../components/market/topMover"
import NewsFeed from "../components/market/newsFeed"
import HoldingsCard from "../components/market/holdingCards"

export default function Markets() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <StockSearchBar />
        <TotalInvestmentCard />
        <div className="flex">
          <div className="w-[70%]">
            <PerformanceChart />
          </div>
          <div>
            <HoldingsCard />
          </div>
        </div>
         <TopMovers />
         <NewsFeed />
      </div>
    </div>
  )
}