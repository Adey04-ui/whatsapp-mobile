import { useMutation, useQueryClient } from "@tanstack/react-query"
import instance from "../app/axios"
import { storeTokens } from "../app/tokenStore"
import { showMessage } from "react-native-flash-message"

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

      showMessage({
        message:`welcome ${data.name}`,
        description: "Logged in.",
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
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed"

      showMessage({
        message: message,
        description: "Error.",
        backgroundColor: "#0d8446",
        color: "#fff",
        style: {
        marginTop: 40,
        borderRadius: 12,
        },
      })
    },
  })
}
