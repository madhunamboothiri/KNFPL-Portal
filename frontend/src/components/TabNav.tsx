const TABS = ['Fixtures & Results', 'Standings', 'Teams', 'Stats'] as const
export type Tab = (typeof TABS)[number]

interface Props {
  activeTab: Tab
  onChange: (tab: Tab) => void
}

export default function TabNav({ activeTab, onChange }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        borderBottom: '1px solid #1c1e2a',
        padding: '0 24px',
      }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
              padding: '14px 16px',
              cursor: 'pointer',
              color: isActive ? '#F5C518' : '#555',
              borderBottom: `2px solid ${isActive ? '#F5C518' : 'transparent'}`,
              marginBottom: -1,
              background: 'none',
              border: 'none',
              borderBottomWidth: 2,
              borderBottomStyle: 'solid',
              borderBottomColor: isActive ? '#F5C518' : 'transparent',
            }}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}
