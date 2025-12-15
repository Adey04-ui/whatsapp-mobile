import React, { useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Button, View, StyleSheet, Text, Platform, TouchableOpacity, Image } from 'react-native'
import { KeyboardAvoidingView, TextInput } from 'react-native'
import logo from '../assets/logo.png'
import useLogin from '../hooks/useLogin'
import { ActivityIndicator } from 'react-native'

function LoginScreen({navigation, setUser}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { mutate: login, isPending, error } = useLogin()

  const handleLogin = () => {
    login(
      { email, password }
    )
  }
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.loginContainer}>
        <Text style={styles.title}>
          <Image source={logo} style={styles.logo} />
        </Text>
        <Text style={styles.title2}>
          Sign-In
        </Text>
        <View>
          <Text style={styles.label}>
            <FontAwesome name='envelope' size={22} color='#9f9f9f' />
          </Text>
          <TextInput
            placeholder='Email'
            style={styles.input}
            value={email}
            placeholderTextColor={'#9f9f9f'}
            onChangeText={setEmail}
            autoCapitalize='none'
          />
        </View>
        <View>
          <Text style={styles.label}>
            <FontAwesome name='eye' size={22} color='#9f9f9f' />
          </Text>
          <TextInput
            placeholder="Password"
            style={styles.input}
            value={password}
            placeholderTextColor={'#9f9f9f'}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.message1}>
          <Text style={styles.message2}>
            Don't have an account?. 
            <Text
             onPress={() => navigation.navigate("Register")}
             style={{color: '#295d42'}}
            >
              Create one
            </Text>
          </Text>
        </View>
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
      color: '#9f9f9f',
    },
    title: {
      marginBottom: 10,
      color: '#0d8446',
      fontSize: 20,
      display: 'flex',
      textAlign: 'right',
    },
    title2: {
      fontSize: 24,
      marginBottom: 10,
      color: '#0d8446',
      display: 'flex',
    },
    loginContainer: {
      backgroundColor: '#2c2c2c',
      padding: 20,
      borderRadius: 10,
      boxShadow: '0px 10px 20px #00000033',
      width: '94%',
      color: '#9f9f9f',
    },
    input: {
      backgroundColor: '#383838',
      marginVertical: 10,
      padding: 9,
      paddingLeft: 36,
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
      marginTop: 17,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
    },
    label: {
      position: 'absolute',
      top: 18,
      left: 8,
      zIndex: 1,
    },
    message1: {
      marginVertical: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    message2: {
      color: '#9f9f9f',
      fontSize: 18,
    },
    logo: {
      height: 18,
      width: 18,
      resizeMode: 'contain',
      marginBottom: 10,
    },
  })

export default LoginScreen