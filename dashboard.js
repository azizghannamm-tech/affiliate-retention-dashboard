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


/* FIREBASE CONFIG */

const firebaseConfig = {
apiKey: "AIzaSyB8dDTnpPQVRAs7dkfc8QU3L5qUJtm-2jg",
authDomain: "affiliate-relations-17687.firebaseapp.com",
projectId: "affiliate-relations-17687"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


/* HEADER ELEMENTS */

const agentAvatar = document.getElementById("agentAvatar");
const agentName = document.getElementById("agentName");
const agentEmail = document.getElementById("agentEmail");

const profileBtn = document.getElementById("profileBtn");
const dropdown = document.getElementById("profileDropdown");
const logoutBtn = document.getElementById("logoutBtn");


/* PROFILE DROPDOWN */

if(profileBtn){
profileBtn.onclick = () => {
dropdown.classList.toggle("show");
};
}


/* LOGOUT */

if(logoutBtn){
logoutBtn.onclick = () => {
signOut(auth);
window.location.href = "login.html";
};
}


/* AUTH STATE */

onAuthStateChanged(auth, async (user) => {

if(!user){
window.location.href = "login.html";
return;
}


/* LOAD CURRENT USER PROFILE */

const ref = doc(db,"profiles",user.uid);
const snap = await getDoc(ref);

if(snap.exists()){

const data = snap.data();

/* NAME */

if(agentName){
agentName.textContent = data.name || "Agent";
}

/* EMAIL */

if(agentEmail){
agentEmail.textContent = user.email;
}

/* AVATAR */

if(agentAvatar){

if(data.photo){
agentAvatar.src = data.photo;
}
else{

const name = data.name || "Agent";

agentAvatar.src =
`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6b46c1&color=fff`;

}

}

}


/* LOAD DIRECTORY */

loadAgentDirectory();

});



/* ========================= */
/* AGENT DIRECTORY FUNCTION */
/* ========================= */

async function loadAgentDirectory(){

const container = document.getElementById("agentsList");

if(!container) return;

container.innerHTML = "";


/* GET ALL PROFILES */

const querySnapshot = await getDocs(collection(db,"profiles"));


/* BUILD CARDS */

querySnapshot.forEach((docSnap)=>{

const data = docSnap.data();

const name = data.name || "Agent";
const role = data.role || "Agent";
const bio = data.bio || "";

const photo = data.photo ||
`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6b46c1&color=fff`;


/* CREATE CARD */

const card = document.createElement("div");
card.className = "agentCard";

card.innerHTML = `
<img src="${photo}">
<h4>${name}</h4>
<p>${role}</p>
`;


/* OPTIONAL BIO */

if(bio){
const bioText = document.createElement("p");
bioText.style.fontSize = "12px";
bioText.style.opacity = "0.8";
bioText.textContent = bio;

card.appendChild(bioText);
}


container.appendChild(card);

});

}
