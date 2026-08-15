/* eslint-disable react-refresh/only-export-components */
import {
  fetchMe,
  type AuthUser,
  login as apiLogin,
  register as apiRegister,
  googleAuth as apiGoogleAuth,
} from "@/api/auth"
import {
  clearAllTokens,
  getAccessToken,
  setAccessToken,
  setRefreshToken,
} from "@/api/client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createContext, useContext, useState, type ReactNode } from "react"

type AuthContextValue = {
  user: AuthUser | undefined
  isLoading: boolean
  isSignedIn: boolean
  login: (email: string, password: string) => Promise<AuthUser>
  logout: () => void
  register: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<AuthUser>
  loginWithGoogle: (idToken: string) => Promise<AuthUser>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [hasToken, setHasToken] = useState(!!getAccessToken())
  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    enabled: hasToken,
    retry: false,
  })

  async function storeTokensAndLoadUser(
    accessToken: string,
    refreshToken: string
  ): Promise<AuthUser> {
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)
    setHasToken(true)
    const me = await fetchMe()
    queryClient.setQueryData(["me"], me)
    return me
  }

  async function login(email: string, password: string): Promise<AuthUser> {
    const { accessToken, refreshToken } = await apiLogin(email, password)
    return storeTokensAndLoadUser(accessToken, refreshToken)
  }

  async function register(
    email: string,
    password: string,
    displayName: string
  ): Promise<AuthUser> {
    const { accessToken, refreshToken } = await apiRegister(
      email,
      password,
      displayName
    )
    return storeTokensAndLoadUser(accessToken, refreshToken)
  }

  async function loginWithGoogle(idToken: string): Promise<AuthUser> {
    const { accessToken, refreshToken } = await apiGoogleAuth(idToken)
    return storeTokensAndLoadUser(accessToken, refreshToken)
  }

  function logout() {
    clearAllTokens()
    setHasToken(false)
    queryClient.removeQueries({ queryKey: ["me"] })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: hasToken && isLoading,
        isSignedIn: !!user,
        login,
        logout,
        register,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
