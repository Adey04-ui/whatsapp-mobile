import React, { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import LoginScreen from "../screens/LoginScreen"
import RegisterScreen from "../screens/RegisterScreen"
import ChatListScreen from "../screens/ChatListScreen"
import ChatScreen from "../screens/ChatScreen"
import NewChatScreen from "../screens/NewChatScreen"
import useAuthCheck from "../hooks/useAuthCheck"
import BottomTabs from "./BottomTabs"

const Stack = createNativeStackNavigator()

export default function AppNavigator() {
  const { user, isLoading } = useAuthCheck()

  if (isLoading) return null

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false,
        animation: "slide_from_right",
        animationDuration: 50,
        cardStyle: {
          backgroundColor: "transparent",
          detachPreviousScreen: false,
        },
       }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs">
              {() => <BottomTabs user={user} />}
            </Stack.Screen>

            <Stack.Screen name="Chat" component={ChatScreen} />
            
            <Stack.Screen name="NewChat">
              {props => <NewChatScreen {...props} user={user} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
