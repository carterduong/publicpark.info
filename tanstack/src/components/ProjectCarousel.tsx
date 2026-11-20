import {useEffect, useState} from 'react'
import {Link} from '@tanstack/react-router'
import MuxVideo from '@mux/mux-video-react'

import type {ProjectListItem} from '../lib/sanity/projects'
import {ProjectCover} from './ProjectCover'

const fullScreen = 'fixed inset-0 -z-10 size-full object-cover'

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
      className="block"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {project.cover?._type === 'mux.video' && project.cover.playbackId ? (
        <MuxVideo
          key={project._id}
          playbackId={project.cover.playbackId}
          autoPlay="muted"
          muted
          loop
          playsInline
          className={fullScreen}
        />
      ) : (
        project.cover && (
          <ProjectCover
            key={project._id}
            cover={project.cover}
            loading="eager"
            className={fullScreen}
          />
        )
      )}
      <div className="fixed bottom-6 left-6">
        <h2 className="block t-body-serif uppercase">{project.title}</h2>
        {project.subtitle && <h3 className="block t-body-sans lowercase">{project.subtitle}</h3>}
      </div>
    </Link>
  )
}
