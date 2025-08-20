import StockSearchBar from "../components/market/stockSearchBar";
import TotalInvestmentCard from "../components/market/totalBalance";
import PerformanceChart from "../components/market/performanceChart";
import TopMovers from "../components/market/topMover";
import NewsFeed from "../components/market/newsFeed";
import HoldingsCard from "../components/market/holdingCards";
import HoldingList from "../components/comman/stockDetailPage/HoldingList";
import AIchat from "../components/AIChatBox/AIchat";
export default function Markets() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Search and Summary */}
        <StockSearchBar />
        <AIchat />
        <TotalInvestmentCard />

        {/* Chart and Holdings */}
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          <div className="md:w-2/3">
            <PerformanceChart />
          </div>
          <div className="md:w-1/3">
            <HoldingList />
          </div>
        </div>

        {/* Movers and News */}
        <TopMovers />
        <NewsFeed />
      </div>
    </div>
  );
}
