import axios from "axios";

const instance = axios.create({
  baseURL: "https://mock-backend-mjwh.onrender.com/api",
  withCredentials: true,
});

// Add access token to every request if available
instance.interceptors.request.use(async (config) => {
  const token = instance.defaults.headers.common["Authorization"];
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default instance;
