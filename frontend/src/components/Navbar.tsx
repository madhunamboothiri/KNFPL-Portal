import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { api } from '../services/api'
import type { User } from '../types'

const ROUTE_META: Record<string, { title: string; crumbs: { label: string; path?: string }[] }> = {
  '/dashboard': { title: 'Dashboard',  crumbs: [{ label: 'Home', path: '/dashboard' }, { label: 'Dashboard' }] },
  '/fixtures':  { title: 'Fixtures',   crumbs: [{ label: 'Home', path: '/dashboard' }, { label: 'Fixtures' }] },
  '/standings': { title: 'Standings',  crumbs: [{ label: 'Home', path: '/dashboard' }, { label: 'Standings' }] },
  '/teams':     { title: 'Teams',      crumbs: [{ label: 'Home', path: '/dashboard' }, { label: 'Teams' }] },
  '/players':   { title: 'Players',    crumbs: [{ label: 'Home', path: '/dashboard' }, { label: 'Players' }] },
  '/users':     { title: 'Users',      crumbs: [{ label: 'Home', path: '/dashboard' }, { label: 'Users' }] },
  '/profile':   { title: 'Profile',    crumbs: [{ label: 'Home', path: '/dashboard' }, { label: 'Profile' }] },
}

function BellIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.5 6A4.5 4.5 0 0 0 4.5 6c0 4.5-2 5.5-2 5.5h13s-2-1-2-5.5" />
      <path d="M10.3 15.5a1.5 1.5 0 0 1-2.6 0" />
    </svg>
  )
}

function SignOutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
      <polyline points="11 11 14 8 11 5" />
      <line x1="14" y1="8" x2="6" y2="8" />
    </svg>
  )
}

interface Props {
  sidebarWidth: number
}

export default function Navbar({ sidebarWidth }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  const meta = ROUTE_META[location.pathname] ?? { title: 'Portal', crumbs: [{ label: 'Home' }] }

  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? (JSON.parse(stored) as User) : null
  })

  useEffect(() => {
    // fetch fresh profile (includes profileImage from DB)
    api.profile.get()
      .then((fresh) => {
        setUser((prev) => prev ? { ...prev, profileImage: fresh.profileImage } : prev)
        const stored = localStorage.getItem('user')
        if (stored) {
          localStorage.setItem('user', JSON.stringify({ ...JSON.parse(stored), profileImage: fresh.profileImage ?? null }))
        }
      })
      .catch(() => { /* silently ignore — user stays from localStorage */ })
  }, [])

  useEffect(() => {
    function sync() {
      const stored = localStorage.getItem('user')
      setUser(stored ? (JSON.parse(stored) as User) : null)
    }
    window.addEventListener('userUpdated', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('userUpdated', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: sidebarWidth,
        right: 0,
        zIndex: 200,
        background: '#0a0e1a',
        borderBottom: '1px solid #1c1e2a',
        height: 56,
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'left 0.2s ease',
      }}
    >
      {/* ── Left: gold accent bar + title + breadcrumb ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Gold vertical accent */}
        <div
          style={{
            width: 3,
            height: 28,
            background: 'linear-gradient(180deg, #F5C518 0%, rgba(245,197,24,0.3) 100%)',
            borderRadius: 2,
            flexShrink: 0,
          }}
        />
        <div>
          {/* Page title */}
          <div
            style={{
              fontSize: 14,
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: 2,
              textTransform: 'uppercase',
              lineHeight: 1,
              marginBottom: 4,
            }}
          >
            {meta.title}
          </div>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {meta.crumbs.map((crumb, i) => {
              const isLast = i === meta.crumbs.length - 1
              return (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  {i > 0 && (
                    <span style={{ color: '#2a2d3a', fontSize: 11, lineHeight: 1 }}>›</span>
                  )}
                  {isLast ? (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                        color: '#F5C518',
                      }}
                    >
                      {crumb.label}
                    </span>
                  ) : (
                    <button
                      onClick={() => crumb.path && navigate(crumb.path)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                        color: '#3a3d50',
                        cursor: crumb.path ? 'pointer' : 'default',
                        fontFamily: "'Arial Black', Arial, sans-serif",
                      }}
                      onMouseEnter={(e) => {
                        if (crumb.path) (e.currentTarget as HTMLButtonElement).style.color = '#888'
                      }}
                      onMouseLeave={(e) => {
                        ;(e.currentTarget as HTMLButtonElement).style.color = '#3a3d50'
                      }}
                    >
                      {crumb.label}
                    </button>
                  )}
                </span>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Right: notification + divider + user + sign out ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>

        {/* Notification bell */}
        <div style={{ position: 'relative', marginRight: 8 }}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            style={{
              background: notifOpen ? '#111520' : 'none',
              border: `1px solid ${notifOpen ? '#F5C518' : '#1c1e2a'}`,
              color: notifOpen ? '#F5C518' : '#555',
              width: 34,
              height: 34,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!notifOpen) {
                ;(e.currentTarget as HTMLButtonElement).style.color = '#aaa'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#333'
              }
            }}
            onMouseLeave={(e) => {
              if (!notifOpen) {
                ;(e.currentTarget as HTMLButtonElement).style.color = '#555'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#1c1e2a'
              }
            }}
            title="Notifications"
          >
            <BellIcon />
            <span
              style={{
                position: 'absolute',
                top: 7,
                right: 7,
                width: 5,
                height: 5,
                background: '#F5C518',
                borderRadius: '50%',
              }}
            />
          </button>

          {notifOpen && (
            <div
              style={{
                position: 'absolute',
                top: 42,
                right: 0,
                width: 260,
                background: '#111520',
                border: '1px solid #1c1e2a',
                borderTop: '2px solid #F5C518',
                zIndex: 300,
              }}
            >
              <div
                style={{
                  padding: '10px 16px',
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  color: '#555',
                  borderBottom: '1px solid #1c1e2a',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                Notifications
                <span style={{ color: '#F5C518' }}>0 New</span>
              </div>
              <div
                style={{
                  padding: '20px 16px',
                  fontSize: 11,
                  color: '#333',
                  textAlign: 'center',
                  letterSpacing: 1,
                }}
              >
                No new notifications
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: '#1c1e2a', margin: '0 16px' }} />

        {/* User dropdown trigger */}
        {user && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setUserOpen((v) => !v)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '4px 8px 4px 4px',
              }}
            >
              {/* Avatar */}
              {user.profileImage ? (
                <img
                  src={`data:image/*;base64,${user.profileImage}`}
                  alt={user.name}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1px solid #F5C518',
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1c1e2a 0%, #111520 100%)',
                    border: '1px solid #F5C518',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 900,
                    color: '#F5C518',
                    flexShrink: 0,
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              {/* Name + role */}
              <div style={{ textAlign: 'left' }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 900,
                    color: '#e8e8e8',
                    letterSpacing: 0.5,
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    fontFamily: "'Arial Black', Arial, sans-serif",
                  }}
                >
                  {user.name}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: '#F5C518',
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                    opacity: 0.7,
                    marginTop: 1,
                    fontFamily: "'Arial Black', Arial, sans-serif",
                  }}
                >
                  {user.role}
                </div>
              </div>
              {/* Chevron */}
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                stroke="#555"
                strokeWidth="1.8"
                strokeLinecap="round"
                style={{ transform: userOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }}
              >
                <polyline points="2,3 5,7 8,3" />
              </svg>
            </button>

            {/* Dropdown */}
            {userOpen && (
              <>
                {/* Backdrop to close on outside click */}
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 290 }}
                  onClick={() => setUserOpen(false)}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 44,
                    right: 0,
                    width: 190,
                    background: '#111520',
                    border: '1px solid #1c1e2a',
                    borderTop: '2px solid #F5C518',
                    zIndex: 300,
                  }}
                >
                  <DropdownItem
                    icon={
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                        <circle cx="8" cy="5" r="3" />
                        <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" />
                      </svg>
                    }
                    label="Profile"
                    onClick={() => { setUserOpen(false); navigate('/profile') }}
                  />
                  <div style={{ height: 1, background: '#1c1e2a', margin: '4px 0' }} />
                  <DropdownItem
                    icon={<SignOutIcon />}
                    label="Sign Out"
                    danger
                    onClick={() => { setUserOpen(false); logout() }}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

function DropdownItem({
  icon,
  label,
  danger = false,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  danger?: boolean
  onClick: () => void
}) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%',
        background: hov ? (danger ? 'rgba(192,57,43,0.08)' : '#0a0e1a') : 'none',
        border: 'none',
        color: hov ? (danger ? '#c0392b' : '#fff') : danger ? '#555' : '#aaa',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 16px',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        cursor: 'pointer',
        fontFamily: "'Arial Black', Arial, sans-serif",
        transition: 'color 0.15s, background 0.15s',
        textAlign: 'left',
      }}
    >
      {icon}
      {label}
    </button>
  )
}
