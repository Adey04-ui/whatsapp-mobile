// navigation/BottomTabs.js
import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { BlurView } from "expo-blur"
import { Platform } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import ChatListScreen from "../screens/ChatListScreen"
import StatusScreen from "../screens/StatusScreen"
import CallsScreen from "../screens/CallsScreen"

const Tab = createBottomTabNavigator()

export default function BottomTabs({ user }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Platform.OS === "ios" ? "transparent" : "#000",
            borderTopColor: "#111",
            height: 75,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          },
          tabBarActiveTintColor: "#0d8446",
          tabBarInactiveTintColor: "#aaa",
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 13,
            marginBottom: 5,
          },
          tabBarIconStyle: {
            marginTop: 5,
          },
          tabBarBackground: Platform.OS === "ios" 
            ? () => (
                <BlurView
                  intensity={80}
                  tint="dark"
                  style={StyleSheet.absoluteFill}
                />
              )
            : undefined,
        }}
      >
        <Tab.Screen
          name="Chats"
          children={() => <ChatListScreen user={user} />}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="comment" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="Status"
          component={StatusScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="circle-o" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="Calls"
          component={CallsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="phone" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  )
}