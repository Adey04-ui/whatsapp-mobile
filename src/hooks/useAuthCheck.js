import { useQuery, useQueryClient } from "@tanstack/react-query"
import axios from '../app/axios.js'
import { storeTokens, getAccessToken, getRefreshToken, removeTokens } from "../app/tokenStore.js"

const useAuthCheck = () => {
  const queryClient = useQueryClient()

  const fetchUser = async () => {
    const token = await getAccessToken()
    if (!token) return null

    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      const res = await axios.get("/users/me")
      return res.data
    } catch (err) {
      if (err.response?.status === 401) {
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

      console.log("[REFRESH RESPONSE] Full data:", res.data);
      console.log("[REFRESH RESPONSE] accessToken:", res.data.accessToken);
      console.log("[REFRESH RESPONSE] accessToken length:", res.data.accessToken?.length || "missing")

      const newAccess = res.data.accessToken;
      if (!newAccess || newAccess.length < 100) {
        console.error("[REFRESH] Invalid access token received:", newAccess);
        throw new Error("Invalid token from server");
      }

      // Store new tokens
      await storeTokens({
        accessToken: newAccess,
        refreshToken: res.data.refreshToken ?? refreshToken
      })

      axios.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`

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
