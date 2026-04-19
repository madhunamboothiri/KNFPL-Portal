import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react'
import AppLayout from '../components/AppLayout'
import DobMaskInput from '../components/DobMaskInput'
import { api } from '../services/api'
import type { User, Role, CreateUserRequest, UpdateUserRequest } from '../types'

const FONT = "'Arial Black', Arial, sans-serif"

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  background: '#0a0e1a',
  border: '1px solid #1c1e2a',
  color: '#fff',
  padding: '9px 12px',
  fontSize: 13,
  outline: 'none',
  fontFamily: FONT,
  boxSizing: 'border-box',
}

const LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: 2,
  textTransform: 'uppercase' as const,
  color: '#555',
  marginBottom: 6,
  fontFamily: FONT,
}

function FormField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={LABEL_STYLE}>{label}</label>
      {children}
    </div>
  )
}

interface ModalProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: 24,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: '#111520',
          border: '1px solid #1c1e2a',
          borderTop: '2px solid #F5C518',
          width: '100%',
          maxWidth: 560,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 28,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: '#fff',
              fontFamily: FONT,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 3,
                height: 16,
                background: '#F5C518',
                flexShrink: 0,
              }}
            />
            {title}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#555',
              cursor: 'pointer',
              fontSize: 18,
              lineHeight: 1,
              fontFamily: FONT,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#F5C518')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#555')}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function AvatarCell({ user }: { user: User }) {
  if (user.profileImage) {
    return (
      <img
        src={`data:image/jpeg;base64,${user.profileImage}`}
        alt={user.name}
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '1px solid #2a2810',
        }}
      />
    )
  }
  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: '#1c1e2a',
        border: '1px solid #2a2810',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 900,
        color: '#F5C518',
        fontFamily: FONT,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}

interface UserFormData {
  name: string
  email: string
  password: string
  roleId: string
  phoneNumber: string
  address: string
  dateOfBirth: string
}

const EMPTY_FORM: UserFormData = {
  name: '',
  email: '',
  password: '',
  roleId: '',
  phoneNumber: '',
  address: '',
  dateOfBirth: '',
}

export default function UsersPage() {
  const currentUserId: string | null = (() => {
    try { return (JSON.parse(localStorage.getItem('user') ?? 'null') as User | null)?.id ?? null } catch { return null }
  })()

  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<UserFormData>(EMPTY_FORM)
  const [imageFile, setImageFile] = useState<File | undefined>()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const [u, r] = await Promise.all([api.users.list(), api.roles.list()])
      setUsers(u.filter((x) => x.id !== currentUserId))
      setRoles(r)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditingUser(null)
    setFormData(EMPTY_FORM)
    setImageFile(undefined)
    setImagePreview(null)
    setFormError('')
    setShowModal(true)
  }

  function openEdit(user: User) {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      roleId: roles.find((r) => r.name === user.role)?.id ?? '',
      phoneNumber: user.phoneNumber ?? '',
      address: user.address ?? '',
      dateOfBirth: user.dateOfBirth ?? '',
    })
    setImageFile(undefined)
    setImagePreview(user.profileImage ? `data:image/jpeg;base64,${user.profileImage}` : null)
    setFormError('')
    setShowModal(true)
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    setFormLoading(true)

    try {
      if (editingUser) {
        const req: UpdateUserRequest = {
          name: formData.name,
          email: formData.email,
          roleId: formData.roleId,
          phoneNumber: formData.phoneNumber || undefined,
          address: formData.address || undefined,
          dateOfBirth: formData.dateOfBirth || undefined,
        }
        const updated = await api.users.update(editingUser.id, req, imageFile)
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
      } else {
        const req: CreateUserRequest = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          roleId: formData.roleId,
          phoneNumber: formData.phoneNumber || undefined,
          address: formData.address || undefined,
          dateOfBirth: formData.dateOfBirth || undefined,
        }
        const created = await api.users.create(req, imageFile)
        setUsers((prev) => [created, ...prev])
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
      await api.users.delete(deleteTarget.id)
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed.')
    } finally {
      setDeleteLoading(false)
    }
  }

  function field(key: keyof UserFormData, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const TH: React.CSSProperties = {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#333',
    padding: '10px 14px',
    textAlign: 'left',
    fontFamily: FONT,
    whiteSpace: 'nowrap',
  }

  const TD: React.CSSProperties = {
    padding: '12px 14px',
    fontSize: 13,
    color: '#fff',
    fontFamily: FONT,
    borderBottom: '1px solid #0f1118',
    verticalAlign: 'middle',
  }

  return (
    <AppLayout>
      <div style={{ padding: '32px 24px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 14,
            borderBottom: '1px solid #16181f',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              fontFamily: FONT,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 3,
                height: 16,
                background: '#F5C518',
                flexShrink: 0,
              }}
            />
            Users
          </div>
          <button
            onClick={openCreate}
            style={{
              background: '#F5C518',
              color: '#000',
              border: 'none',
              padding: '8px 18px',
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: FONT,
            }}
          >
            + Add User
          </button>
        </div>

        {error && (
          <div
            style={{
              color: '#F5C518',
              fontSize: 11,
              padding: '8px 12px',
              border: '1px solid #2a2810',
              background: 'rgba(245,197,24,0.05)',
              marginBottom: 16,
              fontFamily: FONT,
            }}
          >
            {error}
          </div>
        )}

        {/* Table */}
        <div
          style={{
            background: '#111520',
            border: '1px solid #1c1e2a',
            overflowX: 'auto',
          }}
        >
          {loading ? (
            <div
              style={{
                padding: '40px',
                textAlign: 'center',
                color: '#555',
                fontSize: 11,
                letterSpacing: 2,
                textTransform: 'uppercase',
                fontFamily: FONT,
              }}
            >
              Loading…
            </div>
          ) : users.length === 0 ? (
            <div
              style={{
                padding: '40px',
                textAlign: 'center',
                color: '#444',
                fontSize: 11,
                letterSpacing: 2,
                textTransform: 'uppercase',
                fontFamily: FONT,
              }}
            >
              No users found
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #16181f' }}>
                  <th style={TH}></th>
                  <th style={TH}>Name</th>
                  <th style={TH}>Email</th>
                  <th style={TH}>Phone</th>
                  <th style={TH}>Role</th>
                  <th style={TH}>DOB</th>
                  <th style={{ ...TH, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    TD={TD}
                    onEdit={() => openEdit(user)}
                    onDelete={() => setDeleteTarget(user)}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <Modal
          title={editingUser ? 'Edit User' : 'Add User'}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit}>
            {/* Avatar preview + upload */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1px solid #2a2810',
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: '#1c1e2a',
                    border: '1px solid #2a2810',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    color: '#444',
                    flexShrink: 0,
                  }}
                >
                  ◎
                </div>
              )}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    background: 'none',
                    border: '1px solid #1c1e2a',
                    color: '#aaa',
                    padding: '6px 14px',
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    fontFamily: FONT,
                  }}
                >
                  {imagePreview ? 'Change Photo' : 'Upload Photo'}
                </button>
                <div style={{ fontSize: 9, color: '#444', marginTop: 4, letterSpacing: 1, fontFamily: FONT }}>
                  JPG, PNG — stored in database
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <FormField label="Name *">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => field('name', e.target.value)}
                  required
                  style={INPUT_STYLE}
                />
              </FormField>
              <FormField label="Email *">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => field('email', e.target.value)}
                  required
                  style={INPUT_STYLE}
                />
              </FormField>
              {!editingUser && (
                <FormField label="Password *">
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => field('password', e.target.value)}
                    required
                    style={INPUT_STYLE}
                  />
                </FormField>
              )}
              <FormField label="Role *">
                <select
                  value={formData.roleId}
                  onChange={(e) => field('roleId', e.target.value)}
                  required
                  style={{ ...INPUT_STYLE, cursor: 'pointer' }}
                >
                  <option value="">Select role…</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Phone Number">
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => field('phoneNumber', e.target.value)}
                  style={INPUT_STYLE}
                />
              </FormField>
              <FormField label="Date of Birth">
                <DobMaskInput
                  value={formData.dateOfBirth}
                  onChange={(v) => field('dateOfBirth', v)}
                  style={INPUT_STYLE}
                />
              </FormField>
            </div>

            <FormField label="Address">
              <textarea
                value={formData.address}
                onChange={(e) => field('address', e.target.value)}
                rows={2}
                style={{ ...INPUT_STYLE, resize: 'vertical' }}
              />
            </FormField>

            {formError && (
              <div
                style={{
                  color: '#F5C518',
                  fontSize: 11,
                  padding: '8px 12px',
                  border: '1px solid #2a2810',
                  background: 'rgba(245,197,24,0.05)',
                  marginBottom: 16,
                  fontFamily: FONT,
                }}
              >
                {formError}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: '1px solid #1c1e2a',
                  color: '#555',
                  padding: '9px 20px',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: FONT,
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                style={{
                  background: '#F5C518',
                  color: '#000',
                  border: 'none',
                  padding: '9px 20px',
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  cursor: formLoading ? 'not-allowed' : 'pointer',
                  opacity: formLoading ? 0.7 : 1,
                  fontFamily: FONT,
                }}
              >
                {formLoading ? 'Saving…' : editingUser ? 'Save Changes' : 'Create User'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <Modal title="Delete User" onClose={() => setDeleteTarget(null)}>
          <p
            style={{
              color: '#aaa',
              fontSize: 13,
              marginBottom: 24,
              lineHeight: 1.6,
              fontFamily: FONT,
            }}
          >
            Are you sure you want to delete{' '}
            <span style={{ color: '#fff', fontWeight: 700 }}>{deleteTarget.name}</span>? This
            action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button
              onClick={() => setDeleteTarget(null)}
              style={{
                background: 'none',
                border: '1px solid #1c1e2a',
                color: '#555',
                padding: '9px 20px',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: FONT,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              style={{
                background: '#c0392b',
                color: '#fff',
                border: 'none',
                padding: '9px 20px',
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: 2,
                textTransform: 'uppercase',
                cursor: deleteLoading ? 'not-allowed' : 'pointer',
                opacity: deleteLoading ? 0.7 : 1,
                fontFamily: FONT,
              }}
            >
              {deleteLoading ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </AppLayout>
  )
}

function UserRow({
  user,
  TD,
  onEdit,
  onDelete,
}: {
  user: User
  TD: React.CSSProperties
  onEdit: () => void
  onDelete: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? '#111520' : 'transparent' }}
    >
      <td style={{ ...TD, width: 52 }}>
        <AvatarCell user={user} />
      </td>
      <td style={{ ...TD, fontWeight: 700 }}>{user.name}</td>
      <td style={{ ...TD, color: '#888' }}>{user.email}</td>
      <td style={{ ...TD, color: '#888' }}>{user.phoneNumber ?? '—'}</td>
      <td style={TD}>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: '#F5C518',
            fontFamily: "'Arial Black', Arial, sans-serif",
          }}
        >
          {user.role}
        </span>
      </td>
      <td style={{ ...TD, color: '#888' }}>
        {user.dateOfBirth
          ? new Date(user.dateOfBirth).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : '—'}
      </td>
      <td style={{ ...TD, textAlign: 'right', whiteSpace: 'nowrap' }}>
        <ActionBtn onClick={onEdit} label="Edit" />
        <ActionBtn onClick={onDelete} label="Delete" danger />
      </td>
    </tr>
  )
}

function ActionBtn({
  onClick,
  label,
  danger = false,
}: {
  onClick: () => void
  label: string
  danger?: boolean
}) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'none',
        border: `1px solid ${danger ? (hov ? '#c0392b' : '#1c1e2a') : hov ? '#F5C518' : '#1c1e2a'}`,
        color: danger ? (hov ? '#c0392b' : '#555') : hov ? '#F5C518' : '#555',
        padding: '4px 12px',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: 2,
        textTransform: 'uppercase',
        cursor: 'pointer',
        fontFamily: "'Arial Black', Arial, sans-serif",
        marginLeft: 6,
        transition: 'color 0.15s, border-color 0.15s',
      }}
    >
      {label}
    </button>
  )
}
