import { API_URL } from "./config"

const TOKEN_KEY = "nestboard_access_token"
const REFRESH_KEY = "nestboard_refresh_token"

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAccessToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY)
}

export function setRefreshToken(token: string) {
  localStorage.setItem(REFRESH_KEY, token)
}

export function clearRefreshToken() {
  localStorage.removeItem(REFRESH_KEY)
}

export function clearAllTokens() {
  clearAccessToken()
  clearRefreshToken()
}

async function attemptTokenRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })

    if (!res.ok) {
      clearAllTokens()
      return false
    }

    const data = await res.json()
    setAccessToken(data.accessToken)
    if (data.refreshToken) setRefreshToken(data.refreshToken)
    return true
  } catch {
    clearAllTokens()
    return false
  }
}

type ApiOptions = RequestInit & {
  auth?: boolean
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}) {
  const { auth, ...fetchOptions } = options
  const headers = new Headers(fetchOptions.headers)
  headers.set("Content-Type", "application/json")

  if (auth) {
    const token = getAccessToken()
    if (token) headers.set("Authorization", `Bearer ${token}`)
  }

  const res = await fetch(`${API_URL}${path}`, { ...fetchOptions, headers })

  if (res.status === 401 && auth) {
    const refreshed = await attemptTokenRefresh()
    if (refreshed) {
      const retryHeaders = new Headers(fetchOptions.headers)
      retryHeaders.set("Content-Type", "application/json")
      const newToken = getAccessToken()
      if (newToken) retryHeaders.set("Authorization", `Bearer ${newToken}`)
      const retryRes = await fetch(`${API_URL}${path}`, {
        ...fetchOptions,
        headers: retryHeaders,
      })
      if (!retryRes.ok) throw new Error(`API request failed: ${retryRes.status}`)
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
