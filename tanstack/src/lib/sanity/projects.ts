import {createServerFn} from '@tanstack/react-start'
import {defineQuery} from 'groq'

import {client} from './client'

const projectsQuery = defineQuery(`*[_type == "project" && defined(slug.current)] | order(year desc, title asc) {
  _id,
  title,
  subtitle,
  "slug": slug.current,
  "cover": coverMedia[0]{
    _type,
    "url": asset->url,
    "dimensions": asset->metadata.dimensions{width, height},
    "playbackId": asset->playbackId
  }
}`)

export type ProjectCover =
  | {
      _type: 'image'
      url: string | null
      dimensions: {width: number; height: number} | null
      playbackId: null
    }
  | {_type: 'mux.video'; url: null; dimensions: null; playbackId: string | null}

export type ProjectListItem = {
  _id: string
  title: string | null
  subtitle: string | null
  slug: string
  cover: ProjectCover | null
}

export const getProjects = createServerFn({method: 'GET'}).handler(() =>
  client.fetch<ProjectListItem[]>(projectsQuery),
)
