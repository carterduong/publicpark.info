import {Link} from '@tanstack/react-router'

import type {ProjectListItem} from '../lib/sanity/projects'
import {ProjectCover} from './ProjectCover'

export function ProjectGrid({projects}: {projects: ProjectListItem[]}) {
  return (
    <ul className="grid grid-cols-3 gap-gutter md:grid-cols-12">
      {projects.map((project) => (
        <li key={project._id} className="col-span-3">
          <Link to="/projects/$slug" params={{slug: project.slug}} className="flex flex-col gap-2">
            {project.cover && <ProjectCover cover={project.cover} />}
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
