import {useEffect, useState} from 'react'
import {Link} from '@tanstack/react-router'

import type {ProjectListItem} from '../lib/sanity/projects'

type ProjectCarouselProps = {
  projects: ProjectListItem[]
  /** Milliseconds each project stays up. */
  interval?: number
}

export function ProjectCarousel({projects, interval = 3000}: ProjectCarouselProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || projects.length < 2) return
    const id = setInterval(() => setIndex((current) => (current + 1) % projects.length), interval)
    return () => clearInterval(id)
  }, [paused, interval, projects.length])

  const project = projects[index % projects.length]
  if (!project) return null

  return (
    <Link
      to="/projects/$slug"
      params={{slug: project.slug}}
      className="fixed bottom-6 left-6"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <h2 className="block t-body-serif uppercase">{project.title}</h2>
      {project.subtitle && <h3 className="block t-body-sans lowercase">{project.subtitle}</h3>}
    </Link>
  )
}
