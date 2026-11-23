import {useState} from 'react'
import {Link} from '@tanstack/react-router'
import MuxVideo from '@mux/mux-video-react'

import type {ProjectListItem} from '../lib/sanity/projects'
import {ProjectCover} from './ProjectCover'

const fullScreen = 'fixed inset-0 -z-10 size-full object-cover'

type ProjectCarouselProps = {
  projects: ProjectListItem[]
}

export function ProjectCarousel({projects}: ProjectCarouselProps) {
  const [index, setIndex] = useState(0)

  const project = projects[index % projects.length]
  if (!project) return null

  return (
    <div data-carousel>
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
      <button
        type="button"
        aria-label="Next project"
        onClick={() => setIndex((current) => (current + 1) % projects.length)}
        className="fixed inset-0 z-0 size-full cursor-pointer"
      />
      <Link
        to="/projects/$slug"
        params={{slug: project.slug}}
        className="fixed bottom-6 left-6 z-10 block text-white mix-blend-exclusion"
      >
        <h2 className="block t-body-serif uppercase">{project.title}</h2>
        {project.subtitle && <h3 className="block t-body-sans lowercase">{project.subtitle}</h3>}
      </Link>
    </div>
  )
}
