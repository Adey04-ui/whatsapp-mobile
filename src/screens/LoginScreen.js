import React, { useState } from 'react'
import { Button, View, StyleSheet, Text, Platform, TouchableOpacity } from 'react-native'
import { KeyboardAvoidingView, TextInput } from 'react-native'

function LoginScreen({navigation}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {

  }
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.loginContainer}>
        <Text style={styles.title}>
          Whatsapp
        </Text>
        <TextInput
          placeholder='Email'
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize='none'
        />

        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: '#202020',
      paddingHorizontal: 25,
      alignItems: 'center',
      color: '#9f9f9f',
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      color: '#0d8446',
      fontWeight: 'condensedBold',
      fontSize: 29,
    },
    loginContainer: {
      backgroundColor: '#2c2c2c',
      padding: 20,
      borderRadius: 10,
      boxShadow: '0px 10px 20px #00000033',
      width: '87%',
      color: '#9f9f9f'
    },
    input: {
      backgroundColor: '#383838',
      marginVertical: 10,
      padding: 7,
      borderRadius: 5,
      color: '#ffffff',
      fontSize: 16,
    },
    button: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#295d42',
      padding: 8,
      borderRadius: 5,
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
    }
  })

export default LoginScreen