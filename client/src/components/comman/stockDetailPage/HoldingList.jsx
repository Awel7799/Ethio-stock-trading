import { useEffect, useState } from 'react';
import { getHoldings } from '../../../services/holdings';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; // import your AuthContext

export default function HoldingList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth(); // get user from AuthContext

  const fetchAll = async () => {
  setErr(null);
  console.log('User:', user);
  if (!user?._id) {
    setErr('User not authenticated');
    setLoading(false);
    return;
  }
  

    try {
      // Pass userId as a parameter to getHoldings service
      const data = await getHoldings(user._id);
      setList(data);
    } catch (e) {
      setErr(e.payload?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [user?._id]);

  if (loading) return <p className="text-center py-4">Loading...</p>;
  if (err)
    return (
      <div className="text-red-600 px-4 py-2 bg-red-50 rounded">{err}</div>
    );

  if (!list.length) return <p className="text-center py-4">No holdings yet.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-6 p-4 bg-white rounded-lg shadow">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="py-3 px-4 text-gray-600">Symbol</th>
            <th className="py-3 px-4 text-gray-600">Shares</th>
            <th className="py-3 px-4 text-gray-600">Avg. Price</th>
            <th className="py-3 px-4 text-gray-600">Purchase Date</th>
          </tr>
        </thead>
        <tbody>
          {list.map((h) => (
            <tr
              key={h._id}
              onClick={() => navigate(`/stock/${h.stockSymbol}`)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <td className="py-3 px-4 font-semibold">{h.stockSymbol}</td>
              <td className="py-3 px-4">{h.quantity}</td>
              <td className="py-3 px-4">${Number(h.purchasePrice).toFixed(2)}</td>
              <td className="py-3 px-4">
                {new Date(h.purchaseDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
