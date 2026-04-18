import type { Team } from '../types'

interface Props {
  team: Team
  onClick?: () => void
}

export default function TeamCard({ team, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#111520',
        border: '1px solid #1c1e2a',
        padding: '16px 12px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = '#F5C518')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = '#1c1e2a')}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: '#1c1e2a',
          margin: '0 auto 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 900,
          color: '#F5C518',
          border: '1px solid #2a2810',
        }}
      >
        {team.abbreviation}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{team.name}</div>
      <div
        style={{
          fontSize: 9,
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginTop: 3,
          color: team.status === 'approved' ? '#F5C518' : '#444',
        }}
      >
        {team.status}
      </div>
    </div>
  )
}
