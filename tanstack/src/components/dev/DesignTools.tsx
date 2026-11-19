import {useEffect, useRef, useState, useSyncExternalStore, type PointerEvent} from 'react'
import {cn} from 'cnfast'

import {GridOverlay} from './GridOverlay'
import {ViewportSize} from './ViewportSize'

const POSITION_KEY = 'design-tools-position'
const DISMISSED_KEY = 'design-tools-dismissed'
const SHOW_KEY = 't'

type Position = {x: number; y: number}

const toggleClass = (on: boolean) =>
  cn('rounded-sm px-1 py-0.5', on ? 'bg-white text-black' : 'text-white')

const clampToViewport = ({x, y}: Position, bar: HTMLElement): Position => ({
  x: Math.min(Math.max(0, x), window.innerWidth - bar.offsetWidth),
  y: Math.min(Math.max(0, y), window.innerHeight - bar.offsetHeight),
})

/** Until the bar is first dragged, CSS centers it along the bottom. */
const useDraggable = (visible: boolean) => {
  const bar = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<Position | null>(null)

  // Read once the bar renders, because the server render can't see localStorage.
  useEffect(() => {
    if (!visible) return
    const saved = localStorage.getItem(POSITION_KEY)
    if (saved && bar.current) {
      setPosition(clampToViewport(JSON.parse(saved) as Position, bar.current))
    }
  }, [visible])

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    const element = bar.current
    if (!element) return

    const rect = element.getBoundingClientRect()
    const offset = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
    const handle = event.currentTarget
    handle.setPointerCapture(event.pointerId)

    let last: Position | null = null

    const onMove = (move: globalThis.PointerEvent) => {
      last = clampToViewport({x: move.clientX - offset.x, y: move.clientY - offset.y}, element)
      setPosition(last)
    }

    const onUp = () => {
      handle.removeEventListener('pointermove', onMove)
      handle.removeEventListener('pointerup', onUp)
      handle.removeEventListener('pointercancel', onUp)
      if (last) localStorage.setItem(POSITION_KEY, JSON.stringify(last))
    }

    handle.addEventListener('pointermove', onMove)
    handle.addEventListener('pointerup', onUp)
    handle.addEventListener('pointercancel', onUp)
  }

  const reset = () => {
    localStorage.removeItem(POSITION_KEY)
    setPosition(null)
  }

  return {bar, position, onPointerDown, reset}
}

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || target.closest('input, textarea, select') !== null)

const dismissedListeners = new Set<() => void>()

const subscribeDismissed = (listener: () => void) => {
  dismissedListeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    dismissedListeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

const setDismissed = (dismissed: boolean) => {
  if (dismissed) localStorage.setItem(DISMISSED_KEY, 'true')
  else localStorage.removeItem(DISMISSED_KEY)
  dismissedListeners.forEach((listener) => listener())
}

/** Hidden on the server, so the bar never flashes before the saved state loads. */
const useDismissed = () => {
  const dismissed = useSyncExternalStore(
    subscribeDismissed,
    () => localStorage.getItem(DISMISSED_KEY) === 'true',
    () => true,
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() !== SHOW_KEY ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isTyping(event.target)
      ) {
        return
      }
      setDismissed(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return {dismissed, dismiss: () => setDismissed(true)}
}

export function DesignTools() {
  const [gridOpen, setGridOpen] = useState(false)
  const {dismissed, dismiss} = useDismissed()
  const {bar, position, onPointerDown: startDrag, reset: resetPosition} = useDraggable(!dismissed)

  if (dismissed) return null

  return (
    <>
      <GridOverlay open={gridOpen} />
      <div
        ref={bar}
        className={cn(
          'pointer-events-auto fixed z-70 flex cursor-grab touch-none items-center gap-2.5 rounded-md bg-black px-2.5 py-1.5 font-mono text-[12px] leading-none text-white ring-1 ring-white select-none active:cursor-grabbing [&>:not([data-drag-handle])]:cursor-auto',
          !position && 'bottom-6 left-1/2 -translate-x-1/2',
        )}
        style={position ? {left: position.x, top: position.y} : undefined}
        // Only the bar's own padding and gaps drag; its controls keep their clicks.
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) startDrag(event)
        }}
        onDoubleClick={(event) => {
          if (event.target === event.currentTarget) resetPosition()
        }}
      >
        <button
          type="button"
          aria-label="Hide design tools. Press T to show them again."
          title="Hide. Press T to show again."
          onClick={() => {
            resetPosition()
            dismiss()
          }}
          className="cursor-pointer rounded-sm px-1 py-0.5 text-white/60 hover:text-white"
        >
          ×
        </button>
        <button
          type="button"
          aria-pressed={gridOpen}
          onClick={() => setGridOpen((open) => !open)}
          className={toggleClass(gridOpen)}
        >
          Grid
        </button>
        <span aria-hidden className="h-3 w-px bg-white/40" />
        <ViewportSize />
        <span aria-hidden className="h-3 w-px bg-white/40" />
        <a href="/studio" target="_blank">
          Studio
        </a>
        <span aria-hidden className="h-3 w-px bg-white/40" />

        <span
          aria-hidden
          data-drag-handle
          title="Drag to move. Double-click to reset."
          onPointerDown={startDrag}
          onDoubleClick={resetPosition}
          className="-my-1.5 -mr-2.5 flex cursor-grab touch-none items-center self-stretch px-1.5 text-white/60 select-none hover:text-white active:cursor-grabbing"
        >
          ⠿
        </span>
      </div>
    </>
  )
}
