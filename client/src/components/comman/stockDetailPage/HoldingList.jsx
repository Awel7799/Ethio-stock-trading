import { useEffect, useState } from "react";
import { getHoldings } from "../../../services/holdings";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function HoldingList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchAll = async () => {
    setErr(null);
    if (!user?._id) {
      setErr("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      const data = await getHoldings(user._id);
      setList(data || []);
    } catch (e) {
      setErr(e.payload?.error || e.message || "Failed to fetch holdings");
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
          {list.map((h) => {
            const symbol = h.stockSymbol || "N/A";
            const quantity = h.quantity != null ? h.quantity : 0;
            const price =
              h.purchasePrice != null ? Number(h.purchasePrice).toFixed(2) : "N/A";
            const purchaseDate = h.purchaseDate
              ? new Date(h.purchaseDate).toLocaleDateString()
              : "N/A";

            return (
              <tr
                key={h._id}
                onClick={() => navigate(`/stock/${symbol}`)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <td className="py-3 px-4 font-semibold">{symbol}</td>
                <td className="py-3 px-4">{quantity}</td>
                <td className="py-3 px-4">${price}</td>
                <td className="py-3 px-4">{purchaseDate}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
