import {ProjectsIcon} from '@sanity/icons/Projects'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: ProjectsIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (rule) => rule.integer(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'category'}],
        }),
      ],
    }),
    defineField({
      name: 'coverMedia',
      title: 'Cover Media',
      description: 'An image or a video.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
        }),
        defineArrayMember({
          type: 'mux.video',
        }),
      ],
      validation: (rule) => rule.max(1),
    }),
    defineField({
      name: 'media',
      title: 'Media',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
        }),
        defineArrayMember({
          type: 'mux.video',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      year: 'year',
      category0: 'categories.0.title',
      category1: 'categories.1.title',
      category2: 'categories.2.title',
      cover: 'coverMedia.0',
      coverType: 'coverMedia.0._type',
      playbackId: 'coverMedia.0.asset.playbackId',
    },
    prepare: ({title, subtitle, year, category0, category1, category2, cover, coverType, playbackId}) => {
      const categories = [category0, category1, category2].filter(Boolean).join(', ')
      return {
        title: title || 'Untitled',
        subtitle: [year, subtitle].filter(Boolean).join(' · '),
        description: categories,
        media:
          coverType === 'mux.video' && playbackId ? (
            <img
              src={`https://image.mux.com/${playbackId}/thumbnail.webp?width=200&height=200&fit_mode=smartcrop`}
              alt=""
              style={{objectFit: 'cover', width: '100%', height: '100%'}}
            />
          ) : coverType === 'image' ? (
            cover
          ) : undefined,
      }
    },
  },
})
