import { useState } from "react";

function Security() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    alert("Security settings updated");
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Security</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Set password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input type="text" placeholder="2FA Authentication Code" className="w-full border p-2 rounded" />
        <select className="w-full border p-2 rounded">
          <option value="">Select Bank</option>
          <optgroup label="International">
            <option value="bank">Bank Account</option>
            <option value="card">Credit/Debit Card</option>
            <option value="paypal">PayPal</option>
          </optgroup>
          <optgroup label="Ethiopian Banks">
            <option value="cbe">CBE</option>
            <option value="awash">Awash</option>
            <option value="dashen">Dashen</option>
            <option value="nib">NIB</option>
            <option value="boa">Bank of Abyssinia</option>
          </optgroup>
        </select>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="bg-black text-white px-4 py-2 rounded shadow">
          Save
        </button>
      </form>
    </div>
  );
}

export default Security;
