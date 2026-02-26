import queryClient from "./src/app/QueryClient"
import AppNavigator from "./src/navigation/AppNavigator"
import { QueryClientProvider } from "@tanstack/react-query"
import useAuthCheck from "./src/hooks/useAuthCheck"
import Loader from "./src/components/Loader"
import FlashMessage from "react-native-flash-message"
import { initSocket } from "./src/socket/socket"
import { useEffect } from "react"
import { getSocket } from "./src/socket/socket"
import useGetChats from "./src/hooks/useGetChats"
import { SafeAreaView } from 'react-native-safe-area-context'

function JoinAllChatsOnLoad() {
  const { data: chats = [] } = useGetChats()

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return
    if (!chats || !chats.length) return
    chats.forEach((chat) => {
      if (chat?._id) {
        socket.emit("joinChat", chat._id)
      }
    })
  }, [chats])

  return null
}


function Root() {
  const { user, isLoading } = useAuthCheck()

  useEffect(() => {
    if (user) {
      initSocket()
    }
  }, [user])

  if (isLoading) return <Loader />

  return <AppNavigator user={user} />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <Root />
      <JoinAllChatsOnLoad />
      <FlashMessage position="top" />
    </QueryClientProvider>
  )
}
