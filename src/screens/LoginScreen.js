import React, { useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Button, View, StyleSheet, Text, Platform, TouchableOpacity, Image, Pressable } from 'react-native'
import { KeyboardAvoidingView, TextInput } from 'react-native'
import logo from '../assets/logo.png'
import useLogin from '../hooks/useLogin'
import { ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

function LoginScreen({ navigation, setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { mutate: login, isPending, error } = useLogin()

  const handleLogin = () => {
    login(
      { email, password }
    )
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
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
              keyboardType='email-address'
              returnKeyType='next'
              style={styles.input}
              value={email}
              placeholderTextColor={'#9f9f9f'}
              onChangeText={setEmail}
              autoCapitalize='none'
              autoCorrect={false}
              textContentType='email'
              cursorColor="#0d8446"
            />
          </View>
          <View>
            <Pressable style={styles.label1} onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <FontAwesome name='eye' size={22} color='#9f9f9f' />
              ) : (
                <FontAwesome name='eye-slash' size={22} color='#9f9f9f' />
              )}
            </Pressable>
            <TextInput
              placeholder="Password"
              style={styles.input}
              value={password}
              placeholderTextColor={'#9f9f9f'}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              returnKeyType='done'
              cursorColor="#0d8446"
              textContentType={`${showPassword ? 'none' : 'password'}`}
              autoCapitalize='none'
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
                style={{ color: '#295d42' }}
              >
                Create one
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202020',
    paddingHorizontal: 15,
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
    width: '100%',
    color: '#9f9f9f',
  },
  input: {
    backgroundColor: '#383838',
    marginVertical: 15,
    padding: 9,
    paddingLeft: 40,
    paddingVertical: 14,
    borderRadius: 30,
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
    borderRadius: 30,
    marginTop: 20,
    paddingVertical: 11,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  label: {
    position: 'absolute',
    top: 29,
    left: 13,
    zIndex: 1,
  },
  label1: {
    position: 'absolute',
    top: 25,
    left: 13,
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
    fontSize: 21,
  },
  logo: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
    marginBottom: 10,
  },
})

export default LoginScreen