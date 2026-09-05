// src/components/common/stcoDetailPage/HoldinngList.jsx
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

  if (loading)
    return <p className="text-center py-6 text-black text-lg">Loading...</p>;
  if (err)
    return (
      <div className="text-red-700 px-4 py-3 bg-wheat-light rounded text-center">
        {err}
      </div>
    );
  if (!list.length)
    return (
      <p className="text-center py-6 text-black text-lg">
        No holdings yet.
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-4">
      {list.map((h) => {
        const symbol = h.stockSymbol || "N/A";
        const quantity = h.quantity != null ? h.quantity : 0;
        const price =
          h.purchasePrice != null ? Number(h.purchasePrice).toFixed(2) : "N/A";
        const purchaseDate = h.purchaseDate
          ? new Date(h.purchaseDate).toLocaleDateString()
          : "N/A";

        return (
          <div
            key={h._id}
            onClick={() => navigate(`/stock/${symbol}`)}
            className="cursor-pointer bg-gradient-to-l from-orange-200  to-yellow-50 shadow-md rounded-xl p-6 hover:shadow-lg transition duration-300 flex justify-between items-center border border-[#F5DEB3]"
          >
            {/* Left Section */}
            <div>
              <h3 className="text-black text-xl font-bold">{symbol}</h3>
              <p className="text-black text-sm mt-1">Purchased on: {purchaseDate}</p>
            </div>

            {/* Right Section */}
            <div className="flex space-x-6 items-center">
              <div className="text-center">
                <p className="text-black font-semibold">{quantity}</p>
                <p className="text-sm text-black/70">Shares</p>
              </div>
              <div className="text-center">
                <p className="text-black font-semibold">${price}</p>
                <p className="text-sm text-black/70">Avg. Price</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
