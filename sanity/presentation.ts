import {defineDocuments, defineLocations} from 'sanity/presentation'

const mainDocuments = defineDocuments([
  {
    route: '/projects/:slug',
    filter: `_type == "project" && slug.current == $slug`,
  },
  {route: '/', type: 'homepage'},
  {route: '/info', type: 'info'},
])

const locations = {
  homepage: defineLocations({
    select: {_id: '_id'},
    resolve: () => ({
      locations: [{title: 'Home', href: '/'}],
    }),
  }),
  project: defineLocations({
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    resolve: (doc) => ({
      locations: [
        ...(doc?.slug ? [{title: doc.title || 'Untitled', href: `/projects/${doc.slug}`}] : []),
        {title: 'Projects', href: '/projects'},
      ],
    }),
  }),
  info: defineLocations({
    select: {_id: '_id'},
    resolve: () => ({
      locations: [{title: 'Info', href: '/info'}],
    }),
  }),
  blogPost: defineLocations({
    select: {title: 'title'},
    resolve: (doc) => ({
      locations: [{title: doc?.title || 'Blog', href: '/blog'}],
    }),
  }),
  radio: defineLocations({
    select: {title: 'title'},
    resolve: (doc) => ({
      locations: [{title: doc?.title || 'Radio', href: '/radio'}],
    }),
  }),
  category: defineLocations({
    message: 'Categories show up on the projects that reference them.',
    tone: 'caution',
  }),
  settings: defineLocations({
    message: 'Settings supply the site title and the default sharing details.',
    tone: 'caution',
  }),
}

export const presentationResolve = {mainDocuments, locations}
