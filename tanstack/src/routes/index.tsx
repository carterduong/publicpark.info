import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Public Park</h1>
      {/* Studio is a separate app served at /studio, so use a full page load. */}
      <a href="/studio" className="underline">
        Open the Studio
      </a>
    </main>
  )
}
