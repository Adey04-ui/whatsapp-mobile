import React from 'react'
import { View, ActivityIndicator } from 'react-native'

function Loader() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#202020',
      }}
    >
      <ActivityIndicator size="large" color="#0d8446" />
    </View>
  )
}

export default Loader