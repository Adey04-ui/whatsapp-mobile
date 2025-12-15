import { useQuery } from "@tanstack/react-query"
import instance from '../app/axios.js'

export default function useGetChats() {
  return useQuery({
    queryKey: ["getChats"],
    queryFn: async () => {
      const res = await instance.get("/chats")
      return res.data
    },
  })
}
