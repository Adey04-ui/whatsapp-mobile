import { useQuery } from "@tanstack/react-query"
import instance from '../app/axios.js'

export default function useGetUsers() {
  const { data, error, isLoading, isSuccess } = useQuery({
    queryKey: ["getUsers"],
    queryFn: async () => {
      const res = await instance.get("/users")
      return res.data
    }
  })

  return { data, isLoading, error, isSuccess }
}