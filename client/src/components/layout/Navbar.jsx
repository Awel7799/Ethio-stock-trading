import { Bell, BriefcaseBusiness, ChevronDown, LayoutDashboard, Menu, Settings2, WalletCards, X } from "lucide-react"
import { createElement, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const navigationItems = [
  { label: "Markets", href: "/markets", icon: LayoutDashboard },
  { label: "Portfolio", href: "/portfolio", icon: BriefcaseBusiness },
  { label: "Wallet", href: "/wallet", icon: WalletCards },
  { label: "Settings", href: "/setting", icon: Settings2 },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()
  const initials = `${user?.firstName?.[0] || "T"}${user?.lastName?.[0] || "W"}`.toUpperCase()

  return (
    <header className="app-header">
      <Link to="/markets" className="brand-lockup" aria-label="TradeWise markets">
        <span className="brand-mark">↗</span>
        <span>TradeWise</span>
      </Link>

      <button className="mobile-menu-button" onClick={() => setIsOpen((open) => !open)} aria-label="Toggle navigation">
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <nav className={`primary-nav ${isOpen ? "is-open" : ""}`} aria-label="Primary navigation">
        {navigationItems.map(({ label, href, icon }) => {
          const active = location.pathname === href || (href === "/markets" && location.pathname.startsWith("/stock"))
          return (
            <Link key={href} to={href} className={`nav-link ${active ? "is-active" : ""}`} onClick={() => setIsOpen(false)}>
              {createElement(icon, { size: 17, strokeWidth: 1.8 })}
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="header-actions">
        <button className="icon-button" aria-label="Notifications"><Bell size={18} /></button>
        <Link to="/setting" className="profile-chip">
          <span className="avatar">{initials}</span>
          <span className="profile-name">{user?.firstName || "Trader"}</span>
          <ChevronDown size={15} />
        </Link>
        <button className="logout-button" onClick={logout}>Log out</button>
      </div>
    </header>
  )
}
