import {validatePreviewUrl} from '@sanity/preview-url-secret'

import {
  parsePerspective,
  previewRedirect,
  sanitizeVariant,
  serializePerspective,
} from './draft-mode'
import {
  clearPreviewCookie,
  isPreviewRequest,
  perspectiveCookieName,
  previewCookie,
  readCookie,
  variantCookieName,
} from './preview-cookie'
import {createSanityClient, readSanityToken} from './sanity.server'

function unchanged(): Response {
  return new Response(null, {status: 204, headers: {'Cache-Control': 'no-store'}})
}

function previewRequired(): Response {
  return new Response('Preview mode is not enabled', {
    status: 401,
    headers: {'Cache-Control': 'no-store'},
  })
}

export async function enableDraftMode(request: Request): Promise<Response> {
  if (!readSanityToken()) {
    return new Response('Preview is unavailable until SANITY_API_READ_TOKEN is set.', {
      status: 500,
      headers: {'Cache-Control': 'no-store'},
    })
  }

  const {isValid, redirectTo, studioPreviewPerspective, studioPreviewVariant} =
    await validatePreviewUrl(createSanityClient('drafts'), request.url)

  if (!isValid) {
    return new Response('Invalid secret', {status: 401, headers: {'Cache-Control': 'no-store'}})
  }

  const perspective = parsePerspective(studioPreviewPerspective || 'drafts') ?? 'drafts'
  const headers = new Headers()
  headers.append(
    'Set-Cookie',
    previewCookie(perspectiveCookieName, serializePerspective(perspective)),
  )
  headers.set('Cache-Control', 'no-store')
  headers.set('Location', previewRedirect(request.url, redirectTo))

  const variant = studioPreviewVariant ? sanitizeVariant(studioPreviewVariant) : undefined
  if (variant) headers.append('Set-Cookie', previewCookie(variantCookieName, variant))

  return new Response(null, {status: 307, headers})
}

export function disableDraftMode(): Response {
  const headers = new Headers()
  headers.append('Set-Cookie', clearPreviewCookie(perspectiveCookieName))
  headers.append('Set-Cookie', clearPreviewCookie(variantCookieName))
  headers.set('Cache-Control', 'no-store')
  headers.set('Location', '/')
  return new Response(null, {status: 307, headers})
}

export function updatePerspective(request: Request): Response {
  const cookieHeader = request.headers.get('cookie') ?? ''
  if (!isPreviewRequest(cookieHeader)) return previewRequired()

  const raw = new URL(request.url).searchParams.get('perspective')
  if (!raw) return new Response(null, {status: 400})
  const perspective = parsePerspective(raw)
  if (!perspective) return new Response(null, {status: 400})

  const next = serializePerspective(perspective)
  if (readCookie(cookieHeader, perspectiveCookieName) === next) return unchanged()

  return new Response(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
      'Set-Cookie': previewCookie(perspectiveCookieName, next),
    },
  })
}

export function updateVariant(request: Request): Response {
  const cookieHeader = request.headers.get('cookie') ?? ''
  if (!isPreviewRequest(cookieHeader)) return previewRequired()

  const raw = new URL(request.url).searchParams.get('variant')
  const next = raw ? sanitizeVariant(raw) : undefined
  if (raw && !next) return new Response(null, {status: 400})

  const current = readCookie(cookieHeader, variantCookieName)
  if ((current ?? '') === (next ?? '')) return unchanged()

  return new Response(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
      'Set-Cookie': next
        ? previewCookie(variantCookieName, next)
        : clearPreviewCookie(variantCookieName),
    },
  })
}
