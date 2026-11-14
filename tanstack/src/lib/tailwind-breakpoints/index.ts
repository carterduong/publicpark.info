import {useSyncExternalStore} from 'react'
import {tailwindBreakpoints as themeBreakpoints} from 'virtual:tailwind-breakpoints'

export type TailwindBreakpoint = {
  name: string
  /** Raw theme value, for example `40rem` or `640px`. */
  minWidth: string
  /** Pixel length used only to order ranges. Match queries use `minWidth`. */
  minWidthPx: number | null
}

// `rem` and `em` inside media queries resolve against the initial font
// size, which CSS defines as 16px. They do not follow a custom root
// font-size. This constant only orders ranges. The active name is decided
// by `matchMedia` on the raw theme value.
const INITIAL_FONT_PX = 16

const breakpoints = themeBreakpoints
  .map((breakpoint) => ({
    ...breakpoint,
    minWidthPx: parseMediaLength(breakpoint.minWidth),
  }))
  .sort((a, b) => {
    const aPx = a.minWidthPx ?? Number.POSITIVE_INFINITY
    const bPx = b.minWidthPx ?? Number.POSITIVE_INFINITY
    return aPx - bPx || a.name.localeCompare(b.name)
  })

function parseMediaLength(value: string): number | null {
  const match = /^([+-]?(?:\d+\.?\d*|\.\d+))(px|rem|em)$/.exec(value.trim())
  if (!match?.[1] || !match[2]) return null

  const amount = Number(match[1])
  if (!Number.isFinite(amount)) return null
  if (match[2] === 'px') return amount
  return amount * INITIAL_FONT_PX
}

export function activeBreakpointName(ranges: readonly TailwindBreakpoint[] = breakpoints): string {
  if (ranges.length === 0) return '—'

  let active: string | null = null
  for (const breakpoint of ranges) {
    if (window.matchMedia(`(min-width: ${breakpoint.minWidth})`).matches) {
      active = breakpoint.name
    }
  }

  if (active) return active
  return `<${ranges[0].name}`
}

export function formatBreakpointRanges(
  ranges: readonly TailwindBreakpoint[] = breakpoints,
): string {
  return ranges
    .map((breakpoint) => {
      if (breakpoint.minWidthPx === null) {
        return `${breakpoint.name} ${breakpoint.minWidth}`
      }
      return `${breakpoint.name} ${breakpoint.minWidth} (${Math.round(breakpoint.minWidthPx)}px)`
    })
    .join(' · ')
}

type ViewportSnapshot = {
  width: number | null
  breakpoint: string | null
  ranges: string
}

const SERVER_SNAPSHOT: ViewportSnapshot = {
  width: null,
  breakpoint: null,
  ranges: '',
}

let snapshot: ViewportSnapshot = SERVER_SNAPSHOT

function getSnapshot(): ViewportSnapshot {
  const width = Math.round(window.innerWidth)
  const breakpoint = activeBreakpointName()
  const ranges = formatBreakpointRanges()

  if (
    snapshot.width === width &&
    snapshot.breakpoint === breakpoint &&
    snapshot.ranges === ranges
  ) {
    return snapshot
  }

  snapshot = {width, breakpoint, ranges}
  return snapshot
}

function subscribe(onChange: () => void) {
  const queries = breakpoints.map((breakpoint) =>
    window.matchMedia(`(min-width: ${breakpoint.minWidth})`),
  )

  window.addEventListener('resize', onChange)
  for (const query of queries) query.addEventListener('change', onChange)

  return () => {
    window.removeEventListener('resize', onChange)
    for (const query of queries) query.removeEventListener('change', onChange)
  }
}

function getServerSnapshot(): ViewportSnapshot {
  return SERVER_SNAPSHOT
}

export function useTailwindViewport(): ViewportSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
