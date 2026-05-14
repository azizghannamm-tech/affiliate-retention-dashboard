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


/* =========================
AUTH CHECK
========================= */

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


/* LOAD USER INFO */

const nameEl =
document.getElementById("agentName");

const emailEl =
document.getElementById("agentEmail");

const roleEl =
document.getElementById("accessLevel");

const avatarEl =
document.getElementById("agentAvatar");


try{

const userRef =
doc(db,"users",user.uid);

const userSnap =
await getDoc(userRef);

let userData = {};

if(userSnap.exists()){

userData = userSnap.data();

}else{

/* CREATE USER DOC */

userData = {

name:user.displayName || "Agent",
email:user.email,
role:"agent",
bio:"",
photo:"",
created:new Date()

};

await setDoc(userRef,userData);

}


/* LOAD UI */

if(nameEl){

nameEl.innerText =
userData.name || "Agent";

}

if(emailEl){

emailEl.innerText =
user.email;

}

if(roleEl){

roleEl.innerText =
userData.role === "admin"
? "Administrator"
: "Agent";

}

if(avatarEl){

avatarEl.src =

userData.photo ||

user.photoURL ||

`https://ui-avatars.com/api/?name=${
encodeURIComponent(userData.name || "Agent")
}&background=2e5aac&color=fff`;

}

}catch(err){

console.error("User load error:", err);

}

});


/* =========================
LOGIN
========================= */

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

window.location.href =
"index.html";

}catch(err){

if(error){

error.innerText =
err.message;

}

}

};

}


/* =========================
SIGNUP
========================= */

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

doc(db,"users",userCredential.user.uid),

{

name:"Agent",
email:email,
role:"agent",
bio:"",
photo:"",
created:new Date()

}

);

window.location.href =
"index.html";

}catch(err){

if(error){

error.innerText =
err.message;

}

}

};

}


/* =========================
GOOGLE LOGIN
========================= */

const googleBtn =
document.getElementById("googleBtn");

if(googleBtn){

googleBtn.onclick = async ()=>{

try{

const provider =
new GoogleAuthProvider();

const result =

await signInWithPopup(
auth,
provider
);

const user =
result.user;

const userRef =
doc(db,"users",user.uid);

const userSnap =
await getDoc(userRef);

if(!userSnap.exists()){

await setDoc(userRef,{

name:user.displayName || "Agent",

email:user.email,

role:"agent",

bio:"",

photo:user.photoURL || "",

created:new Date()

});

}

window.location.href =
"index.html";

}catch(err){

const error =
document.getElementById("error");

if(error){

error.innerText =
err.message;

}

}

};

}


/* =========================
LOGOUT
========================= */

const logoutBtn =
document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.onclick = async ()=>{

await signOut(auth);

window.location.href =
"login.html";

};

}
