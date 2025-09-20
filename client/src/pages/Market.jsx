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
    <div className="min-h-screen bg-gradient-to-br from-yellow-25 via-white to-yellow-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section with Search and AI */}
              <div className="flex items-center justify-between w-fit p-8 m-auto rounded-xl  shadow-lg shadow-yellow-100/50">
                  <StockSearchBar />
              </div>
         

          {/* Investment Summary + Chart */}
          <div className="flex  gap-12">
            <div className="bg-gradient-to-r from-white w-fit to-yellow-50 rounded-2xl shadow-2xl shadow-yellow-200/50 p-4">
              <TotalInvestmentCard />
            </div>
            <div className="bg-white rounded-2xl shadow-2xl mr-20 w-[95vw] shadow-yellow-200/50 overflow-hidden">
              
              <PerformanceChart />
            </div>
          </div>

          {/* Holdings Section */}
         

          {/* Market Movers */}
          <div className="bg-white rounded-2xl shadow-2xl  shadow-yellow-200/50 p-6">
            <TopMovers />
          </div>

          {/* Enhanced News Section */}
          <div className="bg-gradient-to-br from-black via-gray-900 to-gray-800 rounded-2xl shadow-2xl shadow-gray-500/30 overflow-hidden">
            {/* News Header */}
            <div className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-white px-8 py-6 shadow-lg shadow-yellow-100/50">
              <div className="flex items-center justify-between">
                
                <div className="hidden md:flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                  <span className="text-sm font-bold text-black bg-yellow-100 px-3 py-1 rounded-full">Live Updates</span>
                </div>
              </div>
            </div>
            
            {/* News Content Container */}
            <div className="bg-white p-6">
              <NewsFeed />
            </div>
            
            {/* News Footer */}
            <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 px-8 py-5">
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-yellow-100 font-bold text-sm tracking-wide">Real-time Market Intelligence</span>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
