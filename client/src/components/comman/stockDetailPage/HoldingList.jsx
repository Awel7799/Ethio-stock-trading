import { useEffect, useState } from 'react';
import { getHoldings, deleteHolding } from '../../../services/holdings';

export default function HoldingList({ onEdit }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const fetchAll = async () => {
    setErr(null);
    try {
      const data = await getHoldings();
      setList(data);
    } catch (e) {
      setErr(e.payload?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this holding?')) return;
    try {
      await deleteHolding(id);
      fetchAll();
    } catch (e) {
      alert(e.payload?.error || e.message);
    }
  };

  if (loading) return <p className="text-center py-4">Loading...</p>;
  if (err)
    return (
      <div className="text-red-600 px-4 py-2 bg-red-50 rounded">{err}</div>
    );

  if (!list.length)
    return <p className="text-center py-4">No holdings yet.</p>;

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-4">
      {list.map((h) => (
        <div
          key={h._id}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-gray-50 border rounded-xl p-4 shadow-sm"
        >
          <div className="flex-1">
            <div className="font-semibold">
              {h.stockSymbol} &middot; {h.quantity} shares
            </div>
            <div className="text-sm text-gray-600">
              Price: ${h.purchasePrice} on{' '}
              {new Date(h.purchaseDate).toLocaleDateString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Owner: {h.userId}
            </div>
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              onClick={() => onEdit && onEdit(h)}
              className="px-3 py-1 bg-yellow-400 rounded-md text-sm hover:brightness-105"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(h._id)}
              className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:brightness-110"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}