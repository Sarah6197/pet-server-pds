import React, {useState, useEffect, useContext} from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, FlatList} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { FAB } from 'react-native-paper';
import styles from './styles';
import { AsyncStorage } from 'react-native';
import {AuthContext} from '../../contexts';

export default function Payment(props){
  const [register,setRegister] = useState(false);
  const [list, setList] = useState([]);
  const [pet, setPet] = useState([]);
  const { petList, paymentList, paymentRemove, paymentCreate } = useContext(AuthContext);

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem("idpet").then(idpet => {
        getPet(idpet);
      });
    }, [])
  );

  const getPet = async (idpet) => {
    const response = await petList();
    setPet(response?.pets?.find(pet => pet.idpet == idpet));
    listPayments(idpet);
  };


  const add = async (description, value) => {
    description = description.trim();
    const date = new Date().getDate() + "/" + (new Date().getMonth()+1) + "/" + new Date().getFullYear();
    const idpayment = list.length+1;
    const response = await paymentCreate(value, description, date, pet?.idpet);
    if (response?.idpayment != null) {
      listPayments(pet?.idpet);
      setRegister(false);
    }
  };

  const remove = async (id) => {
    const response = await paymentRemove(id);
    if (response?.idpayment != null) {
      listPayments(pet?.idpet);
    }
  }

  const listPayments = async (idpet) => {
    const response = await paymentList(idpet);
    setList(response.payments)
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemtext}>
        <Text style={styles.itemname}>{item.description}</Text>
        <Text style={styles.itemname}>R${item.value} - {item.date}</Text>
      </View>
      <TouchableOpacity style={styles.remove} onPress={()=>remove(item.idpayment)}>
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
        list.length > 0 ?
        <ScrollView style={{...styles.scroll, flexGrow:1}}>
          <FlatList
            data={list}
            renderItem={renderItem}
            keyExtractor={item => item.idpayment}
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
        Clique no botão para cadastrar um pagamento
      </Text>
    </View>
  );
}

function Register(props){
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');

  return (
    <View style={styles.registercontainer}>
      <View style={styles.box}>
        <Text style={styles.title}>CADASTRAR GASTO</Text>
        <View style={{marginTop:20}}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={styles.input}
            onChangeText={setDescription}
            value={description}
            autoCapitalize="words"
          />
        </View>
        <View style={{marginTop:20}}>
          <Text style={styles.label}>Valor</Text>
          <TextInput
            style={styles.input}
            onChangeText={setValue}
            value={value}
            keyboardType="decimal-pad"
          />
        </View>
        <View style={styles.boxButton}>
          <TouchableOpacity style={styles.button} onPress={()=>props.add(description,value)}>
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


