import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Public Park',

  projectId: '091dwa0z',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    singletons: ['homepage', 'info'],
    actions: (prev, context) =>
      context.singleton ? prev.filter(({action}) => action !== 'delete') : prev,
  },
})
