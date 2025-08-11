import { useState } from 'react';
import { buyStock } from '../../../services/buyService';
import { sellStock } from '../../../services/sellService'; // Create this service similar to buyStock
import { useAuth } from '../../../context/AuthContext';

export default function TradeStockForm({ symbol, currentPrice, onSuccess }) {
  const [mode, setMode] = useState('buy'); // 'buy' or 'sell'
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const isBuy = mode === 'buy';
  const totalCost = quantity * currentPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!user || !user._id) {
      setError('User not authenticated');
      return;
    }
    if (quantity < 1) {
      setError('Quantity must be at least 1.');
      return;
    }

    setLoading(true);
    try {
      let data;
      if (isBuy) {
        data = await buyStock({
          userId: user._id,
          stockSymbol: symbol,
          quantity: Number(quantity),
          purchasePrice: Number(currentPrice),
        });
      } else {
        data = await sellStock({
          userId: user._id,
          stockSymbol: symbol,
          quantity: Number(quantity),
          sellPrice: Number(currentPrice),
        });
      }

      setResult(data);
      setQuantity(1);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || `${isBuy ? 'Buy' : 'Sell'} failed`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Toggle Buttons */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <button
          type="button"
          onClick={() => setMode('buy')}
          style={{
            flex: 1,
            padding: '8px',
            background: isBuy ? '#2563eb' : '#f0f0f0',
            color: isBuy ? 'white' : 'black',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setMode('sell')}
          style={{
            flex: 1,
            padding: '8px',
            background: !isBuy ? '#dc2626' : '#f0f0f0',
            color: !isBuy ? 'white' : 'black',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Sell
        </button>
      </div>

      <h2>{isBuy ? 'Buy' : 'Sell'} {symbol}</h2>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, marginTop: 8 }}>
        <label>
          Quantity
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>

        <label>
          Price per Unit
          <input
            type="number"
            value={currentPrice}
            disabled
            style={{ width: '100%', padding: 8, marginTop: 4, backgroundColor: '#f0f0f0' }}
          />
        </label>

        <div>
          <strong>{isBuy ? 'Total Cost' : 'Total Value'}:</strong> $
          {isNaN(totalCost) ? '0.00' : totalCost.toFixed(2)}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            background: isBuy ? '#2563eb' : '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: 6,
          }}
        >
          {loading ? (isBuy ? 'Buying...' : 'Selling...') : (isBuy ? 'Buy' : 'Sell')}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: 12, color: 'crimson' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            border: '1px solid #ccc',
            borderRadius: 6,
            background: '#f9f9f9',
          }}
        >
          <h4>Success!</h4>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
