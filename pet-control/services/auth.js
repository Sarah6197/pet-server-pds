import api from './api';

async function signIn(mail, password) {
  try{
    const {data} = await api.post("/user/login", { mail, password });
    return data;
  }
  catch(e){
    return {error: e.message};
  }
}

async function userCreate(mail, password) {
  try{
    const {data} = await api.post("/user/create", { mail, password });
    return data;
  }
  catch(e){
    return {error: e.message};
  }
}

async function petList() {
  try{
    const {data} = await api.get("/pet/list");
    return data;
  }
  catch(e){
    return {error: e.message};
  }
}

async function petCreate(name) {
  try{
    const {data} = await api.post("/pet/create", { name });
    return data;
  }
  catch(e){
    return {error: e.message};
  }
}

async function petRemove(idpet) {
  try{
    const {data} = await api.delete("/pet/remove", { data: {idpet:idpet} });
    return data;
  }
  catch(e){
    return {error: e.message};
  }
}

async function paymentList(idpet) {
  try {
    const { data } = await api.get(`/payment/list?idpet=${idpet}`);
    return data;
  }
  catch (e) {
    return { error: e.message };
  }
}

async function paymentRemove(idpayment) {
  try {
    const { data } = await api.delete(`/payment/remove?idpayment=${idpayment}`);
    return data;
  } catch (e){
    return { error: e.message };
  }
}

async function paymentCreate(value, description, date, idpet) {
  try {
    const { data } = await api.post(`/payment/create`, { value, description, date, idpet});
    return data;
  } catch (e){
    return { error: e.message };
  }
}


async function medicineList(idpet) {
  try {
    const { data } = await api.get(`/medicine/list?idpet=${idpet}`);
    return data;
  }
  catch (e) {
    return { error: e.message };
  }
}

async function medicineRemove(idmedicine) {
  try {
    const { data } = await api.delete(`/medicine/remove?idmedicine=${idmedicine}`);
    return data;
  } catch (e){
    return { error: e.message };
  }
}

async function medicineCreate(idpet, name) {
  try {
    const { data } = await api.post(`/medicine/create`, { idpet, name });
    return data;
  } catch (e){
    return { error: e.message };
  }
}

export {
  signIn,
  userCreate,
  petList,
  petCreate,
  petRemove,
  paymentList,
  paymentRemove,
  paymentCreate,
  medicineCreate,
  medicineList,
  medicineRemove
};