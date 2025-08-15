import { useState } from "react";
import { buyStock } from "../../../services/buyService";
import { sellStock } from "../../../services/sellService";
import { useAuth } from "../../../context/AuthContext";

export default function TradeStockForm({ symbol, currentPrice, onSuccess }) {
  const [mode, setMode] = useState("buy");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const isBuy = mode === "buy";
  const totalCost = quantity * currentPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!user || !user._id) {
      setError("You must be logged in to trade.");
      return;
    }
    if (quantity < 1) {
      setError("Quantity must be at least 1.");
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

      setResult({
        message: `${isBuy ? "Purchase" : "Sale"} successful!`,
        ...data,
      });
      setQuantity(1);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || `${isBuy ? "Buy" : "Sell"} failed`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        background: "white",
        padding: 16,
        borderRadius: 8,
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        maxWidth: 400,
        margin: "0 auto",
      }}
    >
      {/* Toggle Buttons */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => setMode("buy")}
          style={{
            flex: 1,
            padding: "8px",
            background: isBuy ? "#2563eb" : "#e5e7eb",
            color: isBuy ? "white" : "#111",
            border: "none",
            borderRadius: 6,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setMode("sell")}
          style={{
            flex: 1,
            padding: "8px",
            background: !isBuy ? "#dc2626" : "#e5e7eb",
            color: !isBuy ? "white" : "#111",
            border: "none",
            borderRadius: 6,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Sell
        </button>
      </div>

      <h2 style={{ marginBottom: 12 }}>
        {isBuy ? "Buy" : "Sell"} {symbol}
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: 12, marginTop: 8 }}
      >
        <label>
          Quantity
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 8,
              marginTop: 4,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </label>

        <label>
          Price per Unit
          <input
            type="number"
            value={currentPrice}
            disabled
            style={{
              width: "100%",
              padding: 8,
              marginTop: 4,
              backgroundColor: "#f0f0f0",
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />
        </label>

        <div style={{ fontWeight: 600 }}>
          {isBuy ? "Total Cost" : "Total Value"}: $
          {isNaN(totalCost) ? "0.00" : totalCost.toFixed(2)}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 16px",
            cursor: loading ? "not-allowed" : "pointer",
            background: isBuy ? "#2563eb" : "#dc2626",
            color: "white",
            border: "none",
            borderRadius: 6,
            fontWeight: 600,
          }}
        >
          {loading
            ? isBuy
              ? "Buying..."
              : "Selling..."
            : isBuy
            ? "Buy"
            : "Sell"}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div
          style={{
            marginTop: 16,
            padding: 10,
            background: "#fee2e2",
            color: "#b91c1c",
            borderRadius: 6,
            fontWeight: 500,
          }}
        >
          ❌ {error}
        </div>
      )}

      {/* Success Message */}
      {result && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: "#dcfce7",
            color: "#166534",
            borderRadius: 6,
            fontWeight: 500,
          }}
        >
          ✅ {result.message}
        </div>
      )}
    </div>
  );
}
