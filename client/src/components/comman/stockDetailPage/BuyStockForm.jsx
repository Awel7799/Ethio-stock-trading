// src/components/BuyStockForm.jsx
import { useState } from 'react';
import { buyStock } from '../../../services/buyService';

export default function BuyStockForm() {
  const [stockSymbol, setStockSymbol] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    // Basic client-side validation
    if (!stockSymbol.trim()) {
      setError('Stock symbol is required.');
      return;
    }
    if (quantity <= 0) {
      setError('Quantity must be at least 1.');
      return;
    }
    if (purchasePrice <= 0 || isNaN(purchasePrice)) {
      setError('Valid purchase price is required.');
      return;
    }

    setLoading(true);
    try {
      const data = await buyStock({
        stockSymbol: stockSymbol.trim(),
        quantity: Number(quantity),
        purchasePrice: Number(purchasePrice),
        // userId: 'optional-objectid-if-you-want-to-supply', 
      });
      setResult(data);
      setStockSymbol('');
      setQuantity(1);
      setPurchasePrice('');
    } catch (err) {
      setError(err.message || 'Buy failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h2>Buy Stock</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <div>
          <label>
            Stock Symbol
            <input
              type="text"
              value={stockSymbol}
              onChange={(e) => setStockSymbol(e.target.value)}
              placeholder="e.g. AAPL"
              required
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>
        </div>

        <div>
          <label>
            Quantity
            <input
              type="number"
              value={quantity}
              min={1}
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
              step="0.01"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="e.g. 150.25"
              required
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>
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
          <p>
            Bought <strong>{result.holding.quantity}</strong> of{' '}
            <strong>{result.holding.stockSymbol}</strong> at average price{' '}
            <strong>{result.holding.purchasePrice.toFixed(2)}</strong>.
          </p>
          <p>
            Remaining simulated balance:{' '}
            <strong>{result.availableBalance.toFixed(2)}</strong>
          </p>
          <pre style={{ background: '#efefef', padding: 8, borderRadius: 4, overflow: 'auto' }}>
            {JSON.stringify(result.holding, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
