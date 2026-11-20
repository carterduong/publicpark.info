import {PortableText, type PortableTextComponents} from '@portabletext/react'
import {createFileRoute, Link} from '@tanstack/react-router'
import {useState} from 'react'
import {flushSync} from 'react-dom'
import {cn} from 'cnfast'

import {BottomNav} from '../components/BottomNav'
import {getInfo} from '../lib/sanity/info'
import {getCentralParkWeather, getNewYorkSky} from '../lib/weather'

export const Route = createFileRoute('/info')({
  head: () => ({
    meta: [{title: 'Info'}],
  }),
  loader: async () => {
    const [info, weather] = await Promise.all([getInfo(), getCentralParkWeather()])
    return {info, weather, sky: getNewYorkSky()}
  },
  component: InfoPage,
})

const components: PortableTextComponents = {
  marks: {
    email: ({value, children}) => <a href={`mailto:${value?.email}`}>{children}</a>,
  },
}

function InfoPage() {
  const {info, weather, sky} = Route.useLoaderData()
  const [isSitting, setIsSitting] = useState(true)
  console.log(weather)

  const changeMode = (sitting: boolean) => {
    if (sitting === isSitting) return
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsSitting(sitting)
      return
    }
    // The transition snapshots the page after this callback, so the new colors must render synchronously.
    document.startViewTransition(() => flushSync(() => setIsSitting(sitting)))
  }

  return (
    <main
      data-info-mode={isSitting ? 'sitting' : 'looking'}
      data-sky={sky}
      className="grid min-h-svh grid-cols-3 gap-2 px-[5px] md:grid-cols-12"
    >
      <div className="col-span-3 flex flex-col gap-[1lh] text-center t-md lowercase md:col-span-10 md:col-start-2">
        {info?.body && <PortableText value={info.body} components={components} />}
      </div>
      <BottomNav
        start={
          weather && (
            <p>
              <span className="block t-body-serif uppercase">Central Park, New York, NY</span>
              <span className="block t-body-sans">
                it is {weather.fahrenheit}° f{weather.description && ` and ${weather.description}`}
              </span>
            </p>
          )
        }
        center={
          <div className="flex flex-row gap-[60px] t-display">
            <button
              type="button"
              onClick={() => changeMode(true)}
              className={cn('cursor-pointer', isSitting ? 'underline' : '')}
            >
              sit down
            </button>
            <button
              type="button"
              onClick={() => changeMode(false)}
              className={cn('cursor-pointer', !isSitting ? 'underline' : '')}
            >
              look up
            </button>
          </div>
        }
        end={
          <Link to="/" className="t-display">
            back
          </Link>
        }
      />
    </main>
  )
}
