import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from '../app/axios.js'
import { storeRefreshToken, getRefreshToken } from "../app/tokenStore.js";

const useAuthCheck = () => {
  const queryClient = useQueryClient();

  // === AUTH CHECK REQUEST ===
  const fetchUser = async () => {
    try {
      const res = await axios.get("/users/me", { withCredentials: true });
      return res.data;
    } catch (err) {
      // If access token expired
      if (err.response?.status === 401) {
        // Try refresh
        const refreshedUser = await refreshTokens();
        return refreshedUser;
      }
      throw err;
    }
  };

  // === REFRESH TOKEN REQUEST ===
  const refreshTokens = async () => {
    try {
      const refreshToken = await getRefreshToken(); // Native-only (web uses cookie)

      const res = await axios.post(
        "/users/refresh",
        { refreshToken },
        { withCredentials: true }
      );

      // Save new refresh token (React Native)
      if (res.data.refreshToken) {
        await storeRefreshToken(res.data.refreshToken);
      }

      // Update axios default Authorization header
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.accessToken}`;

      // Re-fetch /me with new access token
      const me = await axios.get("/users/me", { withCredentials: true });
      return me.data;

    } catch (err) {
      console.log("Refresh failed:", err.response?.data);
      queryClient.removeQueries(["authUser"]);
      return null;
    }
  };

  // === REACT QUERY HOOK ===
  const { data: user, isLoading, isError, refetch } = useQuery({
    queryKey: ["authUser"],
    queryFn: fetchUser,
    retry: false, // we handle retries manually
    staleTime: 1000 * 60 * 10, // 10 mins
  });

  return { user, isLoading, isError, refetch };
};

export default useAuthCheck;
