import { apiFetch } from "./client"

type BackendAuthResponse = {
  accessToken: string
  refreshToken?: string
}

export async function backendLogin(email: string, password: string) {
  return apiFetch<BackendAuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}