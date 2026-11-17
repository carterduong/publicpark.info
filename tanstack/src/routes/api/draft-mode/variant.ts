import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/api/draft-mode/variant')({
  server: {
    handlers: {
      GET: async ({request}) => {
        const {updateVariant} = await import('../../../lib/draft-mode.server')
        return updateVariant(request)
      },
    },
  },
})
