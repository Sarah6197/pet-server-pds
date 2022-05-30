import React, {useContext, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, AsyncStorage} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { FAB } from 'react-native-paper';
import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../contexts';

export default function Medicine(props){
  const [register,setRegister] = useState(false);
  const [list, setList] = useState([]);
  const [pet, setPet] = useState([]);
  const { petList, medicineCreate, medicineList, medicineRemove } = useContext(AuthContext);

  useFocusEffect(() => {
    AsyncStorage.getItem("idpet").then(idpet => {
      if (pet?.idpet != idpet) {
        getPet(idpet)
      }
    });
  });

  const getPet = async (idpet) => {
    const response = await petList();
    setPet(response?.pets?.find(pet => pet.idpet == idpet));
    listMedicine(idpet);
  };

  const listMedicine = async (idpet) => {
    const response = await medicineList(idpet);
    if(response != null) {
      console.log(response)
      setList(response.medicines)
    }
    
  };


  const add = async (name) => {
    name = name.trim();
    const date = new Date().getDate() + "/" + (new Date().getMonth()+1) + "/" + new Date().getFullYear();
    const idmedicine = list?.length+1 ?? 0;
    const response = await medicineCreate(pet?.idpet, name);
    if (response?.idmedicine != null) {
      listMedicine(pet?.idpet);
      setRegister(false);
    }
  };

  const remove = async (id) => {
    const response = await medicineRemove(id);
    if (response?.idmedicine != null) {
      listMedicine(pet?.idpet);
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
        <Text style={styles.titletext}>{pet?.name ?? ''}</Text>
      </View>
      {
        list?.length > 0 ?
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


