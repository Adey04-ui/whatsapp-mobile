import React, { useEffect, useRef, useState } from "react"
import { View, Text, Button, StyleSheet, Pressable, Image, ActivityIndicator, TextInput, Platform, TouchableWithoutFeedback, Keyboard, FlatList } from "react-native"
import useMarkMessagesRead from "../hooks/useMarkMessagesRead"
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { getSocket } from "../socket/socket"
import { useQueryClient } from "@tanstack/react-query"
import useGetMessages from "../hooks/useGetMessages"
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { KeyboardAvoidingView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useSendMessage } from "../hooks/useSendMessage"

function formatDate(dateString) {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  if (
    date.toDateString() === today.toDateString()
  ) return "Today"
  if (
    date.toDateString() === yesterday.toDateString()
  ) return "Yesterday"
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: today.getFullYear() === date.getFullYear() ? undefined : "numeric",
  })
}

function formatTime(dateString) {
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false, })
}

function groupMessagesByDate(messages) {
  return messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toDateString()
    if (!groups[date]) groups[date] = []
    groups[date].push(message)
    return groups
  }, {})
}

export default function ChatScreen({ route, navigation, user }) {
  const { chat } = route.params
  const chatId = chat._id
  const queryClient = useQueryClient()

  const [content, setContent] = useState('')

  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const flatListRef = useRef(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  const s = getSocket()
  if (!s) return

  useEffect(() => {
    const show = Platform.OS === 'ios'
      ? Keyboard.addListener('keyboardWillShow', () => setKeyboardVisible(true))
      : Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true))

    const hide = Platform.OS === 'ios'
      ? Keyboard.addListener('keyboardWillHide', () => setKeyboardVisible(false))
      : Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false))

    return () => {
      show.remove()
      hide.remove()
    }
  }, [])

  const chats = queryClient
    .getQueryData(["getChats"])
    ?.find(c => c._id === chat._id)


  useMarkMessagesRead(chats._id, user)
  const recipient = chats.users.find(
    (u) => u._id !== user._id
  )

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMessages(chats._id)

  const { mutate: sendMessage } = useSendMessage()


  const allMessages = React.useMemo(() => {
    const msgs = data?.pages.flatMap(page => page.messages) || []
    return msgs
  }, [data])


  const prevAllMessagesRef = useRef([])

  useEffect(() => {
    if (!flatListRef.current || allMessages.length === 0) return

    const timer = setTimeout(() => {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true }) // 0 = bottom in inverted
    }, 150)

    return () => clearTimeout(timer)
  }, [allMessages, keyboardVisible])

  // Pagination: load older when near top (in inverted = end of list)
  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  const prevMessagesLengthRef = useRef(allMessages.length)

  useEffect(() => {

    const userId = user._id
    const handleUserStatusChange = ({ userId, isOnline, lastSeen }) => {
      if (userId !== recipient._id) return

      queryClient.setQueryData(["getChats"], (oldData) => {
        if (!oldData) return oldData

        return oldData.map((chats) => ({
          ...chats,
          users: chats.users.map((u) =>
            u._id === recipient._id ? { ...u, isOnline, lastSeen } : u
          ),
        }))
      })
    }

    s.on("userStatusChanged", handleUserStatusChange)
    return () => s.off("userStatusChanged", handleUserStatusChange)
  }, [queryClient, recipient._id])


  useEffect(() => {
    const handleMessageReceived = (message) => {
      const incomingChatId =
        message?.chatId?._id || message?.chat?._id || message?.chatId
      const isCurrentChat = incomingChatId === chatId

      if (isCurrentChat) {
        queryClient.setQueryData(["messages", chatId], (oldData) => {
          if (!oldData) return { pages: [{ messages: [message] }] }
          const updated = {
            ...oldData,
            pages: oldData.pages.map((p, i) =>
              i === oldData.pages.length - 1
                ? { ...p, messages: [message, ...p.messages] }
                : p
            ),
          }
          return updated
        })
      } else {
        if (document.hidden || !isCurrentChat) {
          showChatNotification(message)
        }
      }
      queryClient.invalidateQueries(["getChats"], { refetchType: "active" })
    }

    s.on("messageReceived", handleMessageReceived)
    return () => s.off("messageReceived", handleMessageReceived)
  }, [chatId])


  function handleSendMessage() {
    if (!content.trim()) return toast.error("Message cannot be empty")

    const tempId = `temp-${Date.now()}`
    const tempMessage = {
      _id: tempId,
      chatId,
      content,
      sender: user,
      timestamp: new Date().toISOString(),
      readBy: [],
      deliveredTo: [],
      status: "sending",
    }

    queryClient.setQueryData(["messages", chatId], (oldData) => {
      if (!oldData) return { pages: [{ messages: [tempMessage] }] }
      const updated = {
        ...oldData,
        pages: oldData.pages.map((p, i) =>
          i === oldData.pages.length - 1
            ? { ...p, messages: [tempMessage, ...p.messages] }
            : p
        ),
      }
      return updated
    })

    queryClient.setQueryData(["getChats"], (oldChats) => {
      if (!oldChats) return oldChats

      return oldChats.map((chat) => {
        if (chat._id === chatId) {
          return {
            ...chat,
            latestMessage: {
              content: content,
              sender: user?._id,
              timestamp: new Date().toISOString(),
              status: "sending",
            },
            latestMessageAt: new Date().toISOString(),
          }
        }
        return chat
      })
    })

    setContent("")

    sendMessage({ chatId, content, recipient }, {
      onSuccess: (newMessage) => {
        queryClient.setQueryData(["messages", chatId], (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              messages: page.messages.map((msg) =>
                msg._id === tempId ? { ...newMessage, status: "sent" } : msg
              ),
            })),
          }
        })

        s.emit("messageReceived", newMessage)
      },
      onError: () => {
        queryClient.setQueryData(["messages", chatId], (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              messages: page.messages.map((msg) =>
                msg._id === tempId ? { ...msg, status: "failed" } : msg
              ),
            })),
          }
        })

        queryClient.setQueryData(["getChats"], (oldChats) => {
          if (!oldChats) return oldChats

          return oldChats.map((chat) => {
            if (chat._id === chatId) {
              return {
                ...chat,
                latestMessage: {
                  content: content,
                  sender: user,
                  timestamp: new Date().toISOString(),
                  status: "failed",
                },
                latestMessageAt: new Date().toISOString(),
              }
            }
            return chat
          })
        })
      }
    })
  }

  useEffect(() => {
    const handleMessageDelivered = ({ messageId, deliveredTo }) => {
      queryClient.invalidateQueries(["getChats"], { refetchType: "active" })
      queryClient.setQueryData(["messages", chatId], (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            messages: page.messages.map((msg) =>
              msg._id === messageId
                ? { ...msg, deliveredTo, status: "delivered" }
                : msg
            ),
          })),
        }
      })
    }

    const handleMessagesRead = ({ chatId, userId }) => {
      queryClient.invalidateQueries(["getChats"], { refetchType: "active" })
      queryClient.setQueryData(["messages", chatId], (oldData) => {
        if (!oldData) return oldData
        const updated = {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            messages: page.messages.map((m) => {
              const mChatId = m.chatId?._id || m.chatId
              if (!mChatId) return m
              if (mChatId.toString() !== chatId.toString()) return m

              const readBy = m.readBy || []
              if (!readBy.some(id => id.toString() === userId.toString())) {
                return { ...m, readBy: [...readBy, userId], status: 'read' }
              }
              return m
            }),
          })),
        }
        return updated
      })

    }

    s.on("messageDelivered", handleMessageDelivered)
    s.on("messagesRead", handleMessagesRead)
    return () => {
      s.off("messageDelivered", handleMessageDelivered)
      s.off("messagesRead", handleMessagesRead)
    }
  }, [chatId, queryClient])


  const groupedMessages = groupMessagesByDate(allMessages)

  const flatData = React.useMemo(() => {
    const items = []

    const dateKeys = Object.keys(groupedMessages)

    dateKeys.forEach((dateKey) => {
      groupedMessages[dateKey].forEach((msg) => {
        items.push({
          type: "message",
          ...msg
        })
      })

      items.push({
        type: "date",
        id: `date-${dateKey}`,
        date: groupedMessages[dateKey][0].timestamp
      })
    })

    return items
  }, [groupedMessages])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : (keyboardVisible ? 'height' : undefined)}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <View style={styles.container}>
          <View style={styles.recipientHeader}>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 3, alignItems: "center", }}>
              <Pressable style={styles.goback} onPress={() => navigation.goBack()}>
                <FontAwesome name="angle-left" size={34} color="#fff" />
              </Pressable>
              <View style={{ width: "17%", justifyContent: "center", marginRight: 7, }}>
                <Image
                  style={styles.profileImage}
                  source={{ uri: recipient?.profilePic }}
                />
              </View>
              <View>
                <Text style={{ color: '#fff', fontSize: 20, }}>
                  {recipient.name}
                </Text>
                {recipient.isOnline ? (
                  <Text style={{ color: '#0d8446', fontSize: 17 }}>
                    Online
                  </Text>
                ) : (
                  <Text style={{ color: '#fff' }}>
                    Last seen {" "}
                    {recipient?.lastSeen ? (
                      (() => {
                        const lastSeenDate = new Date(recipient.lastSeen)
                        const today = new Date()
                        const yesterday = new Date()
                        yesterday.setDate(today.getDate() - 1)

                        if (lastSeenDate.toDateString() === today.toDateString()) {
                          return formatTime(recipient.lastSeen)
                        } else if (lastSeenDate.toDateString() === yesterday.toDateString()) {
                          return `Yesterday at ${formatTime(recipient.lastSeen)}`
                        } else {
                          return `${formatDate(recipient.lastSeen)} at ${formatTime(recipient.lastSeen)}`
                        }
                      })()
                    ) : (
                      "Recently"
                    )}
                  </Text>
                )}
              </View>
            </View>
            <Text>
              <MaterialCommunityIcons name="dots-vertical" size={26} color="#fff" />
            </Text>
          </View>
          <View style={{ flex: 1, }}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#0d8446" style={{ marginTop: 20, flex: 1 }} />
            ) : (
              <FlatList
                ref={flatListRef}
                inverted={true}
                data={flatData}
                style={{ flex: 1 }}
                keyExtractor={(item) =>
                  item.type === "date" ? item.id : item._id
                }
                contentContainerStyle={{ padding: 10 }}
                keyboardShouldPersistTaps="handled"
                onScroll={(e) => {
                  const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent
                  const scrollY = contentOffset.y
                  const totalHeight = contentSize.height
                  const viewportHeight = layoutMeasurement.height
                  const distanceFromBottom = scrollY
                  contentSize.height - contentOffset.y - layoutMeasurement.height
                  setShowScrollButton(distanceFromBottom > 150)
                }}
                scrollEventThrottle={16}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.3}
                ListFooterComponent={
                  isFetchingNextPage ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                      <ActivityIndicator size="small" color="#0d8446" />
                      <Text style={{ color: '#aaa', marginTop: 8 }}>Loading older messages...</Text>
                    </View>
                  ) : null
                }
                renderItem={({ item }) => {
                  if (item.type === "date") {
                    return (
                      <Text
                        style={{
                          color: '#fff',
                          alignSelf: 'center',
                          marginVertical: 10,
                          fontSize: 16,
                          paddingHorizontal: 15,
                          paddingVertical: 7,
                          borderRadius: 5,
                          backgroundColor: '#202020'
                        }}
                      >
                        {formatDate(item.date)}
                      </Text>
                    )
                  }

                  const isMine = item.sender._id === user._id

                  return (
                    <View style={isMine ? styles.messageContainerSent : styles.messageContainerReceived}>
                      <View>
                        <Text style={{ color: '#fff', fontSize: 17, marginRight: 50 }}>
                          {item.content}
                        </Text>
                      </View>

                      <View style={{ alignSelf: 'flex-end', marginTop: -10, position: 'relative' }}>
                        <Text style={{ color: '#fff', fontSize: 12 }}>
                          {formatTime(item.timestamp)}
                          {' '}
                          {isMine && item.status === "sending" && (
                            <Feather name="clock" size={14} color="#fff" style={{ marginLeft: 4 }} />
                          )}

                          {isMine && item.status === "sent" && (
                            <Feather name="check" size={14} color="#fff" style={{ marginLeft: 4 }} />
                          )}

                          {isMine && item.status === "delivered" && (
                            <MaterialCommunityIcons name="check-all" size={16} color="#fff" style={{ marginLeft: 4 }} />
                          )}

                          {isMine && item.status === "read" && (
                            <MaterialCommunityIcons name="check-all" size={16} color="#34B7F1" style={{ marginLeft: 4 }} />
                          )}

                          {isMine && item.status === "failed" && (
                            <Feather name="alert-circle" size={14} color="red" style={{ marginLeft: 4 }} />
                          )}
                        </Text>
                      </View>
                    </View>
                  )
                }}
              />
            )}

            {showScrollButton && (
              <Pressable
                onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
                style={{
                  position: 'absolute',
                  bottom: 90,
                  right: 20,
                  backgroundColor: '#343434',
                  padding: 6,
                  borderRadius: 30,
                  elevation: 5,
                }}
              >
                <Feather name="chevron-down" size={16} color="#fff" />
              </Pressable>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                placeholder='Type a message ...'
                style={styles.input}
                value={content}
                placeholderTextColor={'#9f9f9f'}
                onChangeText={setContent}
                autoCapitalize='none'
                cursorColor="#0d8446"
                multiline
              />
              <Pressable style={styles.sendButton} onPress={handleSendMessage}>
                <Feather name="send" size={20} color="#fff" />
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 22,
    color: '#fff',
  },
  recipientHeader: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingRight: 20,
    justifyContent: 'space-between',
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomColor: '#292929',
    borderBottomWidth: 1,
  },
  goback: {
    color: '#fff',
    paddingHorizontal: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginBottom: 5,
    resizeMode: 'contain',
    imageSize: 'cover',
    marginTop: 2,
  },
  messageContainerSent: {
    alignSelf: 'flex-end',
    padding: 10,
    border: 'solid',
    backgroundColor: '#0d8446',
    minWidth: 110,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 10,
    maxWidth: '80%',
  },
  messageContainerReceived: {
    alignSelf: 'flex-start',
    padding: 10,
    border: 'solid',
    backgroundColor: '#202020',
    minWidth: 90,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 10,
    maxWidth: '80%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 8,
    backgroundColor: '#000',
  },
  input: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    color: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    fontSize: 16,
    maxHeight: 120,
  },
  sendButton: {
    marginLeft: 6,
    backgroundColor: '#0d8446',
    padding: 14,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    transform: 'rotate(42deg)',
  },
})