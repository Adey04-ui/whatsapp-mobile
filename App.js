import queryClient from "./src/app/QueryClient"
import AppNavigator from "./src/navigation/AppNavigator"
import { QueryClientProvider } from "@tanstack/react-query"
import useAuthCheck from "./src/hooks/useAuthCheck"
import Loader from "./src/components/Loader"
import Toast from "react-native-toast-message"

function Root() {
  const { user, isLoading } = useAuthCheck()

  if (isLoading) return <Loader />

  return <AppNavigator user={user} />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Root />
      <Toast />
    </QueryClientProvider>
  )
}
