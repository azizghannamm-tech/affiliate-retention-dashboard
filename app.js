// ==========================
// FIREBASE IMPORTS
// ==========================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getAuth,
onAuthStateChanged,
signInWithEmailAndPassword,
createUserWithEmailAndPassword,
GoogleAuthProvider,
signInWithPopup,
signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
getFirestore,
doc,
setDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==========================
// FIREBASE CONFIG
// ==========================

const firebaseConfig = {

apiKey: "AIzaSyB8dDTnpPQVRAs7dkfc8QU3L5qUJtm-2jg",
authDomain: "affiliate-relations-17687.firebaseapp.com",
projectId: "affiliate-relations-17687",
storageBucket: "affiliate-relations-17687.appspot.com",
messagingSenderId: "642027131905",
appId: "1:642027131905:web:5f0076ee7b34578b9f9c00"

};


// ==========================
// INITIALIZE FIREBASE
// ==========================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ==========================
// PAGE DETECTION
// ==========================

const currentPage = window.location.pathname.split("/").pop();


// ==========================
// AUTH STATE CHECK
// ==========================

onAuthStateChanged(auth, async (user) => {

if(currentPage === "login.html"){

if(user){
window.location.href = "index.html";
}

return;

}

if(!user){
window.location.href = "login.html";
return;
}


// ==========================
// LOAD USER PROFILE
// ==========================

const nameEl = document.getElementById("agentName");
const emailEl = document.getElementById("agentEmail");
const roleEl = document.getElementById("accessLevel");
const avatarEl = document.getElementById("agentAvatar");

if(nameEl) nameEl.innerText = user.displayName || "Agent";

if(emailEl) emailEl.innerText = user.email;

if(avatarEl){
avatarEl.src = user.photoURL || "https://i.imgur.com/6VBx3io.png";
}


// ==========================
// LOAD ROLE FROM FIRESTORE
// ==========================

try{

const userRef = doc(db,"users",user.uid);
const userSnap = await getDoc(userRef);

if(userSnap.exists()){

const data = userSnap.data();

if(roleEl) roleEl.innerText = data.role || "agent";

}else{

await setDoc(userRef,{
email:user.email,
role:"agent",
created:new Date()
});

if(roleEl) roleEl.innerText = "agent";

}

}catch(err){

console.log("User role error:",err);

}

});


// ==========================
// BUTTON EVENT LISTENERS
// ==========================

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const googleBtn = document.getElementById("googleBtn");
const logoutBtn = document.getElementById("logoutBtn");


// ==========================
// EMAIL LOGIN
// ==========================

if(loginBtn){

loginBtn.addEventListener("click", async () => {

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;
const error = document.getElementById("error");

try{

await signInWithEmailAndPassword(auth,email,password);

window.location.href = "index.html";

}catch(err){

if(error) error.innerText = err.message;

}

});

}


// ==========================
// SIGN UP
// ==========================

if(signupBtn){

signupBtn.addEventListener("click", async () => {

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;
const error = document.getElementById("error");

try{

const userCredential = await createUserWithEmailAndPassword(auth,email,password);

await setDoc(doc(db,"users",userCredential.user.uid),{

email:email,
role:"agent",
created:new Date()

});

window.location.href="index.html";

}catch(err){

if(error) error.innerText = err.message;

}

});

}


// ==========================
// GOOGLE LOGIN
// ==========================

if(googleBtn){

googleBtn.addEventListener("click", async () => {

try{

const provider = new GoogleAuthProvider();

const result = await signInWithPopup(auth,provider);

const user = result.user;

const userRef = doc(db,"users",user.uid);
const snap = await getDoc(userRef);

if(!snap.exists()){

await setDoc(userRef,{
email:user.email,
role:"agent",
created:new Date()
});

}

window.location.href="index.html";

}catch(err){

const error = document.getElementById("error");

if(error) error.innerText = err.message;

}

});

}


// ==========================
// LOGOUT
// ==========================

if(logoutBtn){

logoutBtn.addEventListener("click", async ()=>{

await signOut(auth);

window.location.href="login.html";

});

}
