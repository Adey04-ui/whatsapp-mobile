// socket/socket.js
import { io } from "socket.io-client"
import { getAccessToken } from "../app/tokenStore"

let socket = null

export const initSocket = async () => {
  if (socket) return socket

  const token = await getAccessToken()

  console.log("[SOCKET INIT] Token being sent:", token ? token.substring(0, 20) + "..." : "NO TOKEN")

  socket = io("https://mock-backend-mjwh.onrender.com", {
    transports: ["websocket"],
    auth: { token },
    autoConnect: true,
    query: { client: "mobile" }
  })

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id)
  })

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason)
  })

  return socket
}

export const getSocket = () => socket
