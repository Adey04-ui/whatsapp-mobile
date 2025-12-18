import React, { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import * as ImagePicker from "expo-image-picker"
import useRegister from "../hooks/useRegister"
import Toast from "react-native-toast-message"
import logo from '../assets/logo.png'
import { io } from "socket.io-client"

function RegisterScreen({ navigation }) {
  const socketRef = useRef(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [profilePic, setProfilePic] = useState(null)
  const [emailTimeout, setEmailTimeout] = useState(null)
  const [phoneTimeout, setPhoneTimeout] = useState(null)
  const [emailStatus, setEmailStatus] = useState(null)
  const [phoneStatus, setPhoneStatus] = useState(null)

  const { mutate: register, isPending } = useRegister()

  
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) return

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })

    if (!result.canceled) {
      setProfilePic(result.assets[0])
    }
  }

  useEffect(() => {
    socketRef.current = io('https://mock-backend-mjwh.onrender.com/', {
      transports: ["polling", "websocket"],
      forceNew: true,
    })

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id)
    })

    socketRef.current.on('emailStatus', (data) => {
      setEmailStatus(data)
    })

    socketRef.current.on('phoneStatus', (data) => {
      setPhoneStatus(data)
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [])

  const handleRegister = () => {
    const formData = new FormData()
    formData.append("name", name)
    formData.append("email", email)
    formData.append("phone", phone)
    formData.append("password", password)

    if (profilePic) {
      formData.append("profilePic", {
        uri: profilePic.uri,
        name: "profile.jpg",
        type: "image/jpeg",
      })
    }

    register(formData, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text2: `Welcome ${name}`,
        })
        navigation.replace("ChatList")
      },
    })
  }

  const handleEmailChange = (value) => {
    setEmail(value)

    if (emailTimeout) clearTimeout(emailTimeout)

    if (!value.trim()) {
      setEmailStatus(null)
      return
    }

    const timeout = setTimeout(() => {
      if (value && value.includes('@') && value.includes('.')) {
        socketRef.current.emit('checkEmail', value)
      }
    }, 600)

    setEmailTimeout(timeout)
  }

  const handlePhoneChange = (value) => {
    setPhone(value)

    if (phoneTimeout) clearTimeout(phoneTimeout)

    if (!value.trim()) {
      setPhoneStatus(null)
      return
    }

    const timeout = setTimeout(() => {
        socketRef.current.emit('checkPhone', value)
    }, 600)

    setPhoneTimeout(timeout)
  }
  const canSubmit =
  name &&
  emailStatus?.available &&
  phoneStatus?.available

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: "#202020" }}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.registerContainer2}>
          <View style={styles.registerContainer}>
            <Text style={styles.title}>
              <Image source={logo} style={styles.logo} />
            </Text>
            <Text style={styles.title2}>Sign-up</Text>

            
            <View style={styles.imageContainer}>
              {profilePic ? (
                <Image
                  source={{ uri: profilePic.uri }}
                  style={styles.imagePreview}
                />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={{ color: "#9f9f9f" }}>Profile picture</Text>
                </View>
              )}

              <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
                <Text style={styles.imageButtonText}>
                  {profilePic ? "Change Image" : "Select Image"}
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text style={styles.label}>
                <FontAwesome name="user" size={22} color="#9f9f9f" />
              </Text>
              <TextInput
                placeholder="Name"
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholderTextColor="#9f9f9f"
                cursorColor="#0d8446"
              />
            </View>

            <View>
              <Text style={styles.label}>
                <FontAwesome name="envelope" size={22} color="#9f9f9f" />
              </Text>
              <TextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={handleEmailChange}
                autoCapitalize="none"
                placeholderTextColor="#9f9f9f"
                cursorColor="#0d8446"
              />
              {emailStatus && (
                <Text
                 style={emailStatus.available ? {color: '#0d8446', fontSize: 16,} : {color: 'red', fontSize: 16,}}
                >
                  <FontAwesome name="info-circle" size={17} />
                  &nbsp;
                  {emailStatus.message}
                </Text>
              )}
            </View>

            <View>
              <Text style={styles.label}>
                <FontAwesome name="phone" size={22} color="#9f9f9f" />
              </Text>
              <TextInput
                placeholder="Phone"
                style={styles.input}
                value={phone}
                onChangeText={handlePhoneChange}
                autoCapitalize="none"
                placeholderTextColor="#9f9f9f"
                cursorColor="#0d8446"
              />
              {phoneStatus && (
                <Text
                 style={phoneStatus.available ? {color: '#0d8446', fontSize: 16,} : {color: 'red', fontSize: 14,}}
                >
                  <FontAwesome name="info-circle" size={15} />
                  &nbsp;
                  {phoneStatus.message}
                </Text>
              )}
            </View>

            <View>
              <Text style={styles.label}>
                <FontAwesome name="lock" size={22} color="#9f9f9f" />
              </Text>
              <TextInput
                placeholder="Password"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#9f9f9f"
                cursorColor="#0d8446"
              />
            </View>

            <TouchableOpacity  
             onPress={handleRegister}
             style={styles.button}
            >
              <Text style={styles.buttonText}>
                {isPending ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  "Sign Up"
                )}
              </Text>
            </TouchableOpacity>

            <Text style={styles.switchText}>
              Already have an account?{" "}
              <Text
                style={{ color: "#295d42" }}
                onPress={() => navigation.goBack()}
              >
                Sign In
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#202020",
    paddingHorizontal: 25,
  },
  registerContainer: {
    backgroundColor: "#2c2c2c",
    padding: 20,
    borderRadius: 10,
  },
  registerContainer2: {
    flex: 1,
    justifyContent: "center",
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
  input: {
    backgroundColor: "#383838",
    marginVertical: 10,
    padding: 9,
    paddingLeft: 36,
    borderRadius: 5,
    color: "#fff",
    fontSize: 16,
  },
  label: {
    position: "absolute",
    top: 18,
    left: 8,
    zIndex: 1,
  },
  imageBtn: {
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#295d42",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  switchText: {
    marginTop: 20,
    color: "#9f9f9f",
    textAlign: "center",
    fontSize: 18,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imagePreview: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 10,
  },
  placeholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#383838",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  imageButton: {
    backgroundColor: "#295d42",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 5,
  },
  imageButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  logo: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  scrollContent: {
    flexGrow: 1,
  },
})

export default RegisterScreen
