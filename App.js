import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  StatusBar,
  TouchableOpacity,
  TextInput,
  FlatList,
  Keyboard
} from 'react-native';
import {
  useState, 
  useEffect, 
  useRef
} from 'react'
import Login from './src/components/login'
import List from "./src/components/List";
import firebase from './src/services/firebase'
import {Feather} from '@expo/vector-icons'
export default function App() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([]) 
  const [newTask, setNewTask] = useState('')
  const inputRef = useState(null)
  const [key, setKey]= useState("")

  useEffect(()=>{
    function getUser() {
      if(!user){
        return
      }
      firebase.database().ref('tarefas').child(user).once('value', (snapshot)=>{
        setTasks([])

        snapshot.forEach((childItem)=>{
          let data = {
            Key: childItem.key,
            nome: childItem.val().nome
          }
          setTasks(tasks => [...tasks, data])
        })

      })
    }

    getUser()

  }, [user])

  const handleDelete = (key)=>{
    firebase.database().ref('tarefas').child(user).child(key).remove()
    .then(()=>{
      const taskFilter = tasks.filter(item => item.Key !== key)
      setTasks(taskFilter)
    })
  }

  const handleEdit = (item)=>{
    setKey(item.Key)
    setNewTask(item.nome)
    inputRef.current.focus()
  }

  const handleAdd = ()=>{
    if(newTask === ''){
      return
    }
    if(key !== ''){
      firebase.database().ref('tarefas').child(user).child(key).update({
        nome: newTask
      })
      .then(()=>{
        
        const taskIndex = tasks.findIndex(item => item.Key === key)
        let taskClone = tasks;
        taskClone[taskIndex].nome = newTask

        setTasks([...taskClone])
        
      })
      Keyboard.dismiss()
      setNewTask("")
      setKey("")
      return
    }
    let tarefas = firebase.database().ref('tarefas').child(user)
    let chave = tarefas.push().key

    tarefas.child(chave).set({
      nome: newTask
    })
    .then(()=>{
      const data = {
        Key: chave,
        nome: newTask
      }
      setTasks(tasks => [...tasks, data])
      setNewTask('')
      Keyboard.dismiss()
    })
  }

  const handleCanceled = ()=>{
    setKey("")
    setNewTask("")
    Keyboard.dismiss()
  }

  if(!user){
    return(
      <Login changeStatus={(user)=> setUser(user)} />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      
      {key.length > 0 && (
        <View style={{flexDirection: 'row', marginLeft: 15, marginTop: 10,}}>
        <TouchableOpacity onPress={handleCanceled}>
          <Feather name="x-circle" size={20} color="#ff0000" />
        </TouchableOpacity>
        <Text style={{marginLeft: 6, color: '#ff0000'}}>você esta editando essa tarefa!</Text>
      </View>
      )}

      <View style={styles.containerHeader}>
      <TextInput 
      placeholder="o que vai fazer hoje?"
      style={styles.input}
      onChangeText={(text)=> setNewTask(text)}
      
      value={newTask}
      ref={inputRef}
      />
      <TouchableOpacity 
      style={styles.AreaBtn}
      onPress={handleAdd}
      >
        <Text style={styles.areaText}>+</Text>
      </TouchableOpacity>
      </View>
      
      <FlatList
      data={tasks}
      KeyExtractor={item => toString(item.Key)}
      renderItem={({item})=>(
          <List 
          item={item} 
          deleteItem={()=>handleDelete(item.Key)}
          editItem={()=>handleEdit(item)}
          />
      )}
      />
      

      <StatusBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6fc',
    marginTop: 10,
    
  },
  containerHeader:{
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'center',
    
  },
  input:{
    marginRight: 10, 
    borderColor: 'black',
    borderWidth: 1,
    width: '75%',
    borderRadius: 10,
    padding: 7,
  },
  AreaBtn:{
    backgroundColor: '#121212',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
  },
  areaText:{
    color: '#fff',
    fontSize: 25,
  }

});
