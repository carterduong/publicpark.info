import type {ReactNode} from 'react'
import {cn} from 'cnfast'

type BottomNavProps = {
  start?: ReactNode
  center?: ReactNode
  end?: ReactNode
  className?: string
}

/** Equal outer columns keep `center` on the screen's midline whatever the corners hold. */
export function BottomNav({start, center, end, className}: BottomNavProps) {
  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 grid grid-cols-[1fr_auto_1fr] items-end gap-6 p-6',
        className,
      )}
    >
      <div className="flex justify-self-start">{start}</div>
      <div className="flex justify-self-center">{center}</div>
      <div className="flex justify-self-end">{end}</div>
    </div>
  )
}
