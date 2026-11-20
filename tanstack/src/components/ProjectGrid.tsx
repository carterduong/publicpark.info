import {Link} from '@tanstack/react-router'

import type {ProjectCover, ProjectListItem} from '../lib/sanity/projects'

const coverSrc = (cover: ProjectCover) => {
  if (cover._type === 'image') return cover.url ? `${cover.url}?w=1600&auto=format` : null
  return cover.playbackId
    ? `https://image.mux.com/${cover.playbackId}/thumbnail.webp?width=1600`
    : null
}

function Cover({cover}: {cover: ProjectCover}) {
  const src = coverSrc(cover)
  if (!src) return null

  return (
    <img
      src={src}
      alt=""
      width={cover.dimensions?.width}
      height={cover.dimensions?.height}
      loading="lazy"
      className="block h-auto w-full"
    />
  )
}

export function ProjectGrid({projects}: {projects: ProjectListItem[]}) {
  return (
    <ul className="grid grid-cols-3 gap-gutter md:grid-cols-12">
      {projects.map((project) => (
        <li key={project._id} className="col-span-3">
          <Link to="/projects/$slug" params={{slug: project.slug}} className="flex flex-col gap-2">
            {project.cover && <Cover cover={project.cover} />}
            <div className="text-center">
              <h2 className="block t-body-serif uppercase">{project.title}</h2>
              {project.subtitle && (
                <h3 className="block t-body-sans lowercase">{project.subtitle}</h3>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
