import { useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import TabNav, { type Tab } from '../components/TabNav'
import MatchCard from '../components/MatchCard'
import StandingsTable from '../components/StandingsTable'
import TeamCard from '../components/TeamCard'
import StatsCard from '../components/StatsCard'
import SectionHeader from '../components/SectionHeader'
import type { Match, StandingRow, Team, StatCard } from '../types'

// ── Static seed data (replace with API calls) ──────────────
const MATCHES: Match[] = [
  {
    id: '1',
    date: 'Today',
    time: '20:45',
    homeTeam: { name: 'FC Riverside', score: 2, isWinner: true },
    awayTeam: { name: 'City Athletic', score: 0, isWinner: false },
    status: 'live',
    statusLabel: "Live 67'",
  },
  {
    id: '2',
    date: 'Apr 14',
    time: '18:00',
    homeTeam: { name: 'Red Eagles', score: 3, isWinner: true },
    awayTeam: { name: 'Blue Stars', score: 1, isWinner: false },
    status: 'ft',
    statusLabel: 'FT',
  },
  {
    id: '3',
    date: 'Apr 17',
    time: '19:30',
    homeTeam: { name: 'Thunder FC', score: '—', isWinner: true },
    awayTeam: { name: 'United SC', score: '—', isWinner: true },
    status: 'upcoming',
    statusLabel: 'Apr 17',
  },
]

const STANDINGS: StandingRow[] = [
  {
    position: 1,
    teamName: 'FC Riverside',
    played: 10,
    won: 8,
    drawn: 1,
    lost: 1,
    goalDiff: '+14',
    form: ['W', 'W', 'W', 'D', 'W'],
    points: 25,
    qualified: true,
  },
  {
    position: 2,
    teamName: 'Red Eagles',
    played: 10,
    won: 7,
    drawn: 2,
    lost: 1,
    goalDiff: '+11',
    form: ['W', 'D', 'W', 'W', 'L'],
    points: 23,
    qualified: true,
  },
  {
    position: 3,
    teamName: 'Thunder FC',
    played: 10,
    won: 5,
    drawn: 3,
    lost: 2,
    goalDiff: '+5',
    form: ['D', 'W', 'L', 'W', 'D'],
    points: 18,
    qualified: false,
  },
  {
    position: 4,
    teamName: 'Blue Stars',
    played: 10,
    won: 4,
    drawn: 2,
    lost: 4,
    goalDiff: '-2',
    form: ['L', 'W', 'L', 'D', 'W'],
    points: 14,
    qualified: false,
  },
]

const TEAMS: Team[] = [
  { id: '1', abbreviation: 'FCR', name: 'FC Riverside', status: 'approved' },
  { id: '2', abbreviation: 'RE', name: 'Red Eagles', status: 'approved' },
  { id: '3', abbreviation: 'TFC', name: 'Thunder FC', status: 'approved' },
  { id: '4', abbreviation: 'BS', name: 'Blue Stars', status: 'pending' },
]

const STATS: StatCard[] = [
  { num: 4, label: 'Tournaments' },
  { num: 16, label: 'Teams' },
  { num: 312, label: 'Players' },
  { num: 127, label: 'Goals' },
]

const HERO_STATS = [
  { num: 16, label: 'Teams' },
  { num: 48, label: 'Matches' },
  { num: 127, label: 'Goals' },
  { num: 312, label: 'Players' },
]
// ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Fixtures & Results')

  return (
    <div style={{ background: '#0a0e1a', minHeight: '100vh' }}>
      <Navbar activeLink="Fixtures" />

      <Hero
        eyebrow="Season 2025 / 2026"
        titleLine1="City Soccer"
        titleLine2="Tournament"
        subtitle="Round of 16 · April 2026"
        stats={HERO_STATS}
      />

      <TabNav activeTab={activeTab} onChange={setActiveTab} />

      {/* Fixtures & Results */}
      {activeTab === 'Fixtures & Results' && (
        <div style={{ padding: '28px 24px 0' }}>
          <SectionHeader title="Latest Matches" viewAllLabel="View All →" onViewAll={() => {}} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {MATCHES.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </div>
      )}

      {/* Standings */}
      {activeTab === 'Standings' && (
        <div style={{ padding: '28px 24px 0' }}>
          <SectionHeader title="Standings" viewAllLabel="Full Table →" onViewAll={() => {}} />
          <StandingsTable rows={STANDINGS} />
        </div>
      )}

      {/* Teams */}
      {activeTab === 'Teams' && (
        <div style={{ padding: '28px 24px 0' }}>
          <SectionHeader title="Teams" viewAllLabel="All Teams →" onViewAll={() => {}} />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 8,
            }}
          >
            {TEAMS.map((t) => (
              <TeamCard key={t.id} team={t} />
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      {activeTab === 'Stats' && (
        <div style={{ padding: '28px 24px 0' }}>
          <SectionHeader title="Overview Stats" />
        </div>
      )}

      {/* Stats row — always visible */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
          padding: '24px 24px 0',
        }}
      >
        {STATS.map((s) => (
          <StatsCard key={s.label} stat={s} />
        ))}
      </div>

      <div style={{ height: 32 }} />
    </div>
  )
}
