import {enableVisualEditing, type HistoryUpdate} from '@sanity/visual-editing/enable-visual-editing'
import {useRouter, useRouterState} from '@tanstack/react-router'
import {useEffect, useState} from 'react'

export function VisualEditing() {
  const router = useRouter()
  const href = useRouterState({select: (state) => state.location.href})
  const [reportLocation, setReportLocation] = useState<
    ((update: HistoryUpdate) => void) | undefined
  >()

  useEffect(() => {
    const disable = enableVisualEditing({
      zIndex: 1000,
      history: {
        subscribe: (navigate) => {
          setReportLocation(() => navigate)
          return () => setReportLocation(undefined)
        },
        update: (update) => {
          if (update.type === 'pop') {
            router.history.back()
            return
          }
          const url = new URL(update.url, window.location.origin)
          if (url.origin !== window.location.origin) return
          void router.navigate({
            href: `${url.pathname}${url.search}${url.hash}`,
            replace: update.type === 'replace',
          })
        },
      },
      refresh: (payload) => {
        if (payload.source === 'mutation' && payload.livePreviewEnabled) return false
        return router.invalidate()
      },
      onPerspectiveChange: async (perspective) => {
        const value = Array.isArray(perspective) ? perspective.join(',') : perspective
        const response = await fetch(
          `/api/draft-mode/perspective?perspective=${encodeURIComponent(value)}`,
          {cache: 'no-store'},
        )
        if (response.status === 200) await router.invalidate()
      },
      onVariantChange: async (variant) => {
        const params = new URLSearchParams()
        if (variant) params.set('variant', variant)
        const response = await fetch(`/api/draft-mode/variant?${params}`, {cache: 'no-store'})
        if (response.status === 200) await router.invalidate()
      },
    })

    return disable
  }, [router])

  useEffect(() => {
    reportLocation?.({type: 'push', url: href})
  }, [href, reportLocation])

  return null
}
