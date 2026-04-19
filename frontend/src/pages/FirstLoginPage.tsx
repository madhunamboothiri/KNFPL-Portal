import { useState, useRef, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import DobMaskInput from '../components/DobMaskInput'

const FONT = "'Arial Black', Arial, sans-serif"

const INPUT: React.CSSProperties = {
  width: '100%', background: '#0a0e1a', border: '1px solid #1c1e2a',
  color: '#fff', padding: '9px 12px', fontSize: 12,
  outline: 'none', fontFamily: FONT, boxSizing: 'border-box',
}

const LABEL: React.CSSProperties = {
  display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: 2,
  textTransform: 'uppercase' as const, color: '#555', marginBottom: 5, fontFamily: FONT,
}

function PasswordInput({ value, onChange, hasError }: {
  value: string; onChange: (v: string) => void; hasError?: boolean
}) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...INPUT, paddingRight: 38, borderColor: hasError ? '#c0392b' : '#1c1e2a' }}
      />
      <button
        type="button"
        onClick={() => setShow(v => !v)}
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

type Errors = Partial<Record<
  'newPassword' | 'confirmPassword' | 'phoneNumber' | 'address' | 'dateOfBirth' | 'form',
  string
>>

export default function FirstLoginPage() {
  const navigate = useNavigate()

  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('user') ?? 'null') } catch { return null }
  })()

  const [form, setForm] = useState({
    name: storedUser?.name ?? '',
    email: storedUser?.email ?? '',
    newPassword: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function set(field: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined }))
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function validate(): boolean {
    const errs: Errors = {}
    if (!form.newPassword || form.newPassword.length < 6)
      errs.newPassword = 'Password must be at least 6 characters.'
    if (form.confirmPassword !== form.newPassword)
      errs.confirmPassword = 'Passwords do not match.'
    if (!form.phoneNumber.trim())
      errs.phoneNumber = 'Phone number is required.'
    else if (!/^\d{10}$/.test(form.phoneNumber))
      errs.phoneNumber = 'Phone number must be exactly 10 digits.'
    if (!form.address.trim())
      errs.address = 'Address is required.'
    if (!form.dateOfBirth)
      errs.dateOfBirth = 'Date of birth is required.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    setErrors({})
    try {
      const updated = await api.profile.completeFirstLogin({
        newPassword: form.newPassword,
        name: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber,
        address: form.address,
        dateOfBirth: form.dateOfBirth,
      }, imageFile ?? undefined)

      localStorage.setItem('user', JSON.stringify({
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        profileImage: updated.profileImage ?? null,
        neverLogged: updated.neverLogged,
      }))
      window.dispatchEvent(new Event('userUpdated'))
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.'
      setErrors({ form: msg.startsWith('{') ? 'Failed to complete setup. Please try again.' : msg })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0e1a', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: FONT,
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <img src="/KNFPLLogo.png" alt="KNFPL" style={{ width: 64, height: 64, objectFit: 'contain', marginBottom: 12 }} />
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 5, textTransform: 'uppercase', color: '#F5C518', fontFamily: FONT, lineHeight: 1, textAlign: 'center' }}>
            KNFPL
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#aaa', marginTop: 7, fontFamily: FONT, textAlign: 'center' }}>
            Kerala Namboothiries Premier League
          </div>
        </div>

        {/* Card */}
        <div style={{ background: '#111520', border: '1px solid #1c1e2a', borderTop: '2px solid #F5C518', padding: '28px 28px 24px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 14, borderBottom: '1px solid #16181f', marginBottom: 22 }}>
            <span style={{ display: 'inline-block', width: 3, height: 16, background: '#F5C518', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#fff', letterSpacing: 3, textTransform: 'uppercase', fontFamily: FONT }}>
                Complete Your Profile
              </div>
              <div style={{ fontSize: 9, color: '#555', letterSpacing: 1, marginTop: 4, fontFamily: FONT }}>
                Set your password and fill in your details to continue
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Avatar picker */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 22 }}>
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  width: 72, height: 72, borderRadius: '50%', cursor: 'pointer',
                  border: '2px solid #1c1e2a', overflow: 'hidden', position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#0a0e1a',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = '#F5C518')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = '#1c1e2a')}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              <div style={{ fontSize: 9, color: '#555', letterSpacing: 1, marginTop: 8, fontFamily: FONT, textTransform: 'uppercase' }}>
                Profile Photo (optional)
              </div>
            </div>

            {/* Password section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 10, borderBottom: '1px solid #16181f', marginBottom: 16 }}>
              <span style={{ display: 'inline-block', width: 3, height: 12, background: '#F5C518', flexShrink: 0 }} />
              <span style={{ fontSize: 9, fontWeight: 900, color: '#aaa', letterSpacing: 2, textTransform: 'uppercase', fontFamily: FONT }}>Set Password</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={LABEL}>New Password *</label>
                <PasswordInput value={form.newPassword} onChange={v => set('newPassword', v)} hasError={!!errors.newPassword} />
                {errors.newPassword && <div className="field-error">{errors.newPassword}</div>}
              </div>
              <div>
                <label style={LABEL}>Confirm Password *</label>
                <PasswordInput value={form.confirmPassword} onChange={v => set('confirmPassword', v)} hasError={!!errors.confirmPassword} />
                {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
              </div>
            </div>

            {/* Profile section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 10, borderBottom: '1px solid #16181f', marginBottom: 16 }}>
              <span style={{ display: 'inline-block', width: 3, height: 12, background: '#F5C518', flexShrink: 0 }} />
              <span style={{ fontSize: 9, fontWeight: 900, color: '#aaa', letterSpacing: 2, textTransform: 'uppercase', fontFamily: FONT }}>Personal Details</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 14 }}>
              <label style={LABEL}>Phone * (10 digits)</label>
              <input
                type="tel"
                value={form.phoneNumber}
                maxLength={10}
                onChange={e => set('phoneNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                style={{ ...INPUT, borderColor: errors.phoneNumber ? '#c0392b' : '#1c1e2a' }}
                placeholder="10-digit number"
              />
              {errors.phoneNumber && <div className="field-error">{errors.phoneNumber}</div>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 14 }}>
              <label style={LABEL}>Address *</label>
              <textarea
                value={form.address}
                onChange={e => set('address', e.target.value)}
                rows={2}
                style={{ ...INPUT, resize: 'vertical', borderColor: errors.address ? '#c0392b' : '#1c1e2a' }}
                placeholder="Your full address"
              />
              {errors.address && <div className="field-error">{errors.address}</div>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 22 }}>
              <label style={LABEL}>Date of Birth *</label>
              <DobMaskInput
                value={form.dateOfBirth}
                onChange={v => set('dateOfBirth', v)}
                style={{ ...INPUT }}
                className={errors.dateOfBirth ? 'error-border' : ''}
              />
              {errors.dateOfBirth && <div className="field-error">{errors.dateOfBirth}</div>}
            </div>

            {errors.form && (
              <div style={{
                color: '#c0392b', fontSize: 10, marginBottom: 16, padding: '8px 12px',
                border: '1px solid #3d1010', background: 'rgba(192,57,43,0.05)',
                fontFamily: FONT, letterSpacing: 0.5, lineHeight: 1.5,
              }}>
                {errors.form}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  background: '#F5C518', color: '#000', border: 'none', padding: '7px 18px',
                  fontSize: 9, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase',
                  cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
                  fontFamily: FONT, display: 'flex', alignItems: 'center', gap: 7,
                }}
              >
                {saving ? (
                  <span className="spin">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                  </span>
                ) : (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {saving ? 'Saving…' : 'Complete Setup'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
