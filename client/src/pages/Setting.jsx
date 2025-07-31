import Button from "../components/comman/Button";
import Sidebar from "../components/setting/Sidebar";
import PersonalInfo from "../components/setting/PersonalInfo";
import Profile from "../components/setting/Profile";
import Security from "../components/setting/Security";
import VerifyKYC from "../components/setting/VerifyKYC";
import { useState } from "react";

export default function Setting() {
  const [activeSection, setActiveSection] = useState("Profile");

  const renderSection = () => {
    switch (activeSection) {
      case "Profile":
        return <Profile />;
      case "PersonalInfo":
        return <PersonalInfo />;
      case "Security":
        return <Security />;
      case "VerifyKYC":
        return <VerifyKYC />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-black">
      <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} />
      <div className="flex-1 p-8 shadow-inner">{renderSection()}</div>
    </div>
  );
}
