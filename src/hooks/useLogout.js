import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../app/axios"
import { removeTokens, getRefreshToken } from "../app/tokenStore"
import { showMessage } from "react-native-flash-message"

const logoutRequest = async () => {
  const refreshToken = await getRefreshToken()
  await api.post("/users/logout", { refreshToken })
}

export default function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logoutRequest,

    onSuccess: async () => {
      await removeTokens()
      delete api.defaults.headers.common["Authorization"]
      queryClient.setQueryData(["authUser"], null)
      queryClient.invalidateQueries(["authUser"])

      showMessage({
        message: "Logout Successful",
        description: "Logged out.",
        backgroundColor: "#0d8446",
        color: "#fff",
        style: {
        marginTop: 40,
        borderRadius: 12,
        },
      })
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        "Logout failed"

      console.log("Logout error:", message)
    },
  })
}
