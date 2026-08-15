import { apiFetch } from "./client"

export type AuthUser = {
  id: string
  email: string
  displayName: string
  role: "ADMIN" | "USER"
  avatarUrl: string | null
  bioTag: string | null
}

type AuthResponse = {
  accessToken: string
  refreshToken?: string
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

export async function fetchMe() {
  return apiFetch<AuthUser>("/auth/me", { auth: true })
}