// ==========================
// FIREBASE IMPORTS
// ==========================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
getAuth,
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
getFirestore,
doc,
getDoc,
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// ==========================
// FIREBASE CONFIG
// ==========================

const firebaseConfig = {
apiKey: "AIzaSyB8dDTnpPQVRAs7dkfc8QU3L5qUJtm-2jg",
authDomain: "affiliate-relations-17687.firebaseapp.com",
projectId: "affiliate-relations-17687",
storageBucket: "affiliate-relations-17687.appspot.com",
messagingSenderId: "000000000000",
appId: "1:000000000:web:000000000000"
};


// ==========================
// INITIALIZE FIREBASE
// ==========================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ==========================
// DOM ELEMENTS
// ==========================

const agentAvatar = document.getElementById("agentAvatar");
const agentName = document.getElementById("agentName");
const agentEmail = document.getElementById("agentEmail");
const agentRole = document.getElementById("accessLevel");

const profileBtn = document.getElementById("profileBtn");
const dropdown = document.getElementById("profileDropdown");
const logoutBtn = document.getElementById("logoutBtn");


// ==========================
// PROFILE MENU
// ==========================

if(profileBtn){

profileBtn.onclick = () => {
dropdown.classList.toggle("show");
};

}


// ==========================
// LOGOUT
// ==========================

if(logoutBtn){

logoutBtn.onclick = () => {

signOut(auth);

window.location.href = "login.html";

};

}


// ==========================
// AUTH CHECK
// ==========================

onAuthStateChanged(auth, async (user)=>{

if(!user){

window.location.href = "login.html";

return;

}

const ref = doc(db,"profiles",user.uid);

const snap = await getDoc(ref);

if(snap.exists()){

const data = snap.data();

agentName.textContent = data.name || "Agent";

agentEmail.textContent = user.email || "";

if(agentAvatar){

if(data.photo){

agentAvatar.src = data.photo;

}else{

agentAvatar.src =
`https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=2e5aac&color=fff`;

}

}

}


// ==========================
// LOAD AGENT DIRECTORY
// ==========================

loadAgentDirectory();

});


// ==========================
// LOAD AGENT DIRECTORY
// ==========================

async function loadAgentDirectory(){

const container = document.getElementById("agentGrid");

if(!container) return;

container.innerHTML = "Loading agents...";

try{

const snapshot = await getDocs(collection(db,"profiles"));

container.innerHTML = "";

snapshot.forEach(docSnap => {

const data = docSnap.data();

const name = data.name || "Agent";

const role = data.role || "Agent";

const bio = data.bio || "";

const photo =
data.photo ||
`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2e5aac&color=fff`;

const card = document.createElement("div");

card.className = "agentCard";

card.innerHTML = `
<img src="${photo}" alt="${name}">
<div class="agentName">${name}</div>
<div class="agentRole">${role}</div>
<div class="agentBio">${bio}</div>
`;

container.appendChild(card);

});

}catch(err){

console.error("Directory error:", err);

container.innerHTML = "Failed to load agents";

}

}
