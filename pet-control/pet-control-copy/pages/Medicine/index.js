import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, FlatList} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { FAB } from 'react-native-paper';
import styles from './styles';

export default function Medicine(props){
  const [id,setId] = useState('');
  const [register,setRegister] = useState(false);
  const [list, setList] = useState([
    {idmedicine:'1',name:'Vermífugo',date:'03/02/2022'},
    {idmedicine:'2',name:'Alergocort',date:'08/02/2022'},
    {idmedicine:'3',name:'Bravecto',date:'08/02/2022'},
    {idmedicine:'4',name:'Simparic',date:'19/03/2022'},
    {idmedicine:'5',name:'Otolin',date:'03/04/2022'},
    {idmedicine:'6',name:'Giardicid',date:'03/04/2022'},
  ]);

  const add = (name) => {
    name = name.trim();
    const date = new Date().getDate() + "/" + (new Date().getMonth()+1) + "/" + new Date().getFullYear();
    const idmedicine = list.length+1;
    const aux = [...list, {idmedicine,name,date}];
    setList(aux);
    setRegister(false);
  };

  const remove = (id) => {
    const aux = [...list];
    for(let i = 0; i < aux.length; i++){
      if( aux[i].idmedicine == id ){
        aux.splice(i,1);
        setList(aux);
        break;
      }
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemtext}>
        <Text style={styles.itemname}>{item.name}</Text>
        <Text style={styles.itemname}>{item.date}</Text>
      </View>
      <TouchableOpacity style={styles.remove} onPress={()=>remove(item.idmedicine)}>
        <MaterialCommunityIcons name='delete' color="#555" size={25} />
      </TouchableOpacity>
    </View>
  );

  return (
    register ?
    <Register lista={list} setLista={setList} setRegister={setRegister} add={add} />
    :
    <View style={styles.container}>
      <View style={styles.titlebox}>
        <Text style={styles.titletext}>Soneca</Text>
      </View>
      {
        list.length > 0 ?
        <ScrollView style={styles.scroll}>
          <FlatList
            data={list}
            renderItem={renderItem}
            keyExtractor={item => item.idmedicine}
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
    </View>
  );
}

function Empty(){
  return (
    <View style={styles.msg}>
      <Text style={styles.msgtext}>
        Clique no botão para cadastrar um medicamento
      </Text>
    </View>
  );
}

function Register(props){
  const [name, setName] = useState('');

  return (
    <View style={styles.registercontainer}>
      <View style={styles.box}>
        <Text style={styles.title}>CADASTRAR MEDICAMENTO</Text>
        <View style={{marginTop:20}}>
          <Text style={styles.label}>Nome do medicamento</Text>
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


