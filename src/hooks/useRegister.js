import { useMutation, useQueryClient } from "@tanstack/react-query"
import instance from "../app/axios"
import { storeTokens } from "../app/tokenStore"
import Toast from "react-native-toast-message"

const registerRequest = async (formData) => {
  const res = await instance.post("/users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return res.data
}

export default function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: registerRequest,

    onSuccess: async (data) => {
      await storeTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })

      queryClient.setQueryData(["me"], {
        _id: data._id,
        name: data.name,
        email: data.email,
        profilePic: data.profilePic,
      })

      Toast.show({
        type: "success",
        text1: "Account Created",
      })
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed"

      Toast.show({
        type: "error",
        text1: "Register Error",
        text2: message,
      })
    },
  })
}
