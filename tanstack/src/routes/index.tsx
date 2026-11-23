import {useState} from 'react'
import {createFileRoute, Link} from '@tanstack/react-router'
import {cn} from 'cnfast'

import {BottomNav} from '../components/BottomNav'
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
    <main className="px-margin py-6">
      {isGrid ? <ProjectGrid projects={projects} /> : <ProjectCarousel projects={projects} />}
      <BottomNav
        className={cn('t-display', !isGrid && 'text-white mix-blend-exclusion')}
        start={isGrid && <span>map</span>}
        center={
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
        }
        end={<Link to="/info">info</Link>}
      />
    </main>
  )
}
