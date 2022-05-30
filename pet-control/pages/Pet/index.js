import React, {useState, useEffect, useContext} from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, ActivityIndicator, Alert} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { FAB } from 'react-native-paper';
import styles from './styles';
import {AuthContext} from '../../contexts';
import { AsyncStorage } from 'react-native';


export default function Pet(props){
  const [selected,setSelected] = useState('');
  const [register,setRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signOut, token, petList, petCreate, petRemove } = useContext(AuthContext);
  const [list, setList] = useState([]);

  useEffect(()=>{
    async function list(){
      setLoading(true);
      const response = await petList();
      if( response.pets ){
        setList(response.pets);
        await AsyncStorage.removeItem("idpet");
        if( response.pets.length > 0 )
          setSelected(response.pets[0].idpet)
          await AsyncStorage.setItem("idpet", response.pets[0].idpet);
      }
      setLoading(false);
    }
    list();
  },[]);

  const add = async (name) => {
    name = name.trim();
    if( name ){
      setLoading(true);
      const response = await petCreate(name);
      if( response.idpet ){
        const aux = [...list, response];
        setList(aux);
        setSelected(response.idpet);
        setRegister(false);
      }
      else
        Alert.alert(response.error || "Problemas para cadastrar o pet");
      setLoading(false);
    }
    else
      Alert.alert("Forneça o nome do pet");
  };

  const remove = async (idpet,name) => {
    Alert.alert(
      null,
      `Excluir definitivamente o pet ${name}?`,
      [
        {
          text: "Sim",
          onPress: async () => {
            setLoading(true);
            const response = await petRemove(idpet);
            if( response.idpet ){
              const aux = [...list];
              for(let i = 0; i < aux.length; i++){
                if( aux[i].idpet == idpet ){
                  aux.splice(i,1);
                  setList(aux);
                  if( idpet == selected && aux.length > 0 )  
                    setSelected(aux[0].idpet)
                  break;
                }
              }
            }
            else
              Alert.alert(response.error || "Problemas para cadastrar o pet");
            setLoading(false);
          },
        },
        {
          text: "Não",
        }
      ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <TouchableOpacity style={styles.itemtext} onPress={ async () => {
        setSelected(item.idpet);
        await AsyncStorage.setItem("idpet", item.idpet);
      }}>
        <Text style={[styles.itemname,selected == item.idpet &&{fontWeight:'bold'}]}>{item.name}</Text>
        { selected == item.idpet &&
          <Entypo name="check" color="#555" size={25} style={styles.itemcheck} />
        }
      </TouchableOpacity>
      <TouchableOpacity style={styles.remove} onPress={()=>remove(item.idpet, item.name)}>
        <MaterialCommunityIcons name='delete' color="#555" size={25} />
      </TouchableOpacity>
    </View>
  );

  return (
    loading ? 
    <Loading />
    :
    register ?
    <Register lista={list} setLista={setList} setRegister={setRegister} add={add} />
    :
    <View style={styles.container}>
      {
        list.length > 0 ?
        <ScrollView style={styles.scroll}>
          <FlatList
            data={list}
            renderItem={renderItem}
            keyExtractor={item => item.idpet}
          />
        </ScrollView>
        :
        <Empty />
      }
      <FAB
        style={styles.add}
        small
        color="white"
        icon="plus"
        onPress={() => setRegister(true)}
      />
      <FAB
        style={styles.exit}
        small
        color="white"
        icon="exit-to-app"
        onPress={() => signOut()}
      />
    </View>   
  );
}

function Empty(){
  return (
    <View style={styles.msg}>
      <Text style={styles.msgtext}>
        Clique no botão para cadastrar o seu pet
      </Text>
    </View>
  );
}

function Register(props){
  const [name, setName] = useState('');
  
  return (
    <View style={styles.registercontainer}>
      <View style={styles.box}>
        <Text style={styles.title}>CADASTRAR PET</Text>
        <View style={{marginTop:20}}>
          <Text style={styles.label}>Nome do pet</Text>
          <TextInput
            style={styles.input}
            onChangeText={setName}
            value={name}
            autoCapitalize="words"
          />
        </View>
        <View style={styles.boxButton}>
          <TouchableOpacity style={styles.button} onPress={()=>props.add(name)}>
            <Text style={styles.buttonLabel}>salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={()=>props.setRegister(false)}>
            <Text style={styles.buttonLabel}>voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const Loading = () => (
  <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: '#FFC125'}}>
    <ActivityIndicator size="large" color="#666" />
  </View>
);
