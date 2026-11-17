import {validateApiPerspective, type ClientPerspective} from '@sanity/client'
import {withoutSecretSearchParams} from '@sanity/preview-url-secret/without-secret-search-params'

export function serializePerspective(perspective: ClientPerspective): string {
  return Array.isArray(perspective) ? perspective.join(',') : perspective
}

function isPerspectiveName(value: string): boolean {
  return (
    value === 'drafts' ||
    value === 'published' ||
    /^[A-Za-z0-9][A-Za-z0-9._~:-]{0,199}$/.test(value)
  )
}

export function parsePerspective(value: string): ClientPerspective | undefined {
  const perspective = value.includes(',') ? value.split(',') : value
  const names = Array.isArray(perspective) ? perspective : [perspective]
  if (names.length === 0 || names.some((name) => !isPerspectiveName(name))) return undefined
  try {
    validateApiPerspective(perspective)
  } catch {
    return undefined
  }
  if (perspective === 'raw') return 'drafts'
  return perspective
}

export function sanitizeVariant(value: string): string | undefined {
  if (!/^[A-Za-z0-9._~:-]{1,200}$/.test(value)) return undefined
  return value
}

export function previewRedirect(requestUrl: string, redirectTo: string | undefined): string {
  if (!redirectTo) return '/'
  let cleaned: URL
  try {
    cleaned = withoutSecretSearchParams(new URL(redirectTo, requestUrl))
  } catch {
    return '/'
  }
  const {pathname} = cleaned
  if (!pathname.startsWith('/') || pathname.startsWith('//') || pathname.includes('\\')) return '/'
  return `${pathname}${cleaned.search}${cleaned.hash}`
}
