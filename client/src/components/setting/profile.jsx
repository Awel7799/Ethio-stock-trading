import { useState } from "react";

function Profile() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    setError("");
    alert("Profile updated");
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-semibold">Set Photo</label>
          <input type="file" className="block mt-1" />
        </div>
        <div>
          <label className="font-semibold">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border p-2 rounded"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <div>
          <label className="font-semibold">Theme</label>
          <input type="color" className="block mt-1" />
        </div>
        <div>
          <label className="font-semibold">Language</label>
          <input type="text" className="w-full border p-2 rounded" />
        </div>
        <button type="submit" className="bg-black text-white px-4 py-2 rounded shadow">
          Save
        </button>
      </form>
    </div>
  );
}

export default Profile;
