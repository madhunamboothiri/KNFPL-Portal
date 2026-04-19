import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

const FONT = "'Arial Black', Arial, sans-serif"

const INPUT: React.CSSProperties = {
  width: '100%',
  background: '#0a0e1a',
  border: '1px solid #1c1e2a',
  color: '#fff',
  padding: '9px 12px',
  fontSize: 12,
  outline: 'none',
  fontFamily: FONT,
  boxSizing: 'border-box',
}

const LABEL: React.CSSProperties = {
  display: 'block',
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: 2,
  textTransform: 'uppercase' as const,
  color: '#555',
  marginBottom: 5,
  fontFamily: FONT,
}

function PasswordInput({ value, onChange, show, onToggle }: {
  value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void
}) {
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        style={{ ...INPUT, paddingRight: 38 }}
      />
      <button
        type="button"
        onClick={onToggle}
        style={{
          position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', color: '#555', cursor: 'pointer', padding: 0, display: 'flex',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#F5C518')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#555')}
      >
        {show ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.auth.login(email, password)
      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify(res.user))
      navigate('/dashboard')
    } catch {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0e1a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      fontFamily: FONT,
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
      {/* Logo block */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
        <img
          src="/KNFPLLogo.png"
          alt="KNFPL"
          style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 14, display: 'block' }}
        />
        <div style={{
          fontSize: 20,
          fontWeight: 900,
          letterSpacing: 5,
          textTransform: 'uppercase',
          color: '#F5C518',
          fontFamily: FONT,
          lineHeight: 1,
          textAlign: 'center',
        }}>
          KNFPL
        </div>
        <div style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: '#aaa',
          marginTop: 7,
          fontFamily: FONT,
          textAlign: 'center',
        }}>
          Kerala Namboothiries Premier League
        </div>
      </div>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 380,
        background: '#111520',
        border: '1px solid #1c1e2a',
        borderTop: '2px solid #F5C518',
        padding: '28px 28px 24px',
      }}>
        {/* Card header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          paddingBottom: 16,
          borderBottom: '1px solid #16181f',
          marginBottom: 22,
        }}>
          <span style={{ display: 'inline-block', width: 3, height: 16, background: '#F5C518', flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 900, color: '#fff', letterSpacing: 3, textTransform: 'uppercase', fontFamily: FONT }}>
            Sign In
          </span>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: 14 }}>
            <label style={LABEL}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={INPUT}
              placeholder="your@email.com"
            />
          </div>

          <div style={{ marginBottom: 22 }}>
            <label style={LABEL}>Password</label>
            <PasswordInput
              value={password}
              onChange={setPassword}
              show={showPw}
              onToggle={() => setShowPw((v) => !v)}
            />
          </div>

          {error && (
            <div style={{
              color: '#c0392b',
              fontSize: 10,
              marginBottom: 16,
              padding: '8px 12px',
              border: '1px solid #3d1010',
              background: 'rgba(192,57,43,0.05)',
              fontFamily: FONT,
              letterSpacing: 0.5,
              lineHeight: 1.5,
            }}>
              {error}
            </div>
          )}

          {/* Button right-aligned, compact */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#F5C518',
                color: '#000',
                border: 'none',
                padding: '7px 16px',
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: 2,
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                fontFamily: FONT,
                display: 'flex',
                alignItems: 'center',
                gap: 7,
              }}
            >
              {loading ? (
                <span className="spin">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                  </svg>
                </span>
              ) : (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              )}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  )
}
