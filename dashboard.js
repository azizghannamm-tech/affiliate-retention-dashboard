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
projectId: "affiliate-relations-17687"
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

if(logoutBtn){
logoutBtn.onclick = () => {
signOut(auth);
window.location.href = "login.html";
};
}


// ==========================
// AUTH CHECK
// ==========================

onAuthStateChanged(auth, async (user) => {

if(!user){
window.location.href = "login.html";
return;
}

// load profile
const ref = doc(db,"profiles",user.uid);
const snap = await getDoc(ref);

if(snap.exists()){

const data = snap.data();

if(agentName){
agentName.textContent = data.name || "Agent";
}

if(agentEmail){
agentEmail.textContent = user.email;
}

if(agentAvatar){

if(data.photo){
agentAvatar.src = data.photo;
}else{

const name = data.name || "Agent";

agentAvatar.src =
`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2e5aac&color=fff`;

}

}

}

// load directory
loadAgentDirectory();

});


// ==========================
// AGENT DIRECTORY
// ==========================

async function loadAgentDirectory(){

const container = document.getElementById("agentDirectory");

if(!container) return;

container.innerHTML = "Loading agents...";

try{

const querySnapshot = await getDocs(collection(db,"profiles"));

const grid = document.createElement("div");
grid.className = "agentGrid";

querySnapshot.forEach((docSnap)=>{

const data = docSnap.data();

const name = data.name || "Agent";
const role = data.role || "Agent";
const bio = data.bio || "";

const photo = data.photo ||
`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2e5aac&color=fff`;

const card = document.createElement("div");
card.className = "agentCard";

card.innerHTML = `
<div class="avatarWrapper">
<img src="${photo}" alt="${name}">
<div class="agentStatus"></div>
</div>

<h4>${name}</h4>
<div class="agentRole">${role}</div>
<div class="agentBio">${bio}</div>
`;

grid.appendChild(card);

});

container.innerHTML = "";
container.appendChild(grid);

}catch(error){

console.error("Agent Directory Error:",error);
container.innerHTML = "Failed to load agents.";

}

}
