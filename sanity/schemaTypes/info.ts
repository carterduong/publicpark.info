import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {InfoOutlineIcon} from '@sanity/icons/InfoOutline'
import {LinkIcon} from '@sanity/icons/Link'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const info = defineType({
  name: 'info',
  title: 'Info',
  type: 'document',
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
          marks: {
            decorators: [{title: 'Italic', value: 'em'}],
            annotations: [
              defineField({
                name: 'link',
                title: 'Link',
                type: 'object',
                icon: LinkIcon,
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
                  }),
                ],
              }),
              defineField({
                name: 'email',
                title: 'Email',
                type: 'object',
                icon: EnvelopeIcon,
                fields: [
                  defineField({
                    name: 'email',
                    title: 'Email',
                    type: 'email',
                    validation: (rule) => rule.required(),
                  }),
                ],
              }),
            ],
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Info'}),
  },
})
