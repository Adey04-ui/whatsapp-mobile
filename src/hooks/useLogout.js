import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../app/axios"
import { removeTokens } from "../app/tokenStore"
import Toast from "react-native-toast-message"

const logoutRequest = async () => {
  await api.post("/users/logout")
}

export default function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logoutRequest,

    onSuccess: async (data) => {
      const message = data?.message || "Logged out successfully"
      await removeTokens()
      queryClient.clear()
      Toast.show({
        type: "success",
        text1: message,
      })
    },
  })
}
