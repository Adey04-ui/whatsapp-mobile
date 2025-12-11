import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function ChatScreen({ route, navigation }) {
  const { chatId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat with ID: {chatId}</Text>

      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
  },
});
