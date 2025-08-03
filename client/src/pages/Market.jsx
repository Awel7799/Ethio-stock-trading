import StockSearchBar from "../components/market/stockSearchBar"
import TotalInvestmentCard from "../components/market/totalBalance"
import PerformanceChart from "../components/market/performanceChart"
import TopMovers from "../components/market/topMover"
import NewsFeed from "../components/market/newsFeed"
import HoldingsCard from "../components/market/holdingCards"
import StockDetailPage from "../components/comman/stockDetailPage/stockDetailPage"


export default function Markets() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto ">
        <StockSearchBar />
        <TotalInvestmentCard userId="688ef237d6f78a73a12b002c" />
        <div className="flex">
          <div className="w-[65%]">
            <PerformanceChart />
          </div>
          <div className="w-[30%]">
            <HoldingsCard />
          </div>
        </div>
         <TopMovers />
         <NewsFeed />
      </div>
    </div>
  )
}