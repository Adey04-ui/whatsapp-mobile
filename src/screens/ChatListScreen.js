import React from "react"
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native"
import useLogout from "../hooks/useLogout"

export default function ChatListScreen({ navigation, user, setUser }) {
  const { mutate: logout, isPending } = useLogout()

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        setUser(null) // <- this will re-render navigator and show login
      },
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chats</Text>
      <Text>user: {user ? user.name : 'no user'}</Text>

      <Button
        title="Open Chat"
        onPress={() => navigation.navigate("Chat", { chatId: 1 })}
      />

      <Button
        title="Start New Chat"
        onPress={() => navigation.navigate("NewChat")}
      />

      <Button
        onPress={handleLogout}
        style={styles.logoutBtn}
        title={isPending ? "Logging out..." : "Logout"}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
})
