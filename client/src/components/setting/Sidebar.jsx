import { BadgeCheck, LockKeyhole, LogOut, Settings2, UserRound } from "lucide-react"
import { createElement } from "react"
import { useAuth } from "../../context/AuthContext"

const items = [
  { id: "Profile", label: "Profile", icon: UserRound },
  { id: "PersonalInfo", label: "Personal info", icon: Settings2 },
  { id: "Security", label: "Security", icon: LockKeyhole },
  { id: "VerifyKYC", label: "Verify KYC", icon: BadgeCheck },
]

export default function Sidebar({ setActiveSection, activeSection }) {
  const { logout } = useAuth()

  return (
    <aside className="settings-nav" aria-label="Settings navigation">
      <div className="settings-nav-heading">
        <p className="eyebrow">Workspace</p>
        <h2>Settings</h2>
      </div>
      <nav className="settings-nav-list">
        {items.map(({ id, label, icon }) => (
          <button key={id} type="button" className={`settings-nav-item ${activeSection === id ? "is-active" : ""}`} onClick={() => setActiveSection(id)}>
            {createElement(icon, { size: 17, strokeWidth: 1.8 })}
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <button type="button" className="settings-logout" onClick={logout}>
        <LogOut size={17} />
        <span>Log out</span>
      </button>
    </aside>
  )
}
