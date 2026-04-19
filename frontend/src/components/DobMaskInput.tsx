import { useState, useEffect, useRef } from 'react'

interface Props {
  value: string // YYYY-MM-DD or ''
  onChange: (isoValue: string) => void
  style?: React.CSSProperties
  className?: string
  placeholder?: string
}

function toDisplay(iso: string): string {
  const parts = iso.split('-')
  if (parts.length !== 3 || parts[0].length !== 4) return ''
  return `${parts[2]}/${parts[1]}/${parts[0]}`
}

function toIso(display: string): string {
  const parts = display.split('/')
  if (parts.length !== 3 || parts[2].length !== 4) return ''
  return `${parts[2]}-${parts[1]}-${parts[0]}`
}

function applyMask(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  let out = digits.slice(0, 2)
  if (digits.length > 2) out += '/' + digits.slice(2, 4)
  if (digits.length > 4) out += '/' + digits.slice(4, 8)
  return out
}

export default function DobMaskInput({ value, onChange, style, className, placeholder = 'DD/MM/YYYY' }: Props) {
  const [display, setDisplay] = useState(() => toDisplay(value))
  const dateRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (value !== toIso(display)) {
      setDisplay(toDisplay(value))
    }
  }, [value])

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = applyMask(e.target.value)
    setDisplay(masked)
    onChange(toIso(masked))
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const iso = e.target.value
    setDisplay(toDisplay(iso))
    onChange(iso)
  }

  function openPicker() {
    dateRef.current?.showPicker()
  }

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <input
        type="text"
        value={display}
        onChange={handleTextChange}
        placeholder={placeholder}
        maxLength={10}
        className={className}
        style={{ ...style, paddingRight: 34 }}
      />

      {/* Hidden native date input — driven by showPicker() */}
      <input
        ref={dateRef}
        type="date"
        value={value}
        onChange={handleDateChange}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0, top: 0, right: 34 }}
        tabIndex={-1}
      />

      {/* Calendar icon button */}
      <button
        type="button"
        onClick={openPicker}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 34,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#555',
          padding: 0,
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#F5C518')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#555')}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>
    </div>
  )
}
