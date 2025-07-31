import { useState } from "react";

function PersonalInfo() {
  const [form, setForm] = useState({
    name: "",
    dob: "",
    address: "",
    phone: "",
    email: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError("Name and Email are required");
      return;
    }
    setError("");
    alert("Personal info saved");
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Personal Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" type="text" placeholder="Full legal name" onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="dob" type="date" onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="address" type="text" placeholder="Residential address" onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="phone" type="tel" placeholder="+251..." onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full border p-2 rounded" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="bg-black text-white px-4 py-2 rounded shadow">
          Save
        </button>
      </form>
    </div>
  );
}

export default PersonalInfo;
