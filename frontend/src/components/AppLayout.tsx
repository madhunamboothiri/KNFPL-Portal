import { useState } from 'react'
import Navbar from './Navbar'
import Sidebar, { SIDEBAR_COLLAPSED, SIDEBAR_EXPANDED } from './Sidebar'
import Footer from './Footer'

const NAVBAR_HEIGHT = 56
const FOOTER_HEIGHT = 40

interface Props {
  children: React.ReactNode
}

export default function AppLayout({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED

  return (
    <div style={{ background: '#0a0e1a', height: '100vh', overflow: 'hidden' }}>
      {/* Fixed left sidebar — full height */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      {/* Fixed top navbar — starts after sidebar */}
      <Navbar sidebarWidth={sidebarWidth} />

      {/* Scrollable content region */}
      <main
        style={{
          position: 'fixed',
          top: NAVBAR_HEIGHT,
          left: sidebarWidth,
          right: 0,
          bottom: FOOTER_HEIGHT,
          overflowY: 'auto',
          overflowX: 'hidden',
          background: '#0a0e1a',
          transition: 'left 0.2s ease',
        }}
      >
        {children}
      </main>

      {/* Fixed footer — full width minus sidebar */}
      <Footer sidebarWidth={sidebarWidth} />
    </div>
  )
}
