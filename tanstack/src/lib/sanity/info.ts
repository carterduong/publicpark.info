import {createServerFn} from '@tanstack/react-start'
import {defineQuery} from 'groq'

import {client} from './client'

const infoQuery = defineQuery(`*[_type == "info"][0]{body}`)

type Block = {
  _type: string
  _key: string
  style?: string
  listItem?: string
  level?: number
  children?: {_type: string; _key: string; text?: string; marks?: string[]}[]
  markDefs?: {_type: string; _key: string; href?: string}[]
}

export type Info = {
  body: Block[] | null
}

export const getInfo = createServerFn({method: 'GET'}).handler(() =>
  client.fetch<Info | null>(infoQuery),
)
