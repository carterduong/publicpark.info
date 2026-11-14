import {defineField, defineType} from 'sanity'

export const radio = defineType({
  name: 'radio',
  title: 'Radio',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
  ],
})
