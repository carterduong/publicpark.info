import {perspectiveCookieName, variantCookieName} from '@sanity/preview-url-secret/constants'

const previewMaxAge = 60 * 60

export {perspectiveCookieName, variantCookieName}

export function readCookie(cookieHeader: string, name: string): string | undefined {
  for (const part of cookieHeader.split(';')) {
    const separator = part.indexOf('=')
    if (separator === -1) continue
    const key = part.slice(0, separator).trim()
    if (key !== name) continue
    const value = part.slice(separator + 1).trim()
    if (!value) return undefined
    try {
      return decodeURIComponent(value)
    } catch {
      return value
    }
  }
  return undefined
}

export function isPreviewRequest(cookieHeader: string): boolean {
  return readCookie(cookieHeader, perspectiveCookieName) !== undefined
}

export function previewCookie(name: string, value: string): string {
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${previewMaxAge}`
}

export function clearPreviewCookie(name: string): string {
  return `${name}=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0`
}
