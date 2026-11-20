import {cn} from 'cnfast'

import type {ProjectCover as Cover} from '../lib/sanity/projects'

const coverSrc = (cover: Cover) => {
  if (cover._type === 'image') return cover.url ? `${cover.url}?w=1600&auto=format` : null
  return cover.playbackId
    ? `https://image.mux.com/${cover.playbackId}/thumbnail.webp?width=1600`
    : null
}

export function ProjectCover({
  cover,
  loading = 'lazy',
  className,
}: {
  cover: Cover
  loading?: 'lazy' | 'eager'
  className?: string
}) {
  const src = coverSrc(cover)
  if (!src) return null

  return (
    <img
      src={src}
      alt=""
      width={cover.dimensions?.width}
      height={cover.dimensions?.height}
      loading={loading}
      className={cn('block h-auto w-full', className)}
    />
  )
}
