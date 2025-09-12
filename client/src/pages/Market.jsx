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
          <div className="bg-white rounded-2xl shadow-2xl shadow-yellow-200/50 p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-gradient-to-r from-yellow-100 to-white rounded-xl p-6 mb-6 shadow-lg shadow-yellow-100/50">
                <div>
                  <h1 className="text-3xl font-bold text-black mb-2">Market Dashboard</h1>
                  <p className="text-gray-700 font-medium">Your comprehensive investment overview</p>
                </div>
                <div className="w-full max-w-xs">
                  <StockSearchBar />
                </div>
              </div>

              <div className="pt-6 border-t border-yellow-100">
                <AIchat />
              </div>
            </div>
          </div>

          {/* Investment Summary + Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-white to-yellow-50 rounded-2xl shadow-2xl shadow-yellow-200/50 p-6">
              <TotalInvestmentCard />
            </div>
            <div className="bg-white rounded-2xl shadow-2xl shadow-yellow-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-100 to-white px-6 py-4 shadow-lg shadow-yellow-100/50">
                <h2 className="text-xl font-bold text-black">Performance Analytics</h2>
              </div>
              <PerformanceChart />
            </div>
          </div>

          {/* Holdings Section */}
          <div className="bg-white rounded-2xl shadow-2xl shadow-yellow-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-100 to-white px-6 py-4 shadow-lg shadow-yellow-100/50">
              <h2 className="text-xl font-bold text-black">Holdings Overview</h2>
            </div>
            <HoldingList />
          </div>

          {/* Market Movers */}
          <div className="bg-white rounded-2xl shadow-2xl shadow-yellow-200/50 p-6">
            <div className="bg-gradient-to-r from-yellow-100 to-white rounded-xl p-4 mb-6 shadow-lg shadow-yellow-100/50">
              <h2 className="text-2xl font-bold text-black">Market Activity</h2>
              <p className="text-gray-700 font-medium">Today's top performing stocks</p>
            </div>
            <TopMovers />
          </div>

          {/* Enhanced News Section */}
          <div className="bg-gradient-to-br from-black via-gray-900 to-gray-800 rounded-2xl shadow-2xl shadow-gray-500/30 overflow-hidden">
            {/* News Header */}
            <div className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-white px-8 py-6 shadow-lg shadow-yellow-100/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-black mb-2">Market News & Insights</h2>
                  <p className="text-gray-700 font-semibold">Stay informed with the latest market developments</p>
                </div>
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
