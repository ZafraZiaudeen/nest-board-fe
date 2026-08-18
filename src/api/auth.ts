import { apiFetch } from "./client"

export type AuthUser = {
  id: string
  email: string
  displayName: string
  role: "ADMIN" | "USER"
  avatarUrl: string | null
  bioTag: string | null
}

export type AuthResponse = {
  accessToken: string
  refreshToken: string
}

export async function login(email: string, password: string) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export async function register(
  email: string,
  password: string,
  displayName: string
) {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, displayName }),
  })
}

export async function googleAuth(idToken: string) {
  return apiFetch<AuthResponse>("/auth/google", {
    method: "POST",
    body: JSON.stringify({ idToken }),
  })
}

export async function refreshTokens(refreshToken: string) {
  return apiFetch<AuthResponse>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  })
}

export async function fetchMe() {
  return apiFetch<AuthUser>("/auth/me", { auth: true })
}

export async function updateProfile(data: {
  displayName?: string
  avatarUrl?: string
}) {
  return apiFetch<AuthUser>("/auth/me", {
    method: "PATCH",
    body: JSON.stringify(data),
    auth: true,
  })
}
