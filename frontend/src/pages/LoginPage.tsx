import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.auth.login(email, password)
      localStorage.setItem('token', res.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0e1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span
            style={{
              background: '#F5C518',
              color: '#000',
              fontSize: 12,
              fontWeight: 900,
              padding: '4px 10px',
              letterSpacing: 2,
            }}
          >
            SCT
          </span>
          <div
            style={{
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: '#fff',
              marginTop: 12,
            }}
          >
            Soccer Tournament Portal
          </div>
          <div
            style={{
              fontSize: 10,
              color: '#555',
              letterSpacing: 2,
              textTransform: 'uppercase',
              marginTop: 6,
            }}
          >
            Sign in to continue
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            background: '#111520',
            border: '1px solid #1c1e2a',
            borderTop: '2px solid #F5C518',
            padding: 32,
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  color: '#555',
                  marginBottom: 8,
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: '#0a0e1a',
                  border: '1px solid #1c1e2a',
                  color: '#fff',
                  padding: '10px 12px',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  color: '#555',
                  marginBottom: 8,
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: '#0a0e1a',
                  border: '1px solid #1c1e2a',
                  color: '#fff',
                  padding: '10px 12px',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  color: '#F5C518',
                  fontSize: 11,
                  marginBottom: 16,
                  padding: '8px 12px',
                  border: '1px solid #2a2810',
                  background: 'rgba(245,197,24,0.05)',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: '#F5C518',
                color: '#000',
                border: 'none',
                padding: '12px',
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: 2,
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                fontFamily: 'inherit',
              }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
