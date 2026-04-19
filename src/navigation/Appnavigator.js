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
import { SafeAreaView } from "react-native-safe-area-context"
import { Platform } from "react-native"

const Stack = createNativeStackNavigator()

export default function AppNavigator() {
  const { user, isLoading } = useAuthCheck()

  if (isLoading) return null

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown: false,
          headerShown: false,
          animation: "slide_from_right",
          cardStyle: {
            backgroundColor: "#000",
          },
          detachPreviousScreen: Platform.OS === 'android' ? false : undefined, 
          cardOverlayEnabled: true,  
          cardShadowEnabled: true,   
          presentation: "card",
          gestureEnabled: true,
          gestureResponseDistance: 150,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 300 } },
            close: { animation: 'timing', config: { duration: 300 } },
          },
          cardStyleInterpolator: ({ current, layouts }) => ({
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          }),
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

              <Stack.Screen name="Chat">
                {props => <ChatScreen {...props} user={user} />}
              </Stack.Screen>

              <Stack.Screen name="NewChat">
                {props => <NewChatScreen {...props} user={user} />}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}
