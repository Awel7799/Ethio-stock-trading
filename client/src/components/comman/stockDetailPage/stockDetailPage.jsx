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
        
        // Fallback with real-looking mock data
        setStock({
          symbol: symbol,
          name: `${symbol} Inc.`,
          price: Math.random() * 200 + 50, // Random price between 50-250
          changesPercentage: (Math.random() - 0.5) * 10, // Random change -5% to +5%
          change: (Math.random() - 0.5) * 20, // Random dollar change
          history: generateMockHistory(),
          description: `${symbol} is a publicly traded company.`,
          logo: null,
          marketState: 'Open',
          volume: Math.floor(Math.random() * 10000000),
          marketCap: Math.floor(Math.random() * 1000000000000),
          peRatio: Math.random() * 30 + 10,
          high52w: Math.random() * 300 + 100,
          low52w: Math.random() * 100 + 20,
          dayHigh: Math.random() * 250 + 75,
          dayLow: Math.random() * 200 + 50,
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (symbol) {
      loadData();
    }
  }, [symbol, refreshFlag]);

  const generateMockHistory = () => {
    const history = [];
    const basePrice = 150;
    let currentPrice = basePrice;
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      currentPrice += (Math.random() - 0.5) * 10;
      currentPrice = Math.max(currentPrice, 50); // Minimum price
      
      history.push({
        date: date.toISOString(),
        price: currentPrice,
        volume: Math.floor(Math.random() * 1000000)
      });
    }
    return history;
  };

  if (loading) {
    return (
      <div className="max-w-4xl ml-5 mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div>
              <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          <div className="bg-gray-200 h-64 rounded-2xl mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gray-200 h-96 rounded-2xl"></div>
            <div className="lg:col-span-2 bg-gray-200 h-96 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-gray-500 mb-4">Failed to load stock details</div>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const priceChangePositive = stock.changesPercentage >= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl ml-5 mx-auto px-4 py-6 space-y-8">
        
        {/* Enhanced Header */}
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            
            <div className="flex items-center gap-4">
              {stock.logo ? (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shadow-md">
                  <img
                    src={stock.logo}
                    alt={`${stock.name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {symbol[0]}
                </div>
              )}
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{stock.name || symbol}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-lg text-gray-600 font-semibold">{symbol}</span>
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                    stock.marketState === 'Open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
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
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-sm">
                <strong>Demo Mode:</strong> Real-time data unavailable
              </p>
            </div>
          )}
        </div>

        {/* Enhanced Price Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-5xl font-bold mb-4">
                  ${stock.price.toFixed(2)}
                </div>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center px-4 py-2 rounded-full text-lg font-semibold ${
                    priceChangePositive ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
                  }`}>
                    {priceChangePositive ? (
                      <TrendingUp size={20} className="mr-2" />
                    ) : (
                      <TrendingDown size={20} className="mr-2" />
                    )}
                    {priceChangePositive ? '+' : ''}
                    ${Math.abs(stock.change || 0).toFixed(2)} ({stock.changesPercentage.toFixed(2)}%)
                  </div>
                  <div className="text-sm text-white/70">24h Change</div>
                </div>
              </div>
              
              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white/70">Volume</div>
                  <div className="font-bold">{(stock.volume || 0).toLocaleString()}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white/70">Market Cap</div>
                  <div className="font-bold">${((stock.marketCap || 0) / 1e9).toFixed(1)}B</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white/70">Day Range</div>
                  <div className="font-bold">${(stock.dayLow || 0).toFixed(2)} - ${(stock.dayHigh || 0).toFixed(2)}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white/70">52W Range</div>
                  <div className="font-bold">${(stock.low52w || 0).toFixed(2)} - ${(stock.high52w || 0).toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="text-gray-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Price Chart</h3>
            </div>
            {stock.history && stock.history.length > 0 ? (
              <StockChart history={stock.history} />
            ) : (
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Chart data unavailable</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Trading Panel */}
          <div className="xl:col-span-1">
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Trade {symbol}</h3>
                  <div className="text-xs bg-white/20 px-2 py-1 rounded">Simulated</div>
                </div>
              </div>
              <div className="p-6">
                <BuyStockForm
                  onSuccess={handleSuccess}
                  symbol={symbol}
                  currentPrice={stock.price}
                />
              </div>
            </div>
          </div>

          {/* Portfolio & Info */}
          <div className="xl:col-span-2 space-y-8">
            <StockPortfolioCard symbol={symbol} currentPrice={stock.price} />
            
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">About {stock.name}</h3>
              <p className="text-gray-600 leading-relaxed">
                {stock.description || `${stock.name || symbol} is a publicly traded company. Real-time company information is currently unavailable.`}
              </p>
              
              {/* Additional Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-sm text-gray-500 font-medium">P/E Ratio</p>
                  <p className="text-lg font-bold text-gray-900">
                    {stock.peRatio ? stock.peRatio.toFixed(2) : 'N/A'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 font-medium">Volume</p>
                  <p className="text-lg font-bold text-gray-900">
                    {(stock.volume || 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 font-medium">Market Cap</p>
                  <p className="text-lg font-bold text-gray-900">
                    ${((stock.marketCap || 0) / 1e9).toFixed(1)}B
                  </p>
                </div>
              </div>
            </div>
            
            <NewsFeed symbol={symbol} />
          </div>
        </div>
      </div>
    </div>
  );
}