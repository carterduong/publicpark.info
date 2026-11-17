import {createClient, type ClientPerspective} from '@sanity/client'

import {apiVersion, dataset, projectId, studioUrl} from './sanity'

export function readSanityToken(): string | undefined {
  const token = process.env.SANITY_API_READ_TOKEN
  return token ? token : undefined
}

export function createSanityClient(perspective: ClientPerspective = 'published') {
  const preview = perspective !== 'published'
  const token = preview ? readSanityToken() : undefined

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: !preview,
    perspective,
    stega: {
      enabled: preview,
      studioUrl,
    },
    ...(token ? {token} : {}),
  })
}
