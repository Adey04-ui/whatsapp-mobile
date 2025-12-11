import { QueryClient } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'

const localStorageAsync = {
  getItem: async (key) => {
    try {
      return Promise.resolve(localStorage.getItem(key))
    } catch (err) {
      return Promise.resolve(null)
    }
  },
  setItem: async (key, value) => {
    try {
      localStorage.setItem(key, value)
      return Promise.resolve()
    } catch (err) {
      return Promise.reject(err)
    }
  },
  removeItem: async (key) => {
    try {
      localStorage.removeItem(key)
      return Promise.resolve()
    } catch (err) {
      return Promise.reject(err)
    }
  },
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2, 
      cacheTime: 1000 * 60 * 60 * 24, 
    },
  },
})

const persister = createAsyncStoragePersister({
  storage: localStorageAsync,
})

persistQueryClient({
  queryClient,
  persister,
  maxAge: 1000 * 60 * 60 * 24, 
})

export default queryClient
