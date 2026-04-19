import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react'
import AppLayout from '../components/AppLayout'
import LoadingOverlay from '../components/LoadingOverlay'
import DobMaskInput from '../components/DobMaskInput'
import { api } from '../services/api'
import type { User } from '../types'

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={LABEL}>{label}</label>
      {children}
    </div>
  )
}

function SectionTitle({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 12, borderBottom: '1px solid #16181f', marginBottom: 20 }}>
      <span style={{ display: 'inline-block', width: 3, height: 16, background: '#F5C518', flexShrink: 0 }} />
      <span style={{ fontSize: 11, fontWeight: 900, color: '#fff', letterSpacing: '3px', textTransform: 'uppercase', fontFamily: FONT, flex: 1 }}>
        {title}
      </span>
      {action}
    </div>
  )
}

function Toast({ message, ok }: { message: string; ok: boolean }) {
  return (
    <div style={{
      position: 'fixed', bottom: 60, right: 24,
      background: ok ? '#0d1a10' : '#1a0e0e',
      border: `1px solid ${ok ? '#27ae60' : '#c0392b'}`,
      color: ok ? '#27ae60' : '#c0392b',
      padding: '10px 18px', fontSize: 11, fontWeight: 700,
      letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: FONT, zIndex: 500,
      boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
    }}>
      {message}
    </div>
  )
}

function getLocalUser(): User | null {
  try { return JSON.parse(localStorage.getItem('user') ?? 'null') } catch { return null }
}

function SaveBtn({ loading, label, icon, noProgress = false, formId }: { loading: boolean; label: string; icon: React.ReactNode; noProgress?: boolean; formId?: string }) {
  const showSpinner = loading && !noProgress
  return (
    <button type="submit" form={formId} disabled={loading} style={{
      background: '#F5C518', color: '#000', border: 'none',
      padding: '6px 14px', fontSize: 9, fontWeight: 900,
      letterSpacing: 2, textTransform: 'uppercase',
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.7 : 1, fontFamily: FONT, whiteSpace: 'nowrap', flexShrink: 0,
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      {showSpinner
        ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" strokeOpacity="0.3" /><path d="M12 2a10 10 0 0 1 10 10" /></svg>
        : icon}
      {showSpinner ? 'Saving…' : label}
    </button>
  )
}

function InlineError({ msg }: { msg: string }) {
  return (
    <div style={{ fontSize: 9, color: '#c0392b', fontFamily: FONT, letterSpacing: 0.5, marginTop: 4, lineHeight: 1.4 }}>
      {msg}
    </div>
  )
}

function FieldWrap({ children, error }: { children: React.ReactNode; error?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 14 }}>
      {children}
      {error && <InlineError msg={error} />}
    </div>
  )
}

function PasswordInput({ value, onChange, show, onToggle, hasError = false }: {
  value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void; hasError?: boolean
}) {
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...INPUT, paddingRight: 38, borderColor: hasError ? '#c0392b' : '#1c1e2a' }}
      />
      <button type="button" onClick={onToggle} style={{
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 8, fontWeight: 700, color: '#444', letterSpacing: 2, textTransform: 'uppercase', fontFamily: FONT, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 12, color: '#aaa', fontFamily: FONT }}>{value || '—'}</div>
    </div>
  )
}

export default function ProfilePage() {
  const localUser = getLocalUser()

  const [user, setUser] = useState<User | null>(localUser)
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState(localUser?.name ?? '')
  const [email, setEmail] = useState(localUser?.email ?? '')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [dob, setDob] = useState('')
  const [imageFile, setImageFile] = useState<File | undefined>()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [detailsSaving, setDetailsSaving] = useState(false)

  // inline field errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({})

  const [toast, setToast] = useState<{ message: string; ok: boolean } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function clearError(key: string) {
    setErrors((prev) => { const n = { ...prev }; delete n[key]; return n })
  }
  function clearPwError(key: string) {
    setPwErrors((prev) => { const n = { ...prev }; delete n[key]; return n })
  }

  useEffect(() => {
    api.profile.get()
      .then((u) => {
        setUser(u)
        setName(u.name)
        setEmail(u.email)
        setPhone(u.phoneNumber ?? '')
        setAddress(u.address ?? '')
        setDob(u.dateOfBirth ?? '')
        if (u.profileImage) setImagePreview(`data:image/*;base64,${u.profileImage}`)
      })
      .catch(() => showToast('Failed to load profile from server.', false))
      .finally(() => setLoading(false))
  }, [])

  function showToast(msg: string, ok: boolean) {
    setToast({ message: msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function handleDetailsSubmit(e: FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Full name is required.'
    if (!phone.trim()) errs.phone = 'Phone number is required.'
    else if (!/^\d{10}$/.test(phone.trim())) errs.phone = 'Phone number must be exactly 10 digits.'
    if (!dob) errs.dob = 'Date of birth is required.'
    if (!address.trim()) errs.address = 'Address is required.'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setDetailsSaving(true)
    try {
      const updated = await api.profile.update({ name, email, phoneNumber: phone, address, dateOfBirth: dob }, imageFile)
      setUser(updated)
      if (updated.profileImage) setImagePreview(`data:image/*;base64,${updated.profileImage}`)
      const stored = localStorage.getItem('user')
      if (stored) localStorage.setItem('user', JSON.stringify({
        ...JSON.parse(stored),
        name: updated.name,
        email: updated.email,
        profileImage: updated.profileImage ?? null,
      }))
      window.dispatchEvent(new Event('userUpdated'))
      setImageFile(undefined)
      showToast('Profile updated successfully.', true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Update failed.'
      if (msg.toLowerCase().includes('phone')) setErrors({ phone: msg })
      else showToast(msg, false)
    } finally {
      setDetailsSaving(false)
    }
  }

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!currentPw) errs.currentPw = 'Current password is required.'
    if (!newPw) errs.newPw = 'New password is required.'
    else if (newPw.length < 6) errs.newPw = 'Password must be at least 6 characters.'
    if (!confirmPw) errs.confirmPw = 'Please confirm your new password.'
    else if (newPw && newPw !== confirmPw) errs.confirmPw = 'Passwords do not match.'
    if (Object.keys(errs).length) { setPwErrors(errs); return }
    setPwErrors({})
    setPwSaving(true)
    try {
      await api.profile.changePassword(currentPw, newPw)
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
      showToast('Password changed successfully.', true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Password change failed.'
      if (msg.toLowerCase().includes('current')) setPwErrors({ currentPw: msg })
      else showToast(msg, false)
    } finally {
      setPwSaving(false)
    }
  }

  const firstLetter = (user?.name ?? localUser?.name ?? '?').charAt(0).toUpperCase()
  const displayUser = user ?? localUser

  return (
    <AppLayout>
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── ROW 1: Full-width identity card ── */}
        <div style={{
          background: '#111520',
          border: '1px solid #1c1e2a',
          borderTop: '2px solid #F5C518',
          padding: '20px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: 28,
        }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" style={{
                width: 80, height: 80, borderRadius: '50%', objectFit: 'cover',
                border: '3px solid #F5C518', display: 'block',
              }} />
            ) : (
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'linear-gradient(135deg, #1c1e2a 0%, #0d1020 100%)',
                border: '3px solid #F5C518',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 30, fontWeight: 900, color: '#F5C518', fontFamily: FONT,
              }}>
                {firstLetter}
              </div>
            )}
            <button onClick={() => fileRef.current?.click()} title="Change photo" style={{
              position: 'absolute', bottom: 2, right: 2,
              width: 24, height: 24, borderRadius: '50%',
              background: '#F5C518', border: '2px solid #0a0e1a',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="11" height="11" viewBox="0 0 16 16" fill="#000">
                <path d="M14.5 3h-2.086L11 1.5H5L3.586 3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3zM8 12a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
              </svg>
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
          </div>

          {/* Name + role */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: 1, fontFamily: FONT, marginBottom: 6 }}>
              {displayUser?.name ?? '—'}
            </div>
            <div style={{
              display: 'inline-block', fontSize: 8, fontWeight: 900, color: '#000',
              background: '#F5C518', letterSpacing: 2, textTransform: 'uppercase',
              fontFamily: FONT, padding: '3px 10px',
            }}>
              {displayUser?.role ?? '—'}
            </div>
            {loading && <span style={{ fontSize: 8, color: '#444', letterSpacing: 2, textTransform: 'uppercase', fontFamily: FONT, marginLeft: 10 }}>Syncing…</span>}
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 56, background: '#1c1e2a', flexShrink: 0 }} />

          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: '4px 32px', flex: 1 }}>
            <InfoRow label="Email" value={displayUser?.email ?? ''} />
            <InfoRow label="Phone" value={displayUser?.phoneNumber ?? ''} />
            <InfoRow label="Date of Birth" value={displayUser?.dateOfBirth ? new Date(displayUser.dateOfBirth).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''} />
            <InfoRow label="Member Since" value={displayUser?.createdAt ? new Date(displayUser.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''} />
            {displayUser?.address && <InfoRow label="Address" value={displayUser.address} />}
          </div>
        </div>

        {/* ── ROW 2: Edit Details | Change Password ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>

          {/* ══ Edit Details ══ */}
          <div style={{ background: '#111520', border: '1px solid #1c1e2a', padding: '20px 24px', position: 'relative' }}>
            <LoadingOverlay show={detailsSaving} />
            <SectionTitle title="Edit Details" action={
              <SaveBtn loading={detailsSaving} label="Save Changes" noProgress formId="details-form" icon={
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
              } />
            } />
            <form id="details-form" onSubmit={handleDetailsSubmit} noValidate>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px', alignItems: 'start' }}>
                <FieldWrap error={errors.name}>
                  <label style={LABEL}>Full Name *</label>
                  <input
                    type="text" value={name}
                    onChange={(e) => { setName(e.target.value); clearError('name') }}
                    style={{ ...INPUT, borderColor: errors.name ? '#c0392b' : '#1c1e2a' }}
                  />
                </FieldWrap>

                <FieldWrap>
                  <label style={LABEL}>Email</label>
                  <input
                    type="email" value={email} readOnly
                    style={{ ...INPUT, color: '#555', cursor: 'not-allowed' }}
                    title="Email cannot be changed"
                  />
                  <span style={{ fontSize: 8, color: '#444', fontFamily: FONT, letterSpacing: 1, marginTop: 4, display: 'block' }}>Contact admin to change email</span>
                </FieldWrap>

                <FieldWrap error={errors.phone}>
                  <label style={LABEL}>Phone * (10 digits)</label>
                  <input
                    type="tel" value={phone} maxLength={10}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setPhone(val); clearError('phone')
                    }}
                    style={{ ...INPUT, borderColor: errors.phone ? '#c0392b' : '#1c1e2a' }}
                    placeholder="10-digit number"
                  />
                </FieldWrap>

                <FieldWrap error={errors.dob}>
                  <label style={LABEL}>Date of Birth *</label>
                  <DobMaskInput
                    value={dob}
                    onChange={(v) => { setDob(v); clearError('dob') }}
                    style={{ ...INPUT, borderColor: errors.dob ? '#c0392b' : '#1c1e2a' }}
                  />
                </FieldWrap>
              </div>

              <FieldWrap error={errors.address}>
                <label style={LABEL}>Address *</label>
                <textarea
                  value={address} rows={2}
                  onChange={(e) => { setAddress(e.target.value); clearError('address') }}
                  style={{ ...INPUT, resize: 'none', borderColor: errors.address ? '#c0392b' : '#1c1e2a' }}
                />
              </FieldWrap>

              {imageFile && (
                <div style={{ fontSize: 9, color: '#F5C518', letterSpacing: 1, fontFamily: FONT, marginBottom: 10 }}>
                  New photo selected — will be saved on submit
                </div>
              )}
            </form>
          </div>

          {/* ══ Change Password ══ */}
          <div style={{ background: '#111520', border: '1px solid #1c1e2a', padding: '20px 24px', position: 'relative' }}>
            <LoadingOverlay show={pwSaving} />
            <SectionTitle title="Change Password" action={
              <SaveBtn loading={pwSaving} label="Update Password" formId="password-form" icon={
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              } />
            } />

            <div style={{
              background: '#0a0e1a', border: '1px solid #1c1e2a',
              padding: '14px 16px', marginBottom: 18,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'rgba(245,197,24,0.08)', border: '1px solid #2a2810',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5C518" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div style={{ fontSize: 10, color: '#444', fontFamily: FONT, lineHeight: 1.5 }}>
                Use at least 6 characters mixing letters, numbers and symbols.
              </div>
            </div>

            <form id="password-form" onSubmit={handlePasswordSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <FieldWrap error={pwErrors.currentPw}>
                <label style={LABEL}>Current Password *</label>
                <PasswordInput
                  value={currentPw}
                  onChange={(v) => { setCurrentPw(v); clearPwError('currentPw') }}
                  show={showCurrentPw}
                  onToggle={() => setShowCurrentPw(v => !v)}
                  hasError={!!pwErrors.currentPw}
                />
              </FieldWrap>

              <div style={{ height: 1, background: '#1c1e2a', margin: '0 0 14px' }} />

              <FieldWrap error={pwErrors.newPw}>
                <label style={LABEL}>New Password *</label>
                <PasswordInput
                  value={newPw}
                  onChange={(v) => { setNewPw(v); clearPwError('newPw') }}
                  show={showNewPw}
                  onToggle={() => setShowNewPw(v => !v)}
                  hasError={!!pwErrors.newPw}
                />
              </FieldWrap>

              <FieldWrap error={pwErrors.confirmPw}>
                <label style={LABEL}>Confirm New Password *</label>
                <PasswordInput
                  value={confirmPw}
                  onChange={(v) => { setConfirmPw(v); clearPwError('confirmPw') }}
                  show={showConfirmPw}
                  onToggle={() => setShowConfirmPw(v => !v)}
                  hasError={!!pwErrors.confirmPw}
                />
              </FieldWrap>

              {newPw.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                    {[1, 2, 3, 4].map((lvl) => (
                      <div key={lvl} style={{
                        flex: 1, height: 3,
                        background: passwordStrength(newPw) >= lvl
                          ? lvl <= 1 ? '#c0392b' : lvl === 2 ? '#e67e22' : lvl === 3 ? '#F5C518' : '#27ae60'
                          : '#1c1e2a',
                        transition: 'background 0.2s',
                      }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 8, color: '#555', letterSpacing: 1, textTransform: 'uppercase', fontFamily: FONT }}>
                    {['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength(newPw)]}
                  </div>
                </div>
              )}

            </form>
          </div>

        </div>
      </div>

      {toast && <Toast message={toast.message} ok={toast.ok} />}
    </AppLayout>
  )
}

function passwordStrength(pw: string): number {
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}
