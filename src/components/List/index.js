import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import {FontAwesome } from '@expo/vector-icons'

export default function Index({item, deleteItem, editItem}) {
  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={editItem}>
        <Text style={styles.text}>{item.nome}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={deleteItem}>
      <FontAwesome name="trash" size={25} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#121212',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 5,
    justifyContent: 'space-between',
    
  },
  text:{
    color: '#fff'
  }
})