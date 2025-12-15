import axios from "axios"
import { getAccessToken } from "./tokenStore"

const instance = axios.create({
  baseURL: "https://mock-backend-mjwh.onrender.com/api"
})

instance.interceptors.request.use(async (config) => {
  const token = await getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


export default instance
