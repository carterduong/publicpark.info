import {createServerFn} from '@tanstack/react-start'

/** The National Weather Service station in Central Park. */
const OBSERVATION_URL = 'https://api.weather.gov/stations/KNYC/observations/latest'

type Observation = {
  properties: {
    textDescription: string | null
    temperature: {unitCode: string; value: number | null}
  }
}

export type Weather = {
  fahrenheit: number
  description: string | null
}

export const getCentralParkWeather = createServerFn({method: 'GET'}).handler(
  async (): Promise<Weather | null> => {
    try {
      const response = await fetch(OBSERVATION_URL, {
        // NWS rejects requests without a User-Agent that identifies the site.
        headers: {'User-Agent': 'publicpark.info (s@publicpark.info)', Accept: 'application/geo+json'},
        signal: AbortSignal.timeout(3000),
      })
      if (!response.ok) return null

      const {properties} = (await response.json()) as Observation
      const celsius = properties.temperature.value
      if (celsius === null) return null

      return {
        fahrenheit: Math.round((celsius * 9) / 5 + 32),
        description: properties.textDescription?.toLowerCase() || null,
      }
    } catch {
      return null
    }
  },
)
