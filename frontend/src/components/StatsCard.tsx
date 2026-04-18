import type { StatCard } from '../types'

interface Props {
  stat: StatCard
}

export default function StatsCard({ stat }: Props) {
  return (
    <div
      style={{
        background: '#111520',
        border: '1px solid #1c1e2a',
        borderTop: '2px solid #F5C518',
        padding: 16,
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 900, color: '#F5C518', lineHeight: 1 }}>
        {stat.num}
      </div>
      <div
        style={{
          fontSize: 9,
          color: '#444',
          textTransform: 'uppercase',
          letterSpacing: 2,
          marginTop: 4,
        }}
      >
        {stat.label}
      </div>
    </div>
  )
}
