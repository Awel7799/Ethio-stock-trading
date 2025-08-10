import { useState } from 'react';
import { buyStock } from '../../../services/buyService';
import { useAuth } from '../../../context/AuthContext';

export default function BuyStockForm({ symbol, currentPrice, onSuccess }) {
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
      const data = await buyStock({
        userId: user._id,               // Pass userId here
        stockSymbol: symbol,
        quantity: Number(quantity),
        purchasePrice: Number(currentPrice),
      });

      setResult(data);
      setQuantity(1);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Buy failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <h2>Buy {symbol}</h2>

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
          <strong>Total Cost:</strong> ${isNaN(totalCost) ? '0.00' : totalCost.toFixed(2)}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: 6,
          }}
        >
          {loading ? 'Buying...' : 'Buy'}
        </button>
      </form>

      {error && <div style={{ marginTop: 12, color: 'crimson' }}><strong>Error:</strong> {error}</div>}

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
