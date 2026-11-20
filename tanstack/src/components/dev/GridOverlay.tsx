import {cn} from 'cnfast'
import type {CSSProperties} from 'react'

/** Placeholder until the layout grid is decided. */
const COLUMNS = 12
const MOBILE_COLUMNS = 3
const COLUMN_COLOR = '#ff2bd6'
const COLUMN_OPACITY = 0.28
const MARGIN_COLOR = '#00c2ff'
const MARGIN_OPACITY = 0.28

const columnStyle: CSSProperties = {
  backgroundColor: COLUMN_COLOR,
  opacity: COLUMN_OPACITY,
}

const marginStyle: CSSProperties = {
  border: `var(--margin) solid ${MARGIN_COLOR}`,
  opacity: MARGIN_OPACITY,
}

export function GridOverlay({open}: {open: boolean}) {
  if (!open) return null

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-40" style={marginStyle} />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-40 flex gap-gutter px-margin"
      >
        {Array.from({length: COLUMNS}, (_, index) => (
          <div
            key={index}
            className={cn('min-w-0 flex-1', index >= MOBILE_COLUMNS && 'max-md:hidden')}
            style={columnStyle}
          />
        ))}
      </div>
    </>
  )
}
