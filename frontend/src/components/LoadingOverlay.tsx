import '../styles/spinner.css'

interface Props {
  show: boolean
  /** Defaults to semi-dark. Pass a custom rgba to override. */
  backdrop?: string
}

/**
 * Renders an absolutely-positioned overlay with a centred spinner.
 * The parent element must have `position: relative` (or any non-static position).
 *
 * Usage:
 *   <div style={{ position: 'relative' }}>
 *     <LoadingOverlay show={loading} />
 *     ...content...
 *   </div>
 */
export default function LoadingOverlay({ show, backdrop = 'rgba(10,14,26,0.65)' }: Props) {
  if (!show) return null

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: backdrop,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        borderRadius: 'inherit',
      }}
    >
      <div className="knfpl-spinner" />
    </div>
  )
}
