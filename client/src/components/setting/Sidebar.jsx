function Sidebar({ setActiveSection, activeSection }) {
  const navItem = [
    { id: "Profile", label: "Profile" },
    { id: "PersonalInfo", label: "Personal Info" },
    { id: "Security", label: "Security" },
    { id: "VerifyKYC", label: "Verify KYC" },
  ];

  return (
    <div className="w-64 bg-white border-r shadow-md p-6">
      <h2 className="text-lg font-bold mb-4">Settings</h2>
      <ul>
        {navItem.map((item) => (
          <li
            key={item.id}
            className={`cursor-pointer p-2 rounded mb-2 transition ${
              activeSection === item.id
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveSection(item.id)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
