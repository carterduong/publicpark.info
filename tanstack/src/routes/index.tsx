import {useState} from 'react'
import {createFileRoute, Link} from '@tanstack/react-router'

import {ProjectCarousel} from '../components/ProjectCarousel'
import {ProjectGrid} from '../components/ProjectGrid'
import {getProjects} from '../lib/sanity/projects'

export const Route = createFileRoute('/')({
  loader: () => getProjects(),
  component: Home,
})

function Home() {
  const projects = Route.useLoaderData()
  const [isGrid, setIsGrid] = useState(false)

  return (
    <main className="p-6">
      {isGrid ? <ProjectGrid projects={projects} /> : <ProjectCarousel projects={projects} />}
      <div className="fixed bottom-0 left-0 flex w-screen justify-between p-6 t-display">
        <div>{isGrid && <span>map</span>}</div>

        <div className="flex flex-row gap-[60px]">
          <button
            type="button"
            aria-pressed={!isGrid}
            onClick={() => setIsGrid(false)}
            className={!isGrid ? 'underline' : ''}
          >
            walk fast
          </button>
          <button
            type="button"
            aria-pressed={isGrid}
            onClick={() => setIsGrid(true)}
            className={isGrid ? 'underline' : ''}
          >
            walk slow
          </button>
        </div>

        <Link to="/info">info</Link>
      </div>
    </main>
  )
}
