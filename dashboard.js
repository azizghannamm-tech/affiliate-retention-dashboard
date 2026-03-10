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


const firebaseConfig = {
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_DOMAIN",
projectId: "YOUR_PROJECT",
storageBucket: "YOUR_BUCKET",
messagingSenderId: "YOUR_ID",
appId: "YOUR_APP_ID"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


const agentAvatar = document.getElementById("agentAvatar");
const agentName = document.getElementById("agentName");
const agentEmail = document.getElementById("agentEmail");

const profileBtn = document.getElementById("profileBtn");
const dropdown = document.getElementById("profileDropdown");

const logoutBtn = document.getElementById("logoutBtn");


profileBtn.onclick = () => {

dropdown.classList.toggle("show");

};


logoutBtn.onclick = () => {

signOut(auth);

window.location.href="login.html";

};


onAuthStateChanged(auth, async (user)=>{

if(!user){

window.location.href="login.html";

return;

}

const ref = doc(db,"profiles",user.uid);

const snap = await getDoc(ref);

if(snap.exists()){

const data = snap.data();

agentName.textContent = data.name || "Agent";

agentEmail.textContent = user.email;

if(data.photo){

agentAvatar.src = data.photo;

}else{

agentAvatar.src =
`https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=2e5aac&color=fff`;

}

}

loadAgents();

});


async function loadAgents(){

const grid = document.getElementById("agentGrid");

grid.innerHTML="Loading agents...";

const snapshot = await getDocs(collection(db,"profiles"));

grid.innerHTML="";

snapshot.forEach(docSnap=>{

const data = docSnap.data();

const name = data.name || "Agent";
const role = data.role || "Agent";
const bio = data.bio || "";

const photo =
data.photo ||
`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2e5aac&color=fff`;

const card = document.createElement("div");

card.className="agentCard";

card.innerHTML=`
<img src="${photo}">
<div class="agentName">${name}</div>
<div class="agentRole">${role}</div>
<div class="agentBio">${bio}</div>
`;

grid.appendChild(card);

});

}
