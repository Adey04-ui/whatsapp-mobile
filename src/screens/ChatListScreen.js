import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function ChatListScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chats</Text>

      <Button
        title="Open Chat"
        onPress={() => navigation.navigate("Chat", { chatId: 1 })}
      />

      <Button
        title="Start New Chat"
        onPress={() => navigation.navigate("NewChat")}
      />
    </View>
  );
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
});
