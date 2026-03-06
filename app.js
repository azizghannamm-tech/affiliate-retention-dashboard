import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
getAuth,
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


// 🔹 YOUR FIREBASE CONFIG
const firebaseConfig = {

apiKey: "AIzaSyB8dDTnpPQVRAs7dkfc8QU3L5qUJtm-2jg",
authDomain: "affiliate-relations-17687.firebaseapp.com",
projectId: "affiliate-relations-17687",
storageBucket: "affiliate-relations-17687.firebasestorage.app",
messagingSenderId: "642027131905",
appId: "1:642027131905:web:5f0076ee7b34578b9f9c00"

};


// 🔹 INITIALIZE FIREBASE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// 🔹 CHECK LOGIN STATE
onAuthStateChanged(auth, (user) => {

if (!user) {

window.location.href = "login.html";
return;

}


// 🔹 LOAD USER INFO
const name = user.displayName || "Agent";
const email = user.email || "";
const avatar = user.photoURL || "https://i.imgur.com/6VBx3io.png";


// 🔹 UPDATE UI
document.getElementById("agentName").innerText = name;
document.getElementById("agentEmail").innerText = email;
document.getElementById("agentAvatar").src = avatar;

});


// 🔹 LOGOUT BUTTON
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

logoutBtn.addEventListener("click", () => {

signOut(auth)
.then(() => {

window.location.href = "login.html";

})
.catch((error) => {

console.error("Logout error:", error);

});

});

}
