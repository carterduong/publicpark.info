import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'Public Park',

  projectId: '091dwa0z',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    singletons: ['homepage', 'info', 'settings'],
    actions: (prev, context) =>
      context.singleton ? prev.filter(({action}) => action !== 'delete') : prev,
  },
})
