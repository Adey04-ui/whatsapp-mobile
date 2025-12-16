import React, { useEffect } from "react"
import { View, Text, Button, StyleSheet, Pressable } from "react-native"
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { TextInput } from "react-native"
import { useState } from "react"
import Users from "../components/Users"
import useGetUsers from "../hooks/useGetUsers"

export default function NewChatScreen({ navigation, user }) {
  const {data: users, isLoading} = useGetUsers()
  const [search, setSearch] = useState("")

  const filteredUsers = (users || []).filter(
    (u) =>
      u._id !== user._id &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.phone.includes(search.toLowerCase()))
  )

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.topBar}>
          <View style={styles.topBar1}>
            <Pressable onPress={() => navigation.goBack()} style={{paddingHorizontal: 5, paddingLeft: 10,}}>
              <FontAwesome name='angle-left' size={29} color="#fff" />
            </Pressable>
            <Text style={{color: '#fff', fontSize: 20, fontWeight: '500',}}>
              New chat
            </Text>
          </View>
          <View style={styles.topBar2}>
            <Text>
              <FontAwesome name='ellipsis-v' size={26} color="#fff" />
            </Text>
          </View>
        </View>
        <View style={styles.searchBarView}>
          <Text style={{color: '#9f9f9f', fontSize: 16, marginLeft:10, marginTop: 5, marginBottom: 5,}}>
            To: 
          </Text>
          <TextInput 
            style={styles.searchbar}
            placeholder="Search name or number"
            placeholderTextColor="#9f9f9f"
            value={search} 
            onChangeText={setSearch}
            cursorColor="#0d8446"
          />
        </View>
      </View>
      <Users users={filteredUsers} isLoading={isLoading} navigation={navigation} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  topBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 30,
    backgroundColor: '#000',
    paddingVertical: 20,
    alignItems: 'center',
  },
  topBar1: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  searchBarView: {
    backgroundColor: '#000',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#292929',
    borderBottomWidth: 1,
  },
  searchbar: {
    flex: 1,
    paddingLeft: 10,
    color: '#9f9f9f'
  },
})
