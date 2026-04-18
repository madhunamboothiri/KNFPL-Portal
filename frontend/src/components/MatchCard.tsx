import type { Match } from '../types'

interface Props {
  match: Match
}

function StatusBadge({ status, label }: { status: Match['status']; label: string }) {
  const styles: Record<Match['status'], React.CSSProperties> = {
    live: { background: '#F5C518', color: '#000' },
    ft: { background: '#16181f', color: '#444' },
    upcoming: { border: '1px solid #2a2810', color: '#F5C518', background: 'transparent' },
  }
  return (
    <div
      style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: 2,
        textTransform: 'uppercase',
        padding: '4px 8px',
        minWidth: 64,
        textAlign: 'center',
        ...styles[status],
      }}
    >
      {label}
    </div>
  )
}

export default function MatchCard({ match }: Props) {
  return (
    <div
      style={{
        background: '#111520',
        border: '1px solid #1c1e2a',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = '#F5C518')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = '#1c1e2a')}
    >
      {/* Date/Time */}
      <div
        style={{
          fontSize: 10,
          color: '#444',
          textTransform: 'uppercase',
          letterSpacing: 1,
          minWidth: 70,
        }}
      >
        {match.date}
        <br />
        {match.time}
      </div>

      {/* Teams + Scores */}
      <div style={{ flex: 1 }}>
        {[match.homeTeam, match.awayTeam].map((team) => (
          <div
            key={team.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '3px 0',
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: team.isWinner ? '#fff' : '#555',
              }}
            >
              {team.name}
            </span>
            <span
              style={{
                fontSize: 15,
                fontWeight: 900,
                color: team.isWinner ? '#F5C518' : '#444',
                minWidth: 20,
                textAlign: 'center',
              }}
            >
              {team.score}
            </span>
          </div>
        ))}
      </div>

      <StatusBadge status={match.status} label={match.statusLabel} />
    </div>
  )
}
