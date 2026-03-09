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
const agentRole = document.getElementById("agentRole");

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


// ==========================
// ROLE SYSTEM
// ==========================

let userRole = "agent";

try{

const roleRef = doc(db,"users",user.uid);
const roleSnap = await getDoc(roleRef);

if(roleSnap.exists()){
userRole = roleSnap.data().role || "agent";
}

applyRolePermissions(userRole);

if(agentRole){
agentRole.textContent = userRole.toUpperCase();
}

}catch(err){
console.error("Role loading error:",err);
}


// load directory
loadAgentDirectory();

// load posts automatically
detectSectionAndLoadPosts();

});


// ==========================
// ROLE PERMISSIONS FUNCTION
// ==========================

function applyRolePermissions(role){

if(role === "agent"){

document.querySelectorAll(".adminOnly").forEach(el=>{
el.style.display="none";
});

document.querySelectorAll(".managerOnly").forEach(el=>{
el.style.display="none";
});

}

if(role === "manager"){

document.querySelectorAll(".adminOnly").forEach(el=>{
el.style.display="none";
});

}

if(role === "admin"){

// full access

}

}


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
<img src="${photo}" alt="${name}">
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


// ==========================
// LOAD POSTS SYSTEM
// ==========================

async function loadPosts(section){

const container = document.getElementById("postsContainer");

if(!container) return;

container.innerHTML = "Loading posts...";

try{

const snapshot = await getDocs(collection(db,"posts"));

container.innerHTML="";

snapshot.forEach(docSnap=>{

const data = docSnap.data();

if(data.section !== section) return;

const card = document.createElement("div");
card.className="postCard";

card.innerHTML=`

<h3>${data.title}</h3>

<div class="postMeta">
${data.tags || ""}
</div>

<p>${data.content}</p>

`;

container.appendChild(card);

});

if(container.innerHTML===""){
container.innerHTML="No posts yet.";
}

}catch(err){

console.error("Posts loading error:",err);
container.innerHTML="Failed to load posts.";

}

}


// ==========================
// AUTO DETECT TAB SECTION
// ==========================

function detectSectionAndLoadPosts(){

const container = document.getElementById("postsContainer");
if(!container) return;

const section = container.dataset.section;

if(section){
loadPosts(section);
}

}


// ==========================
// SEARCH POSTS
// ==========================

const searchInput = document.getElementById("postSearch");

if(searchInput){

searchInput.oninput = ()=>{

const term = searchInput.value.toLowerCase();

document.querySelectorAll(".postCard").forEach(post=>{

post.style.display =
post.innerText.toLowerCase().includes(term)
? "block"
: "none";

});

};

}
