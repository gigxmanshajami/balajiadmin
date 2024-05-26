import { View, Text } from 'react-native'
import React from 'react'

type Props = {}

const login = (props: Props) => {
  return (
    <View style={{
      flex: 1,
      padding: 40,
    }}>
      <Text style={{
        color: "#fff",
      }}>login</Text>
    </View>
  )
}

export default login