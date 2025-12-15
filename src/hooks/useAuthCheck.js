import { useQuery, useQueryClient } from "@tanstack/react-query"
import axios from '../app/axios.js'
import { storeTokens, getAccessToken, getRefreshToken, removeTokens } from "../app/tokenStore.js"

const useAuthCheck = () => {
  const queryClient = useQueryClient()

  const fetchUser = async () => {
    const token = await getAccessToken()
    if (!token) {
      // No token → logged out
      delete axios.defaults.headers.common["Authorization"]
      queryClient.setQueryData(["authUser"], null)
      return null
    }

    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      const res = await axios.get("/users/me")
      return res.data
    } catch (err) {
      if (err.response?.status === 401) {
        // Try refresh
        return await refreshTokens()
      }
      throw err
    }
  }

  const refreshTokens = async () => {
    try {
      const refreshToken = await getRefreshToken()
      if (!refreshToken) throw new Error("No refresh token")

      const res = await axios.post("/users/refresh", { refreshToken })

      // Store new tokens
      await storeTokens({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken ?? refreshToken
      })

      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`

      const me = await axios.get("/users/me")
      return me.data
    } catch (err) {
      // Refresh failed → logout
      await removeTokens()
      delete axios.defaults.headers.common["Authorization"]
      queryClient.setQueryData(["authUser"], null)
      return null
    }
  }

  const { data: user, isLoading, isError, refetch } = useQuery({
    queryKey: ["authUser"],
    queryFn: fetchUser,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

  return { user, isLoading, isError, refetch }
}

export default useAuthCheck
