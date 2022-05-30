import React, { useState, useEffect, createContext, useContext } from "react";
import * as auth from '../services/auth';
import api from "../services/api";
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext({});

// extrai o children em <AuthProdiver> children </AuthProvider>
// no children estarão as rotas definidas por Navigator e Screen 
const AuthProvider = ({ children }) => {
  const [token,setToken] = useState(null);
  const [mail,setMail] = useState('');
  const [loading, setLoading] = useState(true);

  // o useEffect que vai ser disparado assim que o AuthProvider for construído em tela
  useEffect(() => {
    async function loadStorageData() {
      const storagedToken = await SecureStore.getItemAsync('token');
      const storagedMail = await SecureStore.getItemAsync('mail');
      //await new Promise((resolve) => setTimeout(resolve, 1000));
      if (storagedToken && storagedMail) {
        api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
        setMail(storagedMail);
        setToken(storagedToken);
      }
      setLoading(false);
    }

    loadStorageData();
  },[]);

  async function signIn(mail,password) {
    const response = await auth.signIn(mail,password);
    
    if( response.token && response.mail ){
      api.defaults.headers.Authorization = `Bearer ${response.token}`;
      await SecureStore.setItemAsync('token', response.token);
      await SecureStore.setItemAsync('mail', response.mail);
      setToken(response.token);
      setMail(response.mail);
    }
    else{
      return {error: response.error || "Problemas ao executar a operação"};
    }
  }

  async function signOut() {
    api.defaults.headers.Authorization = '';
    setToken(null);
    setMail(null);
    SecureStore.deleteItemAsync('token');
    SecureStore.deleteItemAsync('mail');
  }

  async function userCreate(mail,password) {
    const response = await auth.userCreate(mail,password);
    if( response.token && response.mail ){
      api.defaults.headers.Authorization = `Bearer ${response.token}`;
      await SecureStore.setItemAsync('token', response.token);
      await SecureStore.setItemAsync('mail', response.mail);
      setToken(response.token);
      setMail(response.mail);
    }
    else{
      return {error: response.error || "Problemas ao executar a operação"};
    }
  }

  async function petList() {
   return await auth.petList();
  }

  async function petCreate(name) {
   return await auth.petCreate(name);
  }

  async function petRemove(idpet) {
   return await auth.petRemove(idpet);
  }

  async function paymentList(idpet) {
    return await auth.paymentList(idpet);
  }

  async function paymentRemove(idpayment) {
    return await auth.paymentRemove(idpayment);
  }
  
  async function paymentCreate(value, description, date, idpet) {
    return await auth.paymentCreate(value, description, date, idpet);
  }

  async function medicineList(idpet) {
    return await auth.medicineList(idpet);
  }

  async function medicineRemove(idmedicine) {
    return await auth.medicineRemove(idmedicine);
  }

  async function medicineCreate(idpet, name) {
    return await auth.medicineCreate(idpet, name);
  }

  return (
    <AuthContext.Provider value={{
      signIn, signOut, token,
      mail, loading, 
      userCreate, 
      petList, petCreate, petRemove, 
      paymentList, paymentRemove, paymentCreate,
      medicineList,
      medicineRemove,
      medicineCreate
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthContext, AuthProvider};