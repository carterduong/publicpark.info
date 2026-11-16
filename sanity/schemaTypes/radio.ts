import {MicrophoneIcon} from '@sanity/icons/Microphone'
import {defineField, defineType} from 'sanity'

export const radio = defineType({
  name: 'radio',
  title: 'Radio',
  type: 'document',
  icon: MicrophoneIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
  ],
})
