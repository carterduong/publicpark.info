import {PortableText} from '@portabletext/react'
import {createFileRoute, Link} from '@tanstack/react-router'

import {BottomNav} from '../components/BottomNav'
import {getInfo} from '../lib/sanity/info'
import {getCentralParkWeather} from '../lib/weather'

export const Route = createFileRoute('/info')({
  head: () => ({
    meta: [{title: 'Info'}],
  }),
  loader: async () => {
    const [info, weather] = await Promise.all([getInfo(), getCentralParkWeather()])
    return {info, weather}
  },
  component: InfoPage,
})

function InfoPage() {
  const {info, weather} = Route.useLoaderData()

  return (
    <main className="grid min-h-svh grid-cols-3 gap-2 px-[5px] md:grid-cols-12">
      <div className="col-span-3 flex flex-col gap-[1lh] text-center t-md lowercase md:col-span-10 md:col-start-2">
        {info?.body && <PortableText value={info.body} />}
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
            <button>sit down</button>
            <button>look up</button>
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
