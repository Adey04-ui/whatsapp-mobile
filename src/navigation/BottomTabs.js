// navigation/BottomTabs.js
import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import FontAwesome from "@expo/vector-icons/FontAwesome"

import ChatListScreen from "../screens/ChatListScreen"
import StatusScreen from "../screens/StatusScreen"
import CallsScreen from "../screens/CallsScreen"
import { BlurView } from "expo-blur"
import { Platform } from "react-native"

const Tab = createBottomTabNavigator()

export default function BottomTabs({ user }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000",
          height: 75,
          borderTopColor: "#111",
        },
        tabBarActiveTintColor: "#0d8446",
        tabBarInactiveTintColor: "#aaa",
        tabBarLabelStyle: {
          fontSize: 13,
          marginBottom: -5,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
        },
        tabBarBackground: Platform.OS === "ios" ? () => ( 
          <BlurView
            intensity={50}
            tint="dark"
            style={{ flex: 1 }}
          /> 
        ) :
          undefined
      }}
    >
      <Tab.Screen
        name="Chats"
        children={() => <ChatListScreen user={user} />}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="comment" size={22} color={color} style={{ marginBottom: 2 }} />
          ),
          tabBarItemStyle: {
            marginTop: 4,
          },
          tabBarLabelStyle: {
            fontSize: 13,
            marginBottom: -5,
          },
        }}
      />

      <Tab.Screen
        name="Status"
        component={StatusScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="circle-o" size={22} color={color} style={{ marginTop: 2 }} />
          ),
        }}
      />

      <Tab.Screen
        name="Calls"
        component={CallsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="phone" size={22} color={color} style={{ marginTop: 2 }} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}
