import { useMutation, useQueryClient } from "@tanstack/react-query"
import instance from "../app/axios.js"
import { storeTokens } from "../app/tokenStore.js"
import { showMessage } from "react-native-flash-message"

const loginRequest = async ({ email, password }) => {
  const res = await instance.post("/users/login", { email, password })
  return res.data
}

export default function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: loginRequest,

    onSuccess: async (data) => {
      await storeTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })

      queryClient.setQueryData(["authUser"], {
        _id: data._id,
        name: data.name,
        email: data.email,
        profilePic: data.profilePic,
      })
      showMessage({
        message: `welcome ${data.name}`,
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
        error?.response?.data?.message ??
        error?.message ??
        "Login failed"

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
      console.log("Login error:", error)
    },
  })
}
