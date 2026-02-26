// socket/socket.js
import { io } from "socket.io-client"
import { getAccessToken } from "../app/tokenStore"

let socket = null

export const initSocket = async () => {
  if (socket) return socket

  const token = await getAccessToken()

  socket = io("https://mock-backend-mjwh.onrender.com", {
    transports: ["websocket"],
    auth: { token },
    autoConnect: true,
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
