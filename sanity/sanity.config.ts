import {defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationResolve} from './presentation'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'Public Park',

  projectId: '091dwa0z',
  dataset: 'production',

  plugins: [
    structureTool({structure}),
    presentationTool({
      resolve: presentationResolve,
      // Studio is served at /studio on the site, so the preview origin is the
      // site origin. Open Studio through the site, not the standalone dev port.
      previewUrl: {
        ...(process.env.SANITY_STUDIO_PREVIEW_URL
          ? {initial: process.env.SANITY_STUDIO_PREVIEW_URL}
          : {}),
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
      allowOrigins: ['http://localhost:*'],
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    singletons: ['homepage', 'info', 'settings'],
    actions: (prev, context) =>
      context.singleton ? prev.filter(({action}) => action !== 'delete') : prev,
  },
})
