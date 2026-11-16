import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/radio')({
  head: () => ({
    meta: [{title: 'Radio'}],
  }),
  component: RadioPage,
})

function RadioPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Radio</h1>
    </main>
  )
}
