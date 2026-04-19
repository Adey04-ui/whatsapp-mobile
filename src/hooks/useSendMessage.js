import { useMutation } from "@tanstack/react-query"
import { sendMessage } from "../services/messageService"

export const useSendMessage = () => {

  return useMutation({
    mutationFn: sendMessage,
    onError: (error) => {
      console.error(error.response?.data?.message || "send message failed")
    },
  })
}
