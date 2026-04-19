export type FormResult = 'W' | 'D' | 'L'

export interface HeroStat {
  num: number | string
  label: string
}

export interface MatchTeam {
  name: string
  score: number | string
  isWinner: boolean
}

export type MatchStatus = 'live' | 'ft' | 'upcoming'

export interface Match {
  id: string
  date: string
  time: string
  homeTeam: MatchTeam
  awayTeam: MatchTeam
  status: MatchStatus
  statusLabel: string
}

export interface StandingRow {
  position: number
  teamName: string
  played: number
  won: number
  drawn: number
  lost: number
  goalDiff: string
  form: FormResult[]
  points: number
  qualified: boolean
}

export interface Team {
  id: string
  abbreviation: string
  name: string
  status: 'approved' | 'pending'
}

export interface StatCard {
  num: number | string
  label: string
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  phoneNumber?: string
  address?: string
  dateOfBirth?: string
  profileImage?: string
  createdAt: string
}

export interface UpdateUserRequest {
  name: string
  email: string
  roleId: string
  phoneNumber?: string
  address?: string
  dateOfBirth?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface Role {
  id: string
  name: string
}

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  roleId: string
  phoneNumber?: string
  address?: string
  dateOfBirth?: string
}
