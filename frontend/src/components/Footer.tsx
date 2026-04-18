interface Props {
  sidebarWidth: number
}

const FOOTER_HEIGHT = 40

export default function Footer({ sidebarWidth }: Props) {
  return (
    <footer
      style={{
        position: 'fixed',
        bottom: 0,
        left: sidebarWidth,
        right: 0,
        height: FOOTER_HEIGHT,
        background: '#0a0e1a',
        borderTop: '1px solid #1c1e2a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 24,
        padding: '0 24px',
        zIndex: 100,
        transition: 'left 0.2s ease',
      }}
    >
      <span
        style={{
          fontSize: 9,
          color: '#333',
          letterSpacing: 2,
          textTransform: 'uppercase',
          fontFamily: "'Arial Black', Arial, sans-serif",
        }}
      >
        © {new Date().getFullYear()} Soccer Tournament Portal. All rights reserved.
      </span>
      <span
        style={{
          fontSize: 9,
          color: '#333',
          letterSpacing: 2,
          textTransform: 'uppercase',
          fontFamily: "'Arial Black', Arial, sans-serif",
        }}
      >
        v1.0.0
      </span>
    </footer>
  )
}
