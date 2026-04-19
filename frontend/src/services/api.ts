import type { LoginResponse, User, Role, CreateUserRequest, UpdateUserRequest } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token')
  const isFormData = options?.body instanceof FormData
  const headers: HeadersInit = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers ?? {}),
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(body || `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

function buildUserFormData(
  data: CreateUserRequest | UpdateUserRequest,
  image?: File,
): FormData {
  const fd = new FormData()
  fd.append('name', data.name)
  fd.append('email', data.email)
  fd.append('roleId', data.roleId)
  if ('password' in data) fd.append('password', data.password)
  if (data.phoneNumber) fd.append('phoneNumber', data.phoneNumber)
  if (data.address) fd.append('address', data.address)
  if (data.dateOfBirth) fd.append('dateOfBirth', data.dateOfBirth)
  if (image) fd.append('profileImage', image)
  return fd
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
  },

  users: {
    list: () => request<User[]>('/api/users'),
    getById: (id: string) => request<User>(`/api/users/${id}`),
    create: (data: CreateUserRequest, image?: File) =>
      request<User>('/api/users', {
        method: 'POST',
        body: buildUserFormData(data, image),
      }),
    update: (id: string, data: UpdateUserRequest, image?: File) =>
      request<User>(`/api/users/${id}`, {
        method: 'PUT',
        body: buildUserFormData(data, image),
      }),
    delete: (id: string) =>
      request<void>(`/api/users/${id}`, { method: 'DELETE' }),
  },

  roles: {
    list: () => request<Role[]>('/api/roles'),
  },

  profile: {
    get: () => request<User>('/api/profile'),
    update: (data: { name: string; email: string; phoneNumber?: string; address?: string; dateOfBirth?: string }, image?: File) => {
      const fd = new FormData()
      fd.append('name', data.name)
      fd.append('email', data.email)
      if (data.phoneNumber) fd.append('phoneNumber', data.phoneNumber)
      if (data.address) fd.append('address', data.address)
      if (data.dateOfBirth) fd.append('dateOfBirth', data.dateOfBirth)
      if (image) fd.append('profileImage', image)
      return request<User>('/api/profile', { method: 'PUT', body: fd })
    },
    changePassword: (currentPassword: string, newPassword: string) =>
      request<void>('/api/profile/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      }),
  },
}
