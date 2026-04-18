import type { StandingRow, FormResult } from '../types'

interface Props {
  rows: StandingRow[]
}

function FormDot({ result }: { result: FormResult }) {
  const colors: Record<FormResult, string> = {
    W: '#F5C518',
    D: '#555',
    L: '#222',
  }
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        margin: '0 1px',
        background: colors[result],
        border: result === 'L' ? '1px solid #333' : 'none',
      }}
    />
  )
}

const TH_STYLE: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: 2,
  textTransform: 'uppercase',
  color: '#333',
  padding: '8px 12px',
  textAlign: 'center',
  borderBottom: '1px solid #16181f',
}

const TD_STYLE: React.CSSProperties = {
  padding: '10px 12px',
  textAlign: 'center',
  color: '#888',
  borderBottom: '1px solid #0f1118',
  fontSize: 12,
}

export default function StandingsTable({ rows }: Props) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
      <thead>
        <tr>
          {['#', 'Team', 'P', 'W', 'D', 'L', 'GD', 'Form', 'Pts'].map((h, i) => (
            <th
              key={h}
              style={{ ...TH_STYLE, textAlign: i < 2 ? 'left' : 'center' }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={row.teamName}
            onMouseEnter={(e) => {
              Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(
                (td) => ((td as HTMLTableCellElement).style.background = '#111520'),
              )
            }}
            onMouseLeave={(e) => {
              Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(
                (td) => ((td as HTMLTableCellElement).style.background = ''),
              )
            }}
          >
            {/* Position */}
            <td style={{ ...TD_STYLE, textAlign: 'left', color: '#444', fontSize: 11, fontWeight: 700 }}>
              {row.qualified ? (
                <span
                  style={{
                    display: 'inline-block',
                    width: 20,
                    height: 20,
                    lineHeight: '20px',
                    textAlign: 'center',
                    fontSize: 10,
                    fontWeight: 900,
                    background: '#F5C518',
                    color: '#000',
                  }}
                >
                  {row.position}
                </span>
              ) : (
                row.position
              )}
            </td>
            {/* Team */}
            <td style={{ ...TD_STYLE, textAlign: 'left', fontWeight: 700, color: '#fff', fontSize: 13 }}>
              {row.teamName}
            </td>
            <td style={TD_STYLE}>{row.played}</td>
            <td style={TD_STYLE}>{row.won}</td>
            <td style={TD_STYLE}>{row.drawn}</td>
            <td style={TD_STYLE}>{row.lost}</td>
            <td style={TD_STYLE}>{row.goalDiff}</td>
            {/* Form */}
            <td style={TD_STYLE}>
              {row.form.map((r, i) => (
                <FormDot key={i} result={r} />
              ))}
            </td>
            {/* Points */}
            <td style={{ ...TD_STYLE, color: '#F5C518', fontWeight: 900, fontSize: 14 }}>
              {row.points}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
