import { useLocation, useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/dashboard',
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
    label: 'Fixtures',
    path: '/fixtures',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="1" y="3" width="14" height="11" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M1 6h14" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 1v4M11 1v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Standings',
    path: '/standings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="1" y="9" width="3" height="6" rx="0.5" />
        <rect x="6" y="5" width="3" height="10" rx="0.5" />
        <rect x="11" y="2" width="3" height="13" rx="0.5" />
      </svg>
    ),
  },
  {
    label: 'Teams',
    path: '/teams',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="6" cy="5" r="2.5" />
        <path d="M1 14c0-2.76 2.24-5 5-5s5 2.24 5 5" />
        <circle cx="12" cy="5" r="2" />
        <path d="M12 10c1.66 0 3 1.34 3 3" />
      </svg>
    ),
  },
  {
    label: 'Players',
    path: '/players',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="8" cy="5" r="3" />
        <path d="M2 14c0-3.31 2.69-6 6-6s6 2.69 6 6" />
      </svg>
    ),
  },
  {
    label: 'Users',
    path: '/users',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="8" cy="5" r="3" />
        <path d="M2 14c0-3.31 2.69-6 6-6s6 2.69 6 6" />
        <circle cx="13" cy="13" r="3" fill="#0a0e1a" />
        <path d="M13 11v4M11 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: collapsed ? '14px 0' : '14px 16px 14px 20px',
          borderBottom: '1px solid #1c1e2a',
          gap: 8,
          flexShrink: 0,
        }}
      >
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 900,
                color: '#F5C518',
                letterSpacing: 3,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                lineHeight: 1.1,
              }}
            >
              KNFPL
            </div>
            <div
              style={{
                fontSize: 8,
                fontWeight: 700,
                color: '#333',
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginTop: 2,
                whiteSpace: 'nowrap',
              }}
            >
              Portal
            </div>
          </div>
        )}

        {collapsed && (
          <span
            style={{
              fontSize: 13,
              fontWeight: 900,
              color: '#F5C518',
              letterSpacing: 1,
            }}
          >
            K
          </span>
        )}

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
            padding: 4,
            flexShrink: 0,
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#F5C518')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#444')}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronIcon direction={collapsed ? 'right' : 'left'} />
        </button>
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
