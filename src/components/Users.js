import React, { useState } from 'react'
import { View, Text, FlatList, StyleSheet, Pressable, Image, ActivityIndicator } from 'react-native'
import useOpenChat from '../hooks/useOpenChat'

function Users({users, isLoading, navigation}) {
  const {mutate: openChat, isPending: loading} = useOpenChat()
  const [openingchat, setOpeningchat] = useState(null)

  const handleOpenChat = (userId) => () => {
    setOpeningchat(userId)
    openChat(userId, {
      onSuccess: (chat) => {
        navigation.navigate("Chat", {chatId: chat._id})
      },
      onError: () => {
        console.log("ERROR opening chat:", err?.response?.data || err.message)
        setOpeningchat(null)
      }
    })
  }
  return (
    <View style={{flex: 1,}}>
      {isLoading && (
        <View style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
          <ActivityIndicator size="large" color="#0d8446" />
        </View>
        )}
        <FlatList 
          data={users}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10, paddingHorizontal: 5, }}
          ListEmptyComponent={
            !isLoading && (
              <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>
                No users found.
              </Text>
            )
          }
          renderItem={({ item: user }) => (
            <Pressable
              style={({ pressed }) => [
                styles.chatItem,
                pressed && { backgroundColor: '#1a1a1a' },
                loading && openingchat === user._id && { opacity: 0.6 }
              ]}
              onPress={handleOpenChat(user._id)}
            >
              <View style={{ width: "17%", justifyContent: "center" }}>
                <Image
                  style={styles.profileImage}
                  source={{ uri: user?.profilePic }}
                />
              </View>

              <View style={styles.chatDetails}>
                <View style={styles.nameandtime}>
                  <Text style={styles.chatUserName}>
                    {user?.name}
                  </Text>
                </View>

                <Text style={styles.chatMessageText}>
                  {user?.phone}
                </Text>
              </View>
              {user._id === openingchat && loading && (
                <View style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 20, top: 28,}}>
                  <ActivityIndicator size="large" color="#0d8446" />
                </View>
              )}
            </Pressable>
          )}
        />
    </View>
  )
}
const styles = StyleSheet.create({
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
    flex: 1,
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
})

export default Users