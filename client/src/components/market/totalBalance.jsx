import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // make sure this path is correct

const formatCurrency = (n) => {
  if (n == null || isNaN(n)) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(n);
};

const formatPercent = (n) => {
  if (n == null || isNaN(n)) return '-';
  return `${Math.abs(n).toFixed(2)}%`;
};

const TotalInvestmentCard = () => {
  const { user } = useAuth(); // 🔹 get user from AuthContext
  const userId = user?._id;   // 🔹 safely extract userId

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch(`http://localhost:3000/api/investments/user/${userId}`);
        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(`Fetch failed: ${resp.status} ${text}`);
        }
        const data = await resp.json();
        if (!cancelled) setSummary(data);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSummary();
    const interval = setInterval(fetchSummary, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [userId]);

  const totalInvested = summary?.totalInvested ?? 0;
  const totalCurrentValue = summary?.totalCurrentValue ?? 0;
  const gainLoss = summary?.totalGainLoss || { dollar: 0, percent: 0 };
  const positive = gainLoss.dollar >= 0;

  return (
    <div className="bg-transparent p-6 w-full max-w-md mx-auto rounded-2xl mb-15 mt-10 ml-0">
      {loading && <p className="text-sm text-gray-500 mt-2">Loading...</p>}
      {error && (
        <p className="text-sm text-red-600 mt-2">
          Error: {error}
        </p>
      )}

      {!loading && !error && summary && (
        <>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Total Invested</p>
            <p className="text-lg font-medium">{formatCurrency(totalInvested)}</p>
          </div>

          <div className="mt-2">
            <p className="text-sm text-gray-500">Current Value</p>
            <p className="text-lg font-medium">{formatCurrency(totalCurrentValue)}</p>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <p className="text-2xl font-bold">
              {formatCurrency(gainLoss.dollar)}
            </p>
            <p
              className={`text-sm font-medium ${
                positive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              ({positive ? '+' : '-'}
              {formatPercent(gainLoss.percent)})

            </p>
          </div>

          <p className="text-sm mt-1">
            {positive ? 'Gain' : 'Loss'} {positive ? '▲' : '▼'}
          </p>
        </>
      )}

      {!summary && !loading && !error && (
        <p className="text-sm text-gray-500 mt-2">No investment data available.</p>
      )}
    </div>
  );
};

export default TotalInvestmentCard;
