// app.js

import { auth, db } from "./firebase.js";

import {

onAuthStateChanged,
signInWithEmailAndPassword,
createUserWithEmailAndPassword,
GoogleAuthProvider,
signInWithPopup,
signOut

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {

doc,
setDoc,
getDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const currentPage =
window.location.pathname.split("/").pop();


/* AUTH CHECK */

onAuthStateChanged(auth, async (user)=>{

/* LOGIN PAGE */

if(currentPage === "login.html"){

if(user){

window.location.href = "index.html";

}

return;

}


/* PROTECTED PAGES */

if(!user){

window.location.href = "login.html";

return;

}


/* LOAD PROFILE BAR */

const nameEl = document.getElementById("agentName");
const emailEl = document.getElementById("agentEmail");
const roleEl = document.getElementById("accessLevel");
const avatarEl = document.getElementById("agentAvatar");


try{

const profileRef = doc(db,"profiles",user.uid);

const profileSnap = await getDoc(profileRef);

let profileData = {};

if(profileSnap.exists()){

profileData = profileSnap.data();

}else{

await setDoc(profileRef,{

name:user.displayName || "Agent",
email:user.email,
role:"agent",
bio:"",
photo:"",
created:new Date()

});

}

if(nameEl){

nameEl.innerText =
profileData.name ||
user.displayName ||
"Agent";

}

if(emailEl){

emailEl.innerText = user.email;

}

if(roleEl){

roleEl.innerText =
profileData.role ||
"agent";

}

if(avatarEl){

avatarEl.src =
profileData.photo ||
user.photoURL ||
"https://ui-avatars.com/api/?name=Agent&background=2e5aac&color=fff";

}

}catch(err){

console.log(err);

}

});


/* LOGIN */

const loginBtn =
document.getElementById("loginBtn");

if(loginBtn){

loginBtn.onclick = async ()=>{

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

const error =
document.getElementById("error");

try{

await signInWithEmailAndPassword(
auth,
email,
password
);

window.location.href = "index.html";

}catch(err){

error.innerText = err.message;

}

};

}


/* SIGNUP */

const signupBtn =
document.getElementById("signupBtn");

if(signupBtn){

signupBtn.onclick = async ()=>{

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

const error =
document.getElementById("error");

try{

const userCredential =
await createUserWithEmailAndPassword(
auth,
email,
password
);

await setDoc(

doc(db,"profiles",userCredential.user.uid),

{
name:"Agent",
email:email,
role:"agent",
bio:"",
photo:"",
created:new Date()
}

);

window.location.href = "index.html";

}catch(err){

error.innerText = err.message;

}

};

}


/* GOOGLE LOGIN */

const googleBtn =
document.getElementById("googleBtn");

if(googleBtn){

googleBtn.onclick = async ()=>{

try{

const provider =
new GoogleAuthProvider();

const result =
await signInWithPopup(auth,provider);

const user = result.user;

const ref =
doc(db,"profiles",user.uid);

const snap =
await getDoc(ref);

if(!snap.exists()){

await setDoc(ref,{

name:user.displayName || "Agent",
email:user.email,
role:"agent",
bio:"",
photo:user.photoURL || "",
created:new Date()

});

}

window.location.href = "index.html";

}catch(err){

document.getElementById("error").innerText =
err.message;

}

};

}


/* LOGOUT */

const logoutBtn =
document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.onclick = async ()=>{

await signOut(auth);

window.location.href = "login.html";

};

}
