import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/blog')({
  head: () => ({
    meta: [{title: 'Blog'}],
  }),
  component: BlogPage,
})

function BlogPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Blog</h1>
    </main>
  )
}
