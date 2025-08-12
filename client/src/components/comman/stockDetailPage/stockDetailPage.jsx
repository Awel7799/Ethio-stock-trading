import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchStockDetails } from '../../../services/stockAPI';
import BuyStockForm from './BuyStockForm';
import { ArrowLeft } from 'lucide-react';
import StockChart from './stockChart';
import StockPortfolioCard from './StockPortfolioCard';
import NewsFeed from '../../market/newsFeed';
export default function StockDetailPage() {
  const [editTarget, setEditTarget] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const navigate = useNavigate();

  const handleSuccess = () => {
    setEditTarget(null);
    setRefreshFlag((f) => f + 1);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchStockDetails(symbol);
        setStock(data);
      } catch (err) {
        console.error('Failed to load stock details:', err);
      }
    };
    loadData();
  }, [symbol, refreshFlag]);

  if (!stock) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading stock details...</div>
      </div>
    );
  }

  const priceChangePositive = Number(stock.changesPercentage) >= 0;
  const formattedPrice = Number(stock.price).toFixed(2);
  const formattedChange = Number(stock.changesPercentage).toFixed(2);

  return (
    <div className="max-w-4xl ml-5 mx-auto px-4 py-6 space-y-6">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          {stock.logo ? (
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={stock.logo}
                alt={`${stock.name} logo`}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold">
              {symbol[0]}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold">{stock.name}</h1>
            <div className="text-sm text-gray-500 uppercase">{symbol}</div>
          </div>
        </div>
      </div>

      {/* Price card */}
      <div className="bg-transparent rounded-2xl p-6 block flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col">
          <div className="text-4xl font-bold">${formattedPrice}</div>
          <div className="flex items-center gap-2 mt-3">
            <div
              className={`text-sm mb-5 font-medium ${
                priceChangePositive ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {priceChangePositive ? '+' : ''}
              {formattedChange}%
            </div>
            <div className="text-xs text-gray-400">24h</div>
          </div>
        </div>

        {/* Chart area */}
        <div className="flex-1">
          <StockChart history={stock.history || []} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-xs text-gray-500">Market status</div>
          <div className="text-sm font-semibold">{stock.marketState || 'Open'}</div>
        </div>
      </div>

      {/* Action area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Buy form */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">Buy {symbol}</div>
              <div className="text-xs text-gray-400">Simulated</div>
            </div>
            <BuyStockForm
              onSuccess={handleSuccess}
              symbol={symbol}
              currentPrice={Number(stock.price)}
            />
          </div>
        </div>

        {/* Right: Portfolio + About */}
        <div className="lg:col-span-2 space-y-6">
          <StockPortfolioCard symbol={symbol} currentPrice={Number(stock.price)} />
          <div className="bg-white shadow rounded-2xl p-5">
            <div className="text-lg font-semibold mb-2">About {stock.name}</div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {stock.description || 'No description available.'}
            </p>
          </div>
        </div>
        <NewsFeed />
      </div>
    </div>
  );
}
