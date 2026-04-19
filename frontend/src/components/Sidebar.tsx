import { useLocation, useNavigate } from 'react-router-dom'
import type { User } from '../types'

const ALL_NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    roles: null,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="1" y="1" width="6" height="6" rx="1" />
        <rect x="9" y="1" width="6" height="6" rx="1" />
        <rect x="1" y="9" width="6" height="6" rx="1" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Users',
    path: '/users',
    roles: ['SuperAdmin'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="8" cy="5" r="3" />
        <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" />
      </svg>
    ),
  },
]

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {direction === 'left' ? (
        <polyline points="9,2 4,7 9,12" />
      ) : (
        <polyline points="5,2 10,7 5,12" />
      )}
    </svg>
  )
}

export const SIDEBAR_EXPANDED = 220
export const SIDEBAR_COLLAPSED = 60

interface Props {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: Props) {
  const location = useLocation()
  const navigate = useNavigate()
  const w = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED

  const currentUser: User | null = (() => {
    try { return JSON.parse(localStorage.getItem('user') ?? 'null') } catch { return null }
  })()

  const NAV_ITEMS = ALL_NAV_ITEMS.filter(
    (item) => item.roles === null || (currentUser && item.roles.includes(currentUser.role)),
  )

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: w,
        background: '#0a0e1a',
        borderRight: '1px solid #1c1e2a',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        overflow: 'hidden',
        transition: 'width 0.2s ease',
      }}
    >
      {/* Logo + collapse toggle */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: collapsed ? '12px 0' : '16px 12px 14px',
          borderBottom: '1px solid #1c1e2a',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        {collapsed ? (
          /* Collapsed: logo left, arrow right */
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', padding: '0 8px' }}>
            <img
              src="/KNFPLLogo.png"
              alt="KNFPL"
              style={{ height: 32, width: 32, objectFit: 'contain', flexShrink: 0 }}
            />
            <button
              onClick={onToggle}
              style={{
                background: 'none',
                border: 'none',
                color: '#444',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
                flexShrink: 0,
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#F5C518')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#444')}
              title="Expand sidebar"
            >
              <ChevronIcon direction="right" />
            </button>
          </div>
        ) : (
          /* Expanded: logo + text centred, arrow pinned to right */
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <img
                src="/KNFPLLogo.png"
                alt="KNFPL"
                style={{ height: 52, width: 'auto', objectFit: 'contain' }}
              />
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 900,
                  color: '#F5C518',
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  lineHeight: 1.1,
                  fontFamily: "'Arial Black', Arial, sans-serif",
                  marginTop: 6,
                }}
              >
                KNFPL
              </div>
              <div
                style={{
                  fontSize: 7,
                  fontWeight: 700,
                  color: '#555',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  marginTop: 3,
                  lineHeight: 1.4,
                  fontFamily: "'Arial Black', Arial, sans-serif",
                  textAlign: 'center',
                }}
              >
                Kerala Namboothiries<br />Premier League
              </div>
            </div>
            <button
              onClick={onToggle}
              style={{
                position: 'absolute',
                top: '50%',
                right: 8,
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#444',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 4,
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#F5C518')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#444')}
              title="Collapse sidebar"
            >
              <ChevronIcon direction="left" />
            </button>
          </>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                gap: collapsed ? 0 : 12,
                padding: collapsed ? '10px 0' : '10px 20px',
                background: isActive ? '#111520' : 'none',
                border: 'none',
                borderLeft: `3px solid ${isActive ? '#F5C518' : 'transparent'}`,
                color: isActive ? '#F5C518' : '#555',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'color 0.15s',
                fontFamily: "'Arial Black', Arial, sans-serif",
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = '#aaa'
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = '#555'
              }}
            >
              <span style={{ opacity: isActive ? 1 : 0.5, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

    </aside>
  )
}
