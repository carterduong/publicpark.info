import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/api/draft-mode/perspective')({
  server: {
    handlers: {
      GET: async ({request}) => {
        const {updatePerspective} = await import('../../../lib/draft-mode.server')
        return updatePerspective(request)
      },
    },
  },
})
