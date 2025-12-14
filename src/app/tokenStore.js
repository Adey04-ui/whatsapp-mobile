import * as SecureStore from "expo-secure-store"

export const storeTokens = async ({ accessToken, refreshToken }) => {
  if (accessToken) {
    await SecureStore.setItemAsync("accessToken", accessToken)
  }
  if (refreshToken) {
    await SecureStore.setItemAsync("refreshToken", refreshToken)
  }
}

export const getAccessToken = async () => {
  return await SecureStore.getItemAsync("accessToken")
}

export const getRefreshToken = async () => {
  return await SecureStore.getItemAsync("refreshToken")
}

export const removeTokens = async () => {
  await SecureStore.deleteItemAsync("accessToken")
  await SecureStore.deleteItemAsync("refreshToken")
}
