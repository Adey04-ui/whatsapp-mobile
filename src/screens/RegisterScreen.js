import React, { useState } from "react"
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
} from "react-native"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import * as ImagePicker from "expo-image-picker"
import useRegister from "../hooks/useRegister"
import Toast from "react-native-toast-message"

function RegisterScreen({ navigation }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [profilePic, setProfilePic] = useState(null)

  const { mutate: register, isPending } = useRegister()

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    })

    if (!result.canceled) {
      setProfilePic(result.assets[0])
    }
  }

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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.registerContainer}>
        <Text style={styles.title}>Create Account</Text>

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
            onChangeText={setEmail}
            autoCapitalize="none"
            placeholderTextColor="#9f9f9f"
          />
        </View>

        <View>
          <Text style={styles.label}>
            <FontAwesome name="phone" size={22} color="#9f9f9f" />
          </Text>
          <TextInput
            placeholder="Phone"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            autoCapitalize="none"
            placeholderTextColor="#9f9f9f"
          />
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
          />
        </View>

        <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
          <Text style={{ color: "#fff" }}>
            {profilePic ? "Change Profile Picture" : "Pick Profile Picture"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
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
  title: {
    fontSize: 24,
    marginBottom: 15,
    color: "#0d8446",
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
  },
})

export default RegisterScreen
