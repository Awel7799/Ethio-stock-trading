import { useState, useEffect } from 'react';
import { buyStock } from '../../../services/buyService';
import { useAuth } from '../../../context/AuthContext';

export default function BuyStockForm({ symbol, currentPrice, onSuccess }) {
  const [mode, setMode] = useState('buy'); // 'buy' or 'sell'
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const { user } = useAuth(); // ✅ Get user from AuthContext

  const isBuy = mode === 'buy';

  const totalCost = quantity * currentPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!user?._id) {
      setError('User not authenticated');
      return;
    }

    if (quantity <= 0) {
      setError('Quantity must be at least 1.');
      return;
    }

    setLoading(true);
    try {
      let data;
      if (isBuy) {
        data = await buyStock({
          stockSymbol: symbol,
          quantity: Number(quantity),
          purchasePrice: Number(currentPrice),
          userId: user._id,
        });
      } else {
        data = await sellStock({
          stockSymbol: symbol,
          quantity: Number(quantity),
          sellPrice: Number(currentPrice),
          userId: user._id,
        });
      }

      setResult(data);
      setQuantity(1);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || (isBuy ? 'Buy failed' : 'Sell failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h2 style={{ margin: 0 }}>{isBuy ? 'Buy' : 'Sell'} {symbol}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setMode('buy')}
            disabled={mode === 'buy'}
            style={{
              padding: '6px 12px',
              cursor: mode === 'buy' ? 'default' : 'pointer',
              background: mode === 'buy' ? '#2563eb' : '#f0f0f0',
              color: mode === 'buy' ? 'white' : '#333',
              border: 'none',
              borderRadius: 4,
            }}
          >
            Buy
          </button>
          <button
            onClick={() => setMode('sell')}
            disabled={mode === 'sell'}
            style={{
              padding: '6px 12px',
              cursor: mode === 'sell' ? 'default' : 'pointer',
              background: mode === 'sell' ? '#dc2626' : '#f0f0f0',
              color: mode === 'sell' ? 'white' : '#333',
              border: 'none',
              borderRadius: 4,
            }}
          >
            Sell
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, marginTop: 8 }}>
        <div>
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
        </div>

        <div>
          <label>
            Price per Unit
            <input
              type="number"
              value={currentPrice}
              disabled
              style={{ width: '100%', padding: 8, marginTop: 4, backgroundColor: '#f0f0f0' }}
            />
          </label>
        </div>

        <div>
          <strong>Total Cost:</strong> ${isNaN(totalCost) ? '0.00' : totalCost.toFixed(2)}
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
          {loading ? (isBuy ? 'Buying...' : 'Selling...') : isBuy ? 'Buy' : 'Sell'}
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
          
          
        </div>
      )}
    </div>
  );
}
