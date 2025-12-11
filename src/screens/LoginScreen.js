import React from 'react'
import { Button, View, StyleSheet, Text } from 'react-native'

function LoginScreen({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Login screen
      </Text>
      <Button
        title='go to chats'
        onPress={()=> navigation.navigate("ChatList")} />
    </View>
  )
}
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
    }
  })

export default LoginScreen