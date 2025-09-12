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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section with Search and AI */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-yellow-200 p-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-100 to-white rounded-xl p-6 mb-6">
                <h1 className="text-3xl font-bold text-black mb-2">Market Dashboard</h1>
                <p className="text-gray-700 font-medium">Your comprehensive investment overview</p>
              </div>
              
              <StockSearchBar />
              
              <div className="border-t-2 border-yellow-100 pt-6">
                <AIchat />
              </div>
            </div>
          </div>

          {/* Investment Summary */}
          <div className="bg-gradient-to-r from-white to-yellow-50 rounded-2xl shadow-xl border-2 border-yellow-200 p-6">
            <TotalInvestmentCard />
          </div>

          {/* Chart and Holdings Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border-2 border-yellow-200 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-100 to-white px-6 py-4 border-b-2 border-yellow-200">
                <h2 className="text-xl font-bold text-black">Performance Analytics</h2>
              </div>
              <PerformanceChart />
            </div>
            
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl border-2 border-yellow-200 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-100 to-white px-6 py-4 border-b-2 border-yellow-200">
                <h2 className="text-xl font-bold text-black">Holdings Overview</h2>
              </div>
              <HoldingList />
            </div>
          </div>

          {/* Market Movers */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-yellow-200 p-6">
            <div className="bg-gradient-to-r from-yellow-100 to-white rounded-xl p-4 mb-6">
              <h2 className="text-2xl font-bold text-black">Market Activity</h2>
              <p className="text-gray-700 font-medium">Today's top performing stocks</p>
            </div>
            <TopMovers />
          </div>

          {/* Enhanced News Section */}
          <div className="bg-gradient-to-br from-black via-gray-900 to-gray-800 rounded-2xl shadow-2xl border-2 border-yellow-300 overflow-hidden">
            {/* News Header */}
            <div className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-white px-8 py-6 border-b-2 border-yellow-300">
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
                  <span className="text-yellow-100 font-bold text-sm tracking-wide">POWERED BY PROFESSIONAL MARKET ANALYSIS</span>
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