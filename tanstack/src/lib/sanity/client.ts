import {createClient} from '@sanity/client'

export const client = createClient({
  projectId: '091dwa0z',
  dataset: 'production',
  apiVersion: '2026-03-01',
  // The CDN caches responses, so skip it in dev to see edits right away.
  useCdn: !import.meta.env.DEV,
})
