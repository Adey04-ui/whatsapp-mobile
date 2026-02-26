import { useEffect, useCallback } from "react"
import instance from "../app/axios"
import { getSocket } from "../socket/socket"

export default function useMarkMessagesRead(chatId, user) {
  const markRead = useCallback(async () => {
    if (!chatId || !user) return

    try {
      await instance.put(`/messages/read/${chatId}`)

      const socket = getSocket()
      socket?.emit("messageRead", {
        chatId,
        userId: user._id,
      })
    } catch (err) {
      console.error("markRead error", err)
    }
  }, [chatId, user])

  useEffect(() => {
    if (!chatId || !user) return

    markRead()

    const socket = getSocket()
    if (!socket) return

    const handleIncoming = (message) => {
      const incomingChatId =
        message?.chatId?._id || message?.chat?._id || message?.chatId

      if (incomingChatId?.toString() === chatId.toString()) {
        markRead()
      }
    }

    socket.on("messageReceived", handleIncoming)

    return () => {
      socket.off("messageReceived", handleIncoming)
    }
  }, [chatId, user, markRead])
}
