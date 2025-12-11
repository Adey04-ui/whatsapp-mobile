import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import LoginScreen from "../screens/LoginScreen"
import ChatListScreen from "../screens/ChatListScreen"
import ChatScreen from "../screens/ChatScreen"
import NewChatScreen from "../screens/NewChatScreen"

const Stack = createNativeStackNavigator()

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ChatList" component={ChatListScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="NewChat" component={NewChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
