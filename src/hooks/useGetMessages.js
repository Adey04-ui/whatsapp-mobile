import { useQuery } from "@tanstack/react-query"
import { useInfiniteQuery } from "@tanstack/react-query"
import instance from "../app/axios"


const fetchMessages = async ({ pageParam = 1, queryKey }) => {
  const [_key, chatId] = queryKey
  const { data } = await instance.get(`/messages/${chatId}?page=${pageParam}&limit=20&sort=desc`, {
    withCredentials: true,
  })
  return data 
}

export default function useGetMessages(chatId) {
  return useInfiniteQuery({
    queryKey: ["messages", chatId],
    queryFn: fetchMessages,
    enabled: !!chatId,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore) return allPages.length + 1
      return undefined 
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
  })
}

export const useGetAllMessages = () => {
  return useQuery({
    queryKey: ["allMessages"],
    queryFn: async () => {
      const { data } = await instance.get(`/messages/all`, { withCredentials: true })
      return data
    },
    retry: false,
    refetchOnWindowFocus: false,
  })
}
