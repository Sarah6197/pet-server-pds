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
  try{
    const {data} = await api.get("/payment/list", {idpet:idpet} );
    return data;
  }
  catch(e){
    return {error: e.message};
  }
}

export {
  signIn,
  userCreate,
  petList,
  petCreate,
  petRemove,
  paymentList
};