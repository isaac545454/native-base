import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  SafeAreaView,
  TouchableOpacity
} from 'react-native'
import firebase from "../../services/firebase";
import React, {useState, useEffect} from 'react'

export default function Index({changeStatus}) {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [type, setType] = useState("login")

  const handleLogin = ()=>{
    if(type === 'login'){
     const user = firebase.auth().signInWithEmailAndPassword(email, senha)
     .then((user)=>{
      changeStatus(user.user.uid)
      return
     })
     .catch((err)=>{
      console.log(err)
      alert('Email ou senha incorreto')
      return
     })
    
    }else{

    const user = firebase.auth().createUserWithEmailAndPassword(email, senha)
    .then((user)=>{
      changeStatus(user.user.uid)
      return
    })
    .catch((err)=>{
      console.log(err)
      alert('erro 2')
      return
     })

    }
  }
  return (
    <SafeAreaView style={styles.containerLogin}>
      <Text style={styles.login}>{type === 'login'? 'Login' : 'Criar Conta'}</Text>
      <TextInput 
      placeholder="E-mail" 
      style={styles.input}
      value={email }
      onChangeText={(text)=> setEmail(text)}
      />
      <TextInput 
      placeholder='senha' 
      style={styles.input}
      value={senha}
      onChangeText={(text)=> setSenha(text)}
      secureTextEntry={true} 
      />
      <TouchableOpacity 
      style={[styles.AreaBtn, {backgroundColor: type === 'login'? '#3ea6f2' : "#141414"}]} 
      onPress={handleLogin}>
        <Text style={styles.TextBtn}>{type === 'login'? 'Acessar': 'Cadastrar'}</Text>
      </TouchableOpacity>
     
      <TouchableOpacity onPress={()=>setType(type => type === 'login'? 'cadastrar': 'login')} >
        <Text style={{textAlign: 'center'}}>
          {type === 'login'? "criar uma conta" 
           :
         "ja possuo uma conta"}
         </Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  containerLogin:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f6fc',
  },
  login:{
   fontWeight: 'bold',
   fontSize: 25,
   marginBottom: 20,
  },
  input: {
    width: "90%",
    margin: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: '#141414'
  },
  AreaBtn:{
    width: "90%",
    padding: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextBtn:{
    color: '#fff',
    fontSize: 18,
  }

})