import axios from "axios"
import * as SecureStore from "expo-secure-store"

const instance = axios.create({
  baseURL: "https://mock-backend-mjwh.onrender.com/api",
  withCredentials: true,
})

// Add access token to every request if available
instance.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


export default instance
