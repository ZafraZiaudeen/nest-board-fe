import { API_URL } from "./config"

const TOKEN_KEY = "nestboard_access_token"

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAccessToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY)
}

type ApiOptions = RequestInit & {
  auth?: boolean
}

// TODO: implement with refresh token once the backend /auth/refresh endpoint is ready
async function attemptTokenRefresh(): Promise<boolean> {
  return false
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}) {
  const headers = new Headers(options.headers)
  headers.set("Content-Type", "application/json")

  if (options.auth) {
    const token = getAccessToken()
    if (token) headers.set("Authorization", `Bearer ${token}`)
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })

  if (res.status === 401 && options.auth) {
    const refreshed = await attemptTokenRefresh()
    if (refreshed) {
      const retryHeaders = new Headers(options.headers)
      retryHeaders.set("Content-Type", "application/json")
      const newToken = getAccessToken()
      if (newToken) retryHeaders.set("Authorization", `Bearer ${newToken}`)
      const retryRes = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: retryHeaders,
      })
      if (!retryRes.ok) {
        let retryMsg = `API request failed: ${retryRes.status}`
        try { const b = await retryRes.json(); if (b?.message) retryMsg = b.message } catch {}
        throw new Error(retryMsg)
      }
      if (retryRes.status === 204) return undefined as T
      return retryRes.json() as Promise<T>
    }
  }

  if (!res.ok) {
    let message = `API request failed: ${res.status}`
    try { const body = await res.json(); if (body?.message) message = body.message } catch {}
    throw new Error(message)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}