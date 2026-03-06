import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getAuth,
signInWithEmailAndPassword,
createUserWithEmailAndPassword,
signInWithPopup,
GoogleAuthProvider,
onAuthStateChanged,
signOut
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const firebaseConfig = {

apiKey:"AIzaSyB8dDTnpPQVRAs7dkfc8QU3L5qUJtm-2jg",
authDomain:"affiliate-relations-17687.firebaseapp.com",
projectId:"affiliate-relations-17687",
appId:"1:642027131905:web:5f0076ee7b34578b9f9c00"

};

const app=initializeApp(firebaseConfig);
const auth=getAuth(app);
const provider=new GoogleAuthProvider();


window.login=function(){

const email=document.getElementById("email").value;
const password=document.getElementById("password").value;

signInWithEmailAndPassword(auth,email,password)
.then(()=>{

window.location="index.html";

})
.catch(err=>{

document.getElementById("error").innerText=err.message;

});

};


window.signup=function(){

const email=document.getElementById("email").value;
const password=document.getElementById("password").value;

createUserWithEmailAndPassword(auth,email,password)
.then(()=>{

window.location="index.html";

})
.catch(err=>{

document.getElementById("error").innerText=err.message;

});

};


window.googleLogin=function(){

signInWithPopup(auth,provider)
.then(()=>{

window.location="index.html";

})
.catch(err=>{

document.getElementById("error").innerText=err.message;

});

};


window.logout=function(){

signOut(auth).then(()=>{
window.location="login.html";
});

};


onAuthStateChanged(auth, async (user) => {

if(!user){
window.location.href = "login.html"
return
}

document.getElementById("agentName").innerText = user.displayName || "Agent"
document.getElementById("agentEmail").innerText = user.email

// Avatar
document.getElementById("agentAvatar").src =
user.photoURL || "https://i.imgur.com/6VBx3io.png"

})

});
