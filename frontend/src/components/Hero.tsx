import type { HeroStat } from '../types'

interface Props {
  eyebrow: string
  titleLine1: string
  titleLine2: string
  subtitle: string
  stats: HeroStat[]
}

export default function Hero({ eyebrow, titleLine1, titleLine2, subtitle, stats }: Props) {
  return (
    <div
      className="hero-section"
      style={{
        background: '#0a0e1a',
        borderBottom: '1px solid #1c1f0a',
        padding: '48px 24px 40px',
      }}
    >
      <span
        style={{
          fontSize: 32,
          position: 'absolute',
          right: 24,
          top: 24,
          opacity: 0.15,
          pointerEvents: 'none',
        }}
      >
        🏆
      </span>

      <p
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 3,
          color: '#F5C518',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}
      >
        {eyebrow}
      </p>

      <h1
        style={{
          fontSize: 38,
          fontWeight: 900,
          lineHeight: 1.05,
          textTransform: 'uppercase',
          letterSpacing: -1,
          marginBottom: 8,
        }}
      >
        {titleLine1}
        <br />
        <span style={{ color: '#F5C518' }}>{titleLine2}</span>
      </h1>

      <p
        style={{
          fontSize: 13,
          color: '#666',
          letterSpacing: 1,
          textTransform: 'uppercase',
          marginBottom: 28,
        }}
      >
        {subtitle}
      </p>

      <div style={{ display: 'flex', gap: 36 }}>
        {stats.map((stat) => (
          <div key={stat.label}>
            <div
              style={{
                fontSize: 30,
                fontWeight: 900,
                color: '#F5C518',
                lineHeight: 1,
              }}
            >
              {stat.num}
            </div>
            <div
              style={{
                fontSize: 10,
                color: '#555',
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginTop: 3,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
