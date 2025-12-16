import instance from "../app/axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"



const openChatRequest = async (userId) => {
  const res = await instance.post("/chats", { userId })
  return res.data
}

export default function useOpenChat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: openChatRequest,

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getChats"] })
    },
  })
}