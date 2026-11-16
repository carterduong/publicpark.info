import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/info')({
  head: () => ({
    meta: [{title: 'Info'}],
  }),
  component: InfoPage,
})

function InfoPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Info</h1>
    </main>
  )
}
