import {useTailwindViewport} from '../../lib/tailwind-breakpoints'

export function ViewportSize() {
  const {width, breakpoint, ranges} = useTailwindViewport()

  return (
    <span className="inline-flex items-center gap-2" title={ranges || undefined}>
      <span className="tabular-nums">{width === null ? '–' : `${width}px`}</span>
      <span>{breakpoint ?? '–'}</span>
    </span>
  )
}
