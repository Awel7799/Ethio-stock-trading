import { ChevronDown } from "lucide-react"
import { useState } from "react"
import PersonalInfo from "../components/setting/PersonalInfo"
import Profile from "../components/setting/profile"
import Security from "../components/setting/security"
import Sidebar from "../components/setting/Sidebar"
import VerifyKYC from "../components/setting/verifyKYC"

const sections = [
  { id: "Profile", label: "Profile" },
  { id: "PersonalInfo", label: "Personal info" },
  { id: "Security", label: "Security" },
  { id: "VerifyKYC", label: "Verify KYC" },
]

const contentBySection = {
  Profile,
  PersonalInfo,
  Security,
  VerifyKYC,
}

export default function Setting() {
  const [activeSection, setActiveSection] = useState("Profile")
  const [mobileOpen, setMobileOpen] = useState(false)
  const Section = contentBySection[activeSection]
  const activeLabel = sections.find(({ id }) => id === activeSection)?.label

  return (
    <div className="settings-page">
      <div className="settings-mobile-select">
        <button type="button" onClick={() => setMobileOpen((open) => !open)}>
          <span>{activeLabel}</span><ChevronDown size={17} className={mobileOpen ? "is-rotated" : ""} />
        </button>
        {mobileOpen && (
          <div className="settings-mobile-menu">
            {sections.map(({ id, label }) => (
              <button key={id} type="button" className={activeSection === id ? "is-active" : ""} onClick={() => { setActiveSection(id); setMobileOpen(false) }}>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="settings-layout">
        <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} />
        <main className="settings-content">
          <div className="settings-content-heading">
            <div><p className="eyebrow">Account controls</p><h1>{activeLabel}</h1></div>
            <span className="settings-status"><span /> Secure workspace</span>
          </div>
          <section className="settings-section"><Section /></section>
          <footer className="settings-footer"><span>Changes are saved securely</span><span>Encrypted account workspace</span></footer>
        </main>
      </div>
    </div>
  )
}
