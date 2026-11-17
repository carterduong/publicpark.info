import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/api/draft-mode/enable')({
  server: {
    handlers: {
      GET: async ({request}) => {
        const {enableDraftMode} = await import('../../../lib/draft-mode.server')
        return enableDraftMode(request)
      },
    },
  },
})
