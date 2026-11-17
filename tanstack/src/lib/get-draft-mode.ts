import {createServerFn} from '@tanstack/react-start'

import {isPreviewRequest} from './preview-cookie'

export const getDraftMode = createServerFn({method: 'GET'}).handler(async () => {
  const {getRequestHeader} = await import('@tanstack/react-start/server')
  return isPreviewRequest(getRequestHeader('cookie') ?? '')
})
