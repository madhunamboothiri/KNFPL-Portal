interface Props {
  title: string
  viewAllLabel?: string
  onViewAll?: () => void
}

export default function SectionHeader({ title, viewAllLabel = 'View All →', onViewAll }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
        paddingBottom: 10,
        borderBottom: '1px solid #16181f',
      }}
    >
      <div className="section-title-bar">
        <span
          style={{
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: '#fff',
          }}
        >
          {title}
        </span>
      </div>
      {onViewAll && (
        <button
          onClick={onViewAll}
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: '#F5C518',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
          }}
        >
          {viewAllLabel}
        </button>
      )}
    </div>
  )
}
