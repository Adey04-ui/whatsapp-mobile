import { useMutation, useQueryClient } from "@tanstack/react-query"
import instance from "../app/axios.js"
import { storeTokens } from "../app/tokenStore.js"
import Toast from "react-native-toast-message"

const loginRequest = async ({ email, password }) => {
  const res = await instance.post("/users/login", { email, password });
  return res.data;
};

export default function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginRequest,

    onSuccess: async (data) => {
      await storeTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      queryClient.setQueryData(["me"], {
        _id: data._id,
        name: data.name,
        email: data.email,
        profilePic: data.profilePic,
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        "Login failed"

      Toast.show({
        type: "error",
        text1: "Login Error",
        text2: message,
      })
    },
  });
}
