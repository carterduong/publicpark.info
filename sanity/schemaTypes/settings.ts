import {defineField, defineType} from 'sanity'

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site title',
      type: 'string',
      description: 'Used as the default page title and in the title of shared links.',
      validation: (rule) => rule.required().warning('Pages need a title for search results.'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      description:
        'The default description shown in search results. Aim for 160 characters or fewer.',
      validation: (rule) =>
        rule.max(160).warning('Search engines usually cut descriptions off after 160 characters.'),
    }),
    defineField({
      name: 'shareImage',
      title: 'Share image',
      type: 'image',
      description:
        'The default image shown when a link to the site is shared. 1200 × 630 works best.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Describes the image for people who cannot see it.',
        }),
      ],
    }),
  ],
})
