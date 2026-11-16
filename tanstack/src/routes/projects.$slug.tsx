import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$slug')({
  head: ({params}) => ({
    meta: [{title: params.slug}],
  }),
  component: ProjectPage,
})

function ProjectPage() {
  const {slug} = Route.useParams()

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">{slug}</h1>
    </main>
  )
}
