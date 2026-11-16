import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Site')
    .items([
      S.listItem().singleton('homepage').title('Home'),
      S.documentTypeListItem('project').title('Projects'),
      S.listItem().singleton('info').title('Info'),
      S.divider(),
      S.documentTypeListItem('blogPost').title('Blog'),
      S.documentTypeListItem('radio').title('Radio'),
      S.documentTypeListItem('category').title('Categories'),
      S.divider(),
      S.listItem().singleton('settings').title('Settings'),
    ])
