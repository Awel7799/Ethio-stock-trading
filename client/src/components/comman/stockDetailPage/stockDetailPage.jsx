// src/components/stock/StockDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchStockDetails } from '../../../services/stockAPI';
import BuyStockForm from './BuyStockForm';
import { ArrowLeft, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import StockChart from './stockChart';
import StockPortfolioCard from './StockPortfolioCard';
import NewsFeed from '../../market/newsFeed';

export default function StockDetailPage() {
  const [refreshFlag, setRefreshFlag] = useState(0);
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSuccess = () => {
    setRefreshFlag((f) => f + 1);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const data = await fetchStockDetails(symbol);
        
        if (data) {
          setStock({
            ...data,
            price: data.price != null ? Number(data.price) : 0,
            changesPercentage: data.changesPercentage != null ? Number(data.changesPercentage) : 0,
            change: data.change != null ? Number(data.change) : 0,
            history: Array.isArray(data.history) ? data.history : [],
            volume: data.volume || 0,
            marketCap: data.marketCap || 0,
            peRatio: data.peRatio || 0,
            high52w: data.high52w || 0,
            low52w: data.low52w || 0,
            dayHigh: data.dayHigh || 0,
            dayLow: data.dayLow || 0,
          });
        } else {
          throw new Error('No data returned');
        }
      } catch (err) {
        console.error('Failed to load stock details:', err);
        setError(err.message);
        
      } finally {
        setLoading(false);
      }
    };
    
    if (symbol) {
      loadData();
    }
  }, [symbol, refreshFlag]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-wheat-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="animate-pulse space-y-8">
            <div className="bg-wheat-100 rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-wheat-200 rounded-full"></div>
                <div className="w-16 h-16 bg-wheat-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-wheat-200 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-wheat-200 rounded w-24"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-wheat-100 rounded-3xl p-8 shadow-xl">
              <div className="h-80 bg-wheat-200 rounded-2xl"></div>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              <div className="bg-wheat-100 h-96 rounded-3xl shadow-xl"></div>
              <div className="xl:col-span-3 bg-wheat-100 h-96 rounded-3xl shadow-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-wheat-50 to-white flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl shadow-xl p-8 border border-wheat-200">
          <div className="text-black mb-6 text-lg">Failed to load stock details</div>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const priceChangePositive = stock.changesPercentage >= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-wheat-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-wheat-100 to-amber-100 rounded-2xl shadow-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-3 rounded-xl bg-wheat-200 hover:bg-wheat-300 transition-colors shadow-lg"
              >
                <ArrowLeft size={20} className="text-black" />
              </button>
              
              <div className="flex items-center gap-4">
                {stock.logo ? (
                  <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center overflow-hidden shadow-lg">
                    <img
                      src={stock.logo}
                      alt={`${stock.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-300 to-wheat-300 flex items-center justify-center text-xl font-bold text-black shadow-lg">
                    {symbol[0]}
                  </div>
                )}
                
                <div>
                  <h1 className="text-2xl font-bold text-black mb-1">{stock.name || symbol}</h1>
                  <div className="flex items-center gap-3">
                    <span className="text-lg text-gray-800 font-semibold">{symbol}</span>
                    <div className={`flex items-center px-2 py-1 rounded-lg text-xs font-semibold shadow-md ${
                      stock.marketState === 'Open' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-1 ${
                        stock.marketState === 'Open' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      {stock.marketState || 'Closed'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-gradient-to-r from-amber-200 to-wheat-200 rounded-xl p-3 shadow-lg">
                <p className="text-amber-900 text-sm">
                  <strong>Demo Mode:</strong> Real-time data unavailable
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Price Overview & Chart Section - Combined Container */}
        <div className="bg-gradient-to-br from-amber-50 to-wheat-100 rounded-2xl shadow-2xl p-6">
          <div className="grid grid-cols-1 xl:grid-cols-7 gap-6">
            {/* Price Info - Left Side - Smaller */}
            <div className="xl:col-span-2">
              <div className="bg-gradient-to-br from-wheat-100 to-amber-50 rounded-xl shadow-xl p-4">
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-black mb-2">
                      ${stock.price.toFixed(2)}
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`flex items-center px-3 py-2 rounded-lg text-sm font-semibold shadow-lg ${
                        priceChangePositive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {priceChangePositive ? (
                          <TrendingUp size={16} className="mr-1" />
                        ) : (
                          <TrendingDown size={16} className="mr-1" />
                        )}
                        {priceChangePositive ? '+' : ''}
                        ${Math.abs(stock.change || 0).toFixed(2)} ({stock.changesPercentage.toFixed(2)}%)
                      </div>
                    </div>
                    <div className="text-xs text-gray-700 mb-4">24h Change</div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-gradient-to-r from-wheat-200 to-amber-100 rounded-lg p-3 shadow-lg">
                      <div className="text-gray-700 text-xs mb-1">Volume</div>
                      <div className="text-sm font-bold text-black">{(stock.volume || 0).toLocaleString()}</div>
                    </div>
                    <div className="bg-gradient-to-r from-amber-100 to-wheat-200 rounded-lg p-3 shadow-lg">
                      <div className="text-gray-700 text-xs mb-1">Market Cap</div>
                      <div className="text-sm font-bold text-black">${((stock.marketCap || 0) / 1e9).toFixed(1)}B</div>
                    </div>
                    <div className="bg-gradient-to-r from-wheat-200 to-amber-100 rounded-lg p-3 shadow-lg">
                      <div className="text-gray-700 text-xs mb-1">Day Range</div>
                      <div className="text-sm font-bold text-black">${(stock.dayLow || 0).toFixed(2)} - ${(stock.dayHigh || 0).toFixed(2)}</div>
                    </div>
                    <div className="bg-gradient-to-r from-amber-100 to-wheat-200 rounded-lg p-3 shadow-lg">
                      <div className="text-gray-700 text-xs mb-1">52W Range</div>
                      <div className="text-sm font-bold text-black">${(stock.low52w || 0).toFixed(2)} - ${(stock.high52w || 0).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart - Right Side - Much Larger */}
            <div className="xl:col-span-5">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="text-black" size={20} />
                  <h3 className="text-xl font-semibold text-black">Price Chart</h3>
                </div>
                {stock.history && stock.history.length > 0 ? (
                  <div className="rounded-xl shadow-xl bg-neutral-50 p-3">
                    <div style={{ height: '400px', width: '100%' }}>
                      <StockChart history={stock.history} />
                    </div>
                  </div>
                ) : (
                  <div className="h-[350px] bg-wheat-200 rounded-xl flex items-center justify-center shadow-xl">
                    <p className="text-gray-700">Chart data unavailable</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Trading Panel */}
          <div className="xl:col-span-1">
            <div className="bg-gradient-to-br from-wheat-100 to-amber-100 shadow-2xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-wheat-200 to-amber-200 p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-black">Trade {symbol}</h3>
                  <div className="text-xs bg-black text-white px-2 py-1 rounded-lg shadow-md">Simulated</div>
                </div>
              </div>
              <div className="p-4">
                <BuyStockForm
                  onSuccess={handleSuccess}
                  symbol={symbol}
                  currentPrice={stock.price}
                />
              </div>
            </div>
          </div>

          {/* Portfolio & Info Section */}
          <div className="xl:col-span-3 space-y-8">
            <StockPortfolioCard symbol={symbol} currentPrice={stock.price} />
            
            <div className="bg-gradient-to-br from-wheat-100 to-amber-100 shadow-2xl rounded-2xl p-4">
              <h3 className="text-xl font-semibold  text-amber-700">About {stock.name}</h3>

              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-6 outline-none">
                <div className="text-center bg-gradient-to-br from-wheat-200 to-amber-200 rounded-xl p-4 shadow-lg">
                  <p className="text-xs text-gray-800 font-medium mb-1">P/E Ratio</p>
                  <p className="text-lg font-bold text-black">
                    {stock.peRatio ? stock.peRatio.toFixed(2) : 'N/A'}
                  </p>
                </div>
                <div className="text-center bg-gradient-to-br from-amber-200 to-wheat-200 rounded-xl p-4 shadow-lg">
                  <p className="text-xs text-gray-800 font-medium mb-1">Volume</p>
                  <p className="text-lg font-bold text-black">
                    {(stock.volume || 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-center bg-gradient-to-br from-wheat-200 to-amber-200 rounded-xl p-4 shadow-lg">
                  <p className="text-xs text-gray-800 font-medium mb-1">Market Cap</p>
                  <p className="text-lg font-bold text-black">
                    ${((stock.marketCap || 0) / 1e9).toFixed(1)}B
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-wheat-100 shadow-2xl rounded-2xl overflow-hidden">
              <NewsFeed symbol={symbol} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}