import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react'
import AppLayout from '../components/AppLayout'
import { api } from '../services/api'
import type { Tournament, CreateTournamentRequest, UpdateTournamentRequest, User } from '../types'

const FONT = "'Arial Black', Arial, sans-serif"

const INPUT_STYLE: React.CSSProperties = {
  width: '100%', background: '#0a0e1a', border: '1px solid #1c1e2a',
  color: '#fff', padding: '9px 12px', fontSize: 13,
  outline: 'none', fontFamily: FONT, boxSizing: 'border-box',
}

const LABEL_STYLE: React.CSSProperties = {
  display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: 2,
  textTransform: 'uppercase' as const, color: '#555', marginBottom: 6, fontFamily: FONT,
}

const TOURNAMENT_TYPES = ['5s', '7s', '9s', '11s'] as const

function FormField({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={LABEL_STYLE}>{label}</label>
      {children}
      {error && <div className="field-error">{error}</div>}
    </div>
  )
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 24 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: '#111520', border: '1px solid #1c1e2a', borderTop: '2px solid #F5C518', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 3, textTransform: 'uppercase', color: '#fff', fontFamily: FONT, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'inline-block', width: 3, height: 16, background: '#F5C518', flexShrink: 0 }} />
            {title}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 18, lineHeight: 1, fontFamily: FONT }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#F5C518')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = '#555')}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function LogoCell({ logo, name }: { logo?: string; name: string }) {
  if (logo) {
    return (
      <img src={`data:image/*;base64,${logo}`} alt={name}
        style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid #2a2810' }} />
    )
  }
  return (
    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1c1e2a', border: '1px solid #2a2810', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    </div>
  )
}

function ActionBtn({ onClick, label, danger = false }: { onClick: () => void; label: string; danger?: boolean }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: 'none', border: `1px solid ${danger ? (hov ? '#c0392b' : '#1c1e2a') : hov ? '#F5C518' : '#1c1e2a'}`,
        color: danger ? (hov ? '#c0392b' : '#555') : hov ? '#F5C518' : '#555',
        padding: '4px 12px', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
        cursor: 'pointer', fontFamily: FONT, marginLeft: 6, transition: 'color 0.15s, border-color 0.15s',
      }}>
      {label}
    </button>
  )
}

interface TournamentFormData {
  name: string
  type: string
  numberOfTeams: string
  isActive: boolean
}

const EMPTY_FORM: TournamentFormData = { name: '', type: '11s', numberOfTeams: '', isActive: true }

export default function TournamentsPage() {
  const currentUser: User | null = (() => {
    try { return JSON.parse(localStorage.getItem('user') ?? 'null') } catch { return null }
  })()
  const isSuperAdmin = currentUser?.role === 'SuperAdmin'

  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Tournament | null>(null)
  const [form, setForm] = useState<TournamentFormData>(EMPTY_FORM)
  const [logoFile, setLogoFile] = useState<File | undefined>()
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<Tournament | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    setPageError('')
    try {
      setTournaments(await api.tournaments.list())
    } catch (e) {
      setPageError(e instanceof Error ? e.message : 'Failed to load tournaments.')
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setLogoFile(undefined)
    setLogoPreview(null)
    setFormErrors({})
    setFormError('')
    setShowModal(true)
  }

  function openEdit(t: Tournament) {
    setEditing(t)
    setForm({ name: t.name, type: t.type, numberOfTeams: String(t.numberOfTeams), isActive: t.isActive })
    setLogoFile(undefined)
    setLogoPreview(t.logo ? `data:image/*;base64,${t.logo}` : null)
    setFormErrors({})
    setFormError('')
    setShowModal(true)
  }

  function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    const reader = new FileReader()
    reader.onload = ev => setLogoPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Tournament name is required.'
    if (!form.type) errs.type = 'Type is required.'
    const n = parseInt(form.numberOfTeams)
    if (!form.numberOfTeams || isNaN(n) || n < 2) errs.numberOfTeams = 'Must be a number of at least 2.'
    return errs
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setFormErrors(errs); return }
    setFormErrors({})
    setFormError('')
    setFormLoading(true)
    try {
      if (editing) {
        const req: UpdateTournamentRequest = { name: form.name, type: form.type, numberOfTeams: parseInt(form.numberOfTeams), isActive: form.isActive }
        const updated = await api.tournaments.update(editing.id, req, logoFile)
        setTournaments(prev => prev.map(t => t.id === updated.id ? updated : t))
      } else {
        const req: CreateTournamentRequest = { name: form.name, type: form.type, numberOfTeams: parseInt(form.numberOfTeams), isActive: form.isActive }
        const created = await api.tournaments.create(req, logoFile)
        setTournaments(prev => [created, ...prev])
      }
      setShowModal(false)
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Operation failed.')
    } finally {
      setFormLoading(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await api.tournaments.delete(deleteTarget.id)
      setTournaments(prev => prev.filter(t => t.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (e) {
      setPageError(e instanceof Error ? e.message : 'Delete failed.')
    } finally {
      setDeleteLoading(false)
    }
  }

  const TH: React.CSSProperties = { fontSize: 9, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#333', padding: '10px 14px', textAlign: 'left', fontFamily: FONT, whiteSpace: 'nowrap' }
  const TD: React.CSSProperties = { padding: '12px 14px', fontSize: 13, color: '#fff', fontFamily: FONT, borderBottom: '1px solid #0f1118', verticalAlign: 'middle' }

  return (
    <AppLayout>
      <div style={{ padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 14, borderBottom: '1px solid #16181f', marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: '#fff', letterSpacing: '3px', textTransform: 'uppercase', fontFamily: FONT, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'inline-block', width: 3, height: 16, background: '#F5C518', flexShrink: 0 }} />
            Tournaments
          </div>
          {isSuperAdmin && (
            <button onClick={openCreate} style={{ background: '#F5C518', color: '#000', border: 'none', padding: '8px 18px', fontSize: 10, fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: FONT }}>
              + New Tournament
            </button>
          )}
        </div>

        {pageError && (
          <div style={{ color: '#c0392b', fontSize: 11, padding: '8px 12px', border: '1px solid #3d1010', background: 'rgba(192,57,43,0.05)', marginBottom: 16, fontFamily: FONT }}>
            {pageError}
          </div>
        )}

        {/* Table */}
        <div style={{ background: '#111520', border: '1px solid #1c1e2a', overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#555', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontFamily: FONT }}>Loading…</div>
          ) : tournaments.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#444', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontFamily: FONT }}>No tournaments found</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #16181f' }}>
                  <th style={TH}></th>
                  <th style={TH}>Name</th>
                  <th style={TH}>Type</th>
                  <th style={TH}>Teams</th>
                  <th style={TH}>Status</th>
                  <th style={TH}>Created By</th>
                  <th style={TH}>Created On</th>
                  <th style={TH}>Modified By</th>
                  <th style={TH}>Modified On</th>
                  {isSuperAdmin && <th style={{ ...TH, textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {tournaments.map(t => (
                  <TournamentRow key={t.id} tournament={t} TD={TD} isSuperAdmin={isSuperAdmin}
                    onEdit={() => openEdit(t)} onDelete={() => setDeleteTarget(t)} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <Modal title={editing ? 'Edit Tournament' : 'New Tournament'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} noValidate>
            {/* Logo picker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div onClick={() => fileRef.current?.click()} style={{ width: 64, height: 64, borderRadius: '50%', cursor: 'pointer', border: '2px solid #1c1e2a', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0e1a', flexShrink: 0 }}
                onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = '#F5C518')}
                onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = '#1c1e2a')}>
                {logoPreview
                  ? <img src={logoPreview} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></svg>
                }
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
              <div>
                <button type="button" onClick={() => fileRef.current?.click()} style={{ background: 'none', border: '1px solid #1c1e2a', color: '#aaa', padding: '6px 14px', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', fontFamily: FONT }}>
                  {logoPreview ? 'Change Logo' : 'Upload Logo'}
                </button>
                <div style={{ fontSize: 9, color: '#444', marginTop: 4, letterSpacing: 1, fontFamily: FONT }}>JPG, PNG — optional</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <FormField label="Tournament Name *" error={formErrors.name}>
                <input type="text" value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setFormErrors(p => ({ ...p, name: '' })) }}
                  style={{ ...INPUT_STYLE, borderColor: formErrors.name ? '#c0392b' : '#1c1e2a' }} />
              </FormField>

              <FormField label="Type *" error={formErrors.type}>
                <select value={form.type} onChange={e => { setForm(f => ({ ...f, type: e.target.value })); setFormErrors(p => ({ ...p, type: '' })) }}
                  style={{ ...INPUT_STYLE, cursor: 'pointer', borderColor: formErrors.type ? '#c0392b' : '#1c1e2a' }}>
                  {TOURNAMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </FormField>

              <FormField label="Number of Teams *" error={formErrors.numberOfTeams}>
                <input type="number" min={2} value={form.numberOfTeams}
                  onChange={e => { setForm(f => ({ ...f, numberOfTeams: e.target.value })); setFormErrors(p => ({ ...p, numberOfTeams: '' })) }}
                  style={{ ...INPUT_STYLE, borderColor: formErrors.numberOfTeams ? '#c0392b' : '#1c1e2a' }} />
              </FormField>

              <FormField label="Status">
                <select value={form.isActive ? 'true' : 'false'} onChange={e => setForm(f => ({ ...f, isActive: e.target.value === 'true' }))}
                  style={{ ...INPUT_STYLE, cursor: 'pointer' }}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </FormField>
            </div>

            {formError && (
              <div style={{ color: '#c0392b', fontSize: 11, padding: '8px 12px', border: '1px solid #3d1010', background: 'rgba(192,57,43,0.05)', marginBottom: 16, fontFamily: FONT }}>
                {formError}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowModal(false)}
                style={{ background: 'none', border: '1px solid #1c1e2a', color: '#555', padding: '9px 20px', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', fontFamily: FONT }}>
                Cancel
              </button>
              <button type="submit" disabled={formLoading}
                style={{ background: '#F5C518', color: '#000', border: 'none', padding: '9px 20px', fontSize: 10, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase', cursor: formLoading ? 'not-allowed' : 'pointer', opacity: formLoading ? 0.7 : 1, fontFamily: FONT }}>
                {formLoading ? 'Saving…' : editing ? 'Save Changes' : 'Create Tournament'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <Modal title="Delete Tournament" onClose={() => setDeleteTarget(null)}>
          <p style={{ color: '#aaa', fontSize: 13, marginBottom: 24, lineHeight: 1.6, fontFamily: FONT }}>
            Are you sure you want to delete{' '}
            <span style={{ color: '#fff', fontWeight: 700 }}>{deleteTarget.name}</span>?
            This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setDeleteTarget(null)}
              style={{ background: 'none', border: '1px solid #1c1e2a', color: '#555', padding: '9px 20px', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', fontFamily: FONT }}>
              Cancel
            </button>
            <button onClick={handleDelete} disabled={deleteLoading}
              style={{ background: '#c0392b', color: '#fff', border: 'none', padding: '9px 20px', fontSize: 10, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase', cursor: deleteLoading ? 'not-allowed' : 'pointer', opacity: deleteLoading ? 0.7 : 1, fontFamily: FONT }}>
              {deleteLoading ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </AppLayout>
  )
}

function TournamentRow({ tournament: t, TD, isSuperAdmin, onEdit, onDelete }: {
  tournament: Tournament; TD: React.CSSProperties; isSuperAdmin: boolean; onEdit: () => void; onDelete: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const fmt = (d?: string) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

  return (
    <tr onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? '#0d1020' : 'transparent' }}>
      <td style={{ ...TD, width: 52 }}><LogoCell logo={t.logo} name={t.name} /></td>
      <td style={{ ...TD, fontWeight: 700 }}>{t.name}</td>
      <td style={TD}>
        <span style={{ fontSize: 9, fontWeight: 900, color: '#F5C518', letterSpacing: 2, textTransform: 'uppercase', fontFamily: "'Arial Black', Arial, sans-serif", background: 'rgba(245,197,24,0.08)', border: '1px solid #2a2810', padding: '3px 8px' }}>
          {t.type}
        </span>
      </td>
      <td style={{ ...TD, color: '#F5C518', fontWeight: 700 }}>{t.numberOfTeams}</td>
      <td style={TD}>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: "'Arial Black', Arial, sans-serif", color: t.isActive ? '#27ae60' : '#555', border: `1px solid ${t.isActive ? '#1a3d25' : '#1c1e2a'}`, background: t.isActive ? 'rgba(39,174,96,0.08)' : 'transparent', padding: '3px 8px' }}>
          {t.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td style={{ ...TD, color: '#888' }}>{t.createdByName ?? '—'}</td>
      <td style={{ ...TD, color: '#888' }}>{fmt(t.createdAt)}</td>
      <td style={{ ...TD, color: '#888' }}>{t.modifiedByName ?? '—'}</td>
      <td style={{ ...TD, color: '#888' }}>{fmt(t.modifiedAt)}</td>
      {isSuperAdmin && (
        <td style={{ ...TD, textAlign: 'right', whiteSpace: 'nowrap' }}>
          <ActionBtn onClick={onEdit} label="Edit" />
          <ActionBtn onClick={onDelete} label="Delete" danger />
        </td>
      )}
    </tr>
  )
}
