import queryClient from "./src/app/QueryClient"
import AppNavigator from "./src/navigation/AppNavigator"
import { QueryClientProvider } from "@tanstack/react-query"

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigator />
    </QueryClientProvider>
  )
}
