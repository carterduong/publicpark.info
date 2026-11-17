import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/api/draft-mode/disable')({
  server: {
    handlers: {
      GET: async () => {
        const {disableDraftMode} = await import('../../../lib/draft-mode.server')
        return disableDraftMode()
      },
    },
  },
})
