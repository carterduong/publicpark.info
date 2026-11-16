import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/projects')({
  head: () => ({
    meta: [{title: 'Projects'}],
  }),
  component: ProjectsPage,
})

function ProjectsPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Projects</h1>
    </main>
  )
}
