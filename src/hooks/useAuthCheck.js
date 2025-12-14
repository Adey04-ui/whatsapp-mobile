import { useQuery, useQueryClient } from "@tanstack/react-query"
import axios from '../app/axios.js'
import { storeTokens, getRefreshToken, removeTokens } from "../app/tokenStore.js"

const useAuthCheck = () => {
  const queryClient = useQueryClient()

  // === AUTH CHECK REQUEST ===
  const fetchUser = async () => {
    try {
      const res = await axios.get("/users/me", { withCredentials: true })
      return res.data
    } catch (err) {
      // If access token expired
      if (err.response?.status === 401) {
        // Try refresh
        const refreshedUser = await refreshTokens()
        return refreshedUser
      }
      throw err
    }
  }

  // === REFRESH TOKEN REQUEST ===
  const refreshTokens = async () => {
    try {
      const refreshToken = await getRefreshToken()
      if (!refreshToken) return null

      const res = await axios.post(
        "/users/refresh",
        { refreshToken },
        { withCredentials: true }
      )

      // Store new tokens
      await storeTokens({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken ?? refreshToken
      })

      // Update axios default header
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`

      // Fetch user again with new access token
      const me = await axios.get("/users/me", { withCredentials: true })
      return me.data

    } catch (err) {
      console.log("Refresh failed:", err.response?.data)
      await removeTokens() // Clear all tokens
      queryClient.removeQueries(["authUser"])
      console.log("Tokens removed due to failed refresh.")
      return null
    }
  }

  // === REACT QUERY HOOK ===
  const { data: user, isLoading, isError, refetch } = useQuery({
    queryKey: ["authUser"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 10,
  })

  return { user, isLoading, isError, refetch }
}

export default useAuthCheck
