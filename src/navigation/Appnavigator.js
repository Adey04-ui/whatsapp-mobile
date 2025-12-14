import React, { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import LoginScreen from "../screens/LoginScreen"
import RegisterScreen from "../screens/RegisterScreen"
import ChatListScreen from "../screens/ChatListScreen"
import ChatScreen from "../screens/ChatScreen"
import NewChatScreen from "../screens/NewChatScreen"
import { getAccessToken } from "../app/tokenStore"
import api from "../app/axios"
import useAuthCheck from "../hooks/useAuthCheck"

const Stack = createNativeStackNavigator()

export default function AppNavigator() {
  const [user, setUser] = useState(null)
  const { user: userData, isLoading } = useAuthCheck()

  // Check if user is logged in on app start
  useEffect(() => {
    userData && setUser(userData)
  }, [])

  if (isLoading) return null // or a loading spinner

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="ChatList">
              {props => <ChatListScreen {...props} user={user} setUser={setUser} />}
            </Stack.Screen>
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="NewChat" component={NewChatScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login">
              {props => <LoginScreen {...props} setUser={setUser} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
