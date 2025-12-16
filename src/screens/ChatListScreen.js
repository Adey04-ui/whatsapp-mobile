import React, { useState, useEffect } from "react"
import { View, Text, Button, StyleSheet, Pressable, TextInput, Image, FlatList } from "react-native"
import FontAwesome from '@expo/vector-icons/FontAwesome'
import useLogout from "../hooks/useLogout"
import useGetChats from "../hooks/useGetChats"
import { ActivityIndicator } from "react-native"

export default function ChatListScreen({ navigation, user }) {
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return ""

    const messageDate = new Date(timestamp)
    const now = new Date()

    const isToday = messageDate.toDateString() === now.toDateString()

    const yesterday = new Date()
    yesterday.setDate(now.getDate() - 1)
    const isYesterday = messageDate.toDateString() === yesterday.toDateString()

    if (isToday) {
      // show time in 24-hour format
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      })
    } else if (isYesterday) {
      return "Yesterday"
    } else {
      // show short date format (e.g. Oct 9)
      return messageDate.toLocaleDateString([], {
        month: "short",
        day: "numeric"
      })
    }
  }

  const {data: chats = [], isLoading} = useGetChats()

  const { mutate: logout, isPending } = useLogout()
  const [search, setSearch] = useState('')

  const handleLogout = () => {
    logout()
  }

  const filteredChats = (chats || []).filter((chat) => {
    const otherUsers = chat.users.filter((u) => u._id !== user._id)

    const names = otherUsers.map((u) => u.name).join(", ").toLowerCase()
    const emails = otherUsers.map((u) => u.email).join(", ").toLowerCase()

    const searchTerm = search.toLowerCase()

    return names.includes(searchTerm) || emails.includes(searchTerm)
  })

  const sortedChats = [...filteredChats].sort((a, b) => {
    const aTime = new Date(a.latestMessageAt || 0)
    const bTime = new Date(b.latestMessageAt || 0)
    return bTime - aTime
  })

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.title}>Chats</Text>
        <View style={{display: 'flex', flexDirection: 'row', gap: 27,}}>
          <Text>
            <FontAwesome name='camera' size={26} color='#fff' style={{marginRight: 5,}} />
          </Text>
          <Text>
            <FontAwesome name='ellipsis-v' size={26} color='#fff' />
          </Text>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>
          <FontAwesome name="search" size={24} color="#9f9f9f" />
        </Text>
        <TextInput
          placeholder="Search or start new chat"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#9f9f9f"
          cursorColor="#0d8446"
        />
      </View>
      <View style={{ flex: 1, marginTop: 10, }}>
        {isLoading && (
          <View style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
            <ActivityIndicator size="large" color="#0d8446" />
          </View>
          )}

        <FlatList
          data={sortedChats}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50, paddingHorizontal: 5, }}
          ListEmptyComponent={
            !isLoading && (
              <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>
                No chats found.
              </Text>
            )
          }
          renderItem={({ item: chat }) => {
            const recipient = chat.users.find(
              (u) => u._id !== user._id
            )

            return (
              <Pressable
                style={({ pressed }) => [
                  styles.chatItem,
                  pressed && { backgroundColor: '#1a1a1a' } // overlay color
                ]}
                onPress={() =>
                  navigation.navigate("Chat", { chatId: chat._id })
                }
              >
                <View style={{ width: "17%", justifyContent: "center" }}>
                  <Image
                    style={styles.profileImage}
                    source={{ uri: recipient?.profilePic }}
                  />
                </View>

                <View style={styles.chatDetails}>
                  <View style={styles.nameandtime}>
                    <Text style={styles.chatUserName}>
                      {recipient?.name}
                    </Text>

                    <Text style={styles.chatMessageTime}>
                      {chat.latestMessage &&
                        formatMessageTime(chat.latestMessage.timestamp)}
                    </Text>
                  </View>

                  <Text style={styles.chatMessageText}>
                    {chat.latestMessage
                      ? chat.latestMessage.content.length > 30
                        ? `${chat.latestMessage.content.slice(0, 22)}...`
                        : chat.latestMessage.content
                      : recipient?.phone}
                  </Text>
                </View>
              </Pressable>
            )
          }}
        />
      </View>
      <Pressable style={styles.newChat } onPress={() => navigation.navigate("NewChat")}>
        <Text style={{color: '#fff', fontSize: 17,}}>
          new
        </Text>
      </Pressable>

      <Button
        onPress={handleLogout}
        style={styles.logoutBtn}
        title={isPending ? "Logging out..." : "Logout"}
      />
      <View style={styles.navigationContainer}>
        <View style={{alignItems: 'center', justifyContent: 'center', display: 'flex', width: '75'}}>
          <Text style={styles.navindividualicon}>
            <FontAwesome  name='comment' size={26} color='#fff' />
          </Text>
          <Text style={styles.navindividualtext}>
            chats
          </Text>
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center', display: 'flex', width: '75'}}>
          <Text style={styles.navindividualicon}>
            <FontAwesome  name='comment' size={26} color='#fff' />
          </Text>
          <Text style={styles.navindividualtext}>
            status
          </Text>
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center', display: 'flex', width: '75'}}>
          <Text style={styles.navindividualicon}>
            <FontAwesome  name='comment' size={26} color='#fff' />
          </Text>
          <Text style={styles.navindividualtext}>
            communities
          </Text>
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center', display: 'flex', width: '75'}}>
          <Text style={styles.navindividualicon}>
            <FontAwesome  name='phone' size={26} color='#fff' />
          </Text>
          <Text style={styles.navindividualtext}>
            calls
          </Text>
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingTop: 60,
  },
  title: {
    fontSize: 27,
    marginBottom: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  topSection: {
    display: "flex",
    justifyContent: 'space-between',
    flexDirection: "row",
    paddingHorizontal: 20,
    placeItems: "center",
  },
  searchContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: "#2c2c2c",
    color: "#fff",
    padding: 10,
    borderRadius: 25,
    height: 50,
    fontSize: 17,
    paddingLeft: 40,
  },
  searchIcon: {
    position: "absolute",
    top: 14,
    zIndex: 1,
    left: 23,
  },
  navigationContainer: {
    position: "absolute",
    bottom: 0,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#000000f7',
    height: 80,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    boxShadow: '0px 10px 20px #00000033',
  },
  navindividualtext: {
    color: '#fff',
    marginTop: 7,
    textTransform: 'capitalize',
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginBottom: 5,
    resizeMode: 'contain',
    imageSize: 'cover',
    marginTop: 2,
  },
  fullChatList: {
    overflowY: 'scroll',
    flex: 1,
  },
  chatItem: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#000',
    marginBottom: 13,
    padding: 7,
    paddingVertical: 8,
    justifyItems: 'center',
    height: 68,
    borderRadius: 7,
  },
  nameandtime: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    width: '90%',
  },
  chatUserName: {
    fontSize: 18,
    marginBottom: 0,
    fontWeight: 'bold',
    color: '#ffffffde',
  },
  chatDetails: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 0,
  },
  chatMessageTime: {
    fontSize: 14,
    color: '#9f9f9f',
    marginTop: 3,
  },
  recipientEmail: {
    marginTop: 0,
    fontSize: 15,
    color: '#ffffffde',
  },
  chatMessageText: {
    fontSize: 15,
    color: '#9f9f9f',
  },
  newChat: {
    position: 'absolute',
    bottom: 110,
    right: 20,
    height: 60,
    width: 60,
    borderRadius: 10,
    backgroundColor: '#0d8446',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 10px 20px #00000033',
  },
})
