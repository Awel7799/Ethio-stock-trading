import { useState } from 'react';
import {
  createHolding,
  updateHolding
} from '../../../services/holdings';

const initial = {
  userId: '',
  stockSymbol: '',
  purchasePrice: '',
  quantity: '',
  purchaseDate: ''
};

export default function HoldingForm({ existingHolding, onSuccess }) {
  const [form, setForm] = useState(
    existingHolding
      ? {
          ...existingHolding,
          purchasePrice: existingHolding.purchasePrice,
          quantity: existingHolding.quantity,
          purchaseDate: new Date(existingHolding.purchaseDate).toISOString().slice(0, 10)
        }
      : initial
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Normalize types
      const payload = {
        userId: form.userId,
        stockSymbol: form.stockSymbol.toUpperCase(),
        purchasePrice: parseFloat(form.purchasePrice),
        quantity: parseInt(form.quantity, 10),
        purchaseDate: new Date(form.purchaseDate)
      };

      let result;
      if (existingHolding && existingHolding._id) {
        result = await updateHolding(existingHolding._id, payload);
      } else {
        result = await createHolding(payload);
      }

      onSuccess && onSuccess(result);
      setForm(initial);
    } catch (err) {
      setError(err.payload?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">
        {existingHolding ? 'Edit Holding' : 'New Holding'}
      </h2>
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-3">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            User ID
          </label>
          <input
            name="userId"
            value={form.userId}
            onChange={handleChange}
            required
            placeholder="64c7f91cdd491d340fb5f491"
            className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Stock Symbol
          </label>
          <input
            name="stockSymbol"
            value={form.stockSymbol}
            onChange={handleChange}
            required
            placeholder="AAPL"
            className="w-full border rounded-xl px-3 py-2 uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Purchase Price
            </label>
            <input
              name="purchasePrice"
              type="number"
              step="0.01"
              value={form.purchasePrice}
              onChange={handleChange}
              required
              placeholder="150.25"
              className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Quantity
            </label>
            <input
              name="quantity"
              type="number"
              min="1"
              value={form.quantity}
              onChange={handleChange}
              required
              placeholder="10"
              className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Purchase Date
          </label>
          <input
            name="purchaseDate"
            type="date"
            value={form.purchaseDate}
            onChange={handleChange}
            required
            className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-xl shadow transition disabled:opacity-50"
        >
          {loading
            ? existingHolding
              ? 'Updating...'
              : 'Creating...'
            : existingHolding
            ? 'Update Holding'
            : 'Create Holding'}
        </button>
      </form>
    </div>
  );
}
