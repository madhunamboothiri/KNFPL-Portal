import { useNavigate } from 'react-router-dom'

const NAV_LINKS = ['Fixtures', 'Standings', 'Teams', 'Results'] as const
type NavLink = (typeof NAV_LINKS)[number]

interface Props {
  activeLink?: NavLink
}

export default function Navbar({ activeLink = 'Fixtures' }: Props) {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav
      style={{
        background: '#0a0e1a',
        borderBottom: '2px solid #F5C518',
        height: 56,
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span
          style={{
            background: '#F5C518',
            color: '#000',
            fontSize: 10,
            fontWeight: 900,
            padding: '3px 7px',
            letterSpacing: 1,
          }}
        >
          SCT
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 900,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: '#fff',
          }}
        >
          Soccer Tournament Portal
        </span>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: 24 }}>
        {NAV_LINKS.map((link) => {
          const isActive = activeLink === link
          return (
            <button
              key={link}
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: isActive ? '#F5C518' : '#aaa',
                borderBottom: `2px solid ${isActive ? '#F5C518' : 'transparent'}`,
                padding: '4px 0',
                background: 'none',
                border: 'none',
                borderBottomWidth: 2,
                borderBottomStyle: 'solid',
                borderBottomColor: isActive ? '#F5C518' : 'transparent',
                cursor: 'pointer',
              }}
            >
              {link}
            </button>
          )
        })}
      </div>

      {/* Account */}
      <button
        onClick={logout}
        style={{
          background: '#F5C518',
          color: '#000',
          fontSize: 11,
          fontWeight: 900,
          padding: '6px 14px',
          letterSpacing: 1,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        My Account
      </button>
    </nav>
  )
}
