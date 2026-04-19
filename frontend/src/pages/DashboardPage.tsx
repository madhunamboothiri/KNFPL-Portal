import AppLayout from '../components/AppLayout'

const ANALYTICS = [
  { num: '—', label: 'Total Tournaments' },
  { num: '—', label: 'Active Tournaments' },
  { num: '—', label: 'Total Players' },
]

export default function DashboardPage() {
  return (
    <AppLayout>
      <div style={{ padding: '32px 24px' }}>

        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              fontFamily: "'Arial Black', Arial, sans-serif",
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              paddingBottom: 14,
              borderBottom: '1px solid #16181f',
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
            Overview
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 10,
          }}
        >
          {ANALYTICS.map((item) => (
            <div
              key={item.label}
              style={{
                background: '#111520',
                border: '1px solid #1c1e2a',
                borderTop: '2px solid #F5C518',
                padding: '24px 20px',
              }}
            >
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 900,
                  color: '#F5C518',
                  fontFamily: "'Arial Black', Arial, sans-serif",
                  lineHeight: 1,
                  marginBottom: 10,
                }}
              >
                {item.num}
              </div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 400,
                  color: '#444',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontFamily: "'Arial Black', Arial, sans-serif",
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </AppLayout>
  )
}
