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
getDocs,
addDoc,
updateDoc,
deleteDoc,
serverTimestamp
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

loadAgentDirectory();
detectSectionAndLoadPosts();
loadActivity();

});


// ==========================
// ROLE PERMISSIONS
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
<img src="${photo}">
<h4>${name}</h4>
<div class="agentRole">${role}</div>
<div class="agentBio">${bio}</div>
`;

grid.appendChild(card);

});

container.innerHTML="";
container.appendChild(grid);

}catch(err){

console.error(err);
container.innerHTML="Failed to load agents.";

}

}


// ==========================
// RICH TEXT EDITOR
// ==========================

window.formatText = function(command){

if(command === "createLink"){
const url = prompt("Enter URL");
document.execCommand(command,false,url);
}else{
document.execCommand(command,false,null);
}

}


// ==========================
// CREATE POST
// ==========================

const createBtn = document.getElementById("createPostBtn");

if(createBtn){

createBtn.onclick = async ()=>{

const title = document.getElementById("postTitle").value;
const content = document.getElementById("postContent").innerHTML;
const tags = document.getElementById("postTags").value;
const pinned = document.getElementById("postPinned").checked;

const container = document.getElementById("postsContainer");
const section = container.dataset.section;

if(!title || !content){
alert("Missing fields");
return;
}

await addDoc(collection(db,"posts"),{

title,
content,
tags,
pinned,
section,
author: agentName.textContent,
created: serverTimestamp()

});

logActivity("created post: "+title);

detectSectionAndLoadPosts();

};

}


// ==========================
// LOAD POSTS
// ==========================

async function loadPosts(section){

const container = document.getElementById("postsContainer");
if(!container) return;

container.innerHTML="Loading posts...";

const snapshot = await getDocs(collection(db,"posts"));

container.innerHTML="";

snapshot.forEach(docSnap=>{

const data = docSnap.data();

if(data.section !== section) return;

const card = document.createElement("div");
card.className="postCard";

card.innerHTML=`

${data.pinned ? "<div class='pinned'>📌 PINNED</div>" : ""}

<h3>${data.title}</h3>

<div class="postMeta">
${data.author || ""} • ${data.tags || ""}
</div>

<div class="postContent">
${data.content}
</div>

<div class="postActions">

<button class="editPost" data-id="${docSnap.id}">Edit</button>

<button class="deletePost" data-id="${docSnap.id}">Delete</button>

</div>

`;

container.appendChild(card);

});

if(container.innerHTML===""){
container.innerHTML="No posts yet.";
}

}


// ==========================
// AUTO SECTION DETECT
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
// DELETE POST
// ==========================

document.addEventListener("click",async(e)=>{

if(e.target.classList.contains("deletePost")){

const id = e.target.dataset.id;

if(!confirm("Delete this post?")) return;

await deleteDoc(doc(db,"posts",id));

logActivity("deleted post");

detectSectionAndLoadPosts();

}

});


// ==========================
// EDIT POST
// ==========================

document.addEventListener("click",async(e)=>{

if(e.target.classList.contains("editPost")){

const id = e.target.dataset.id;

const newTitle = prompt("Edit title");
const newContent = prompt("Edit content");

if(!newTitle || !newContent) return;

await updateDoc(doc(db,"posts",id),{

title:newTitle,
content:newContent

});

logActivity("edited post");

detectSectionAndLoadPosts();

}

});


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


// ==========================
// ACTIVITY LOG
// ==========================

async function logActivity(action){

await addDoc(collection(db,"activity"),{

user: agentName.textContent,
action: action,
time: serverTimestamp()

});

}


// ==========================
// LOAD ACTIVITY FEED
// ==========================

async function loadActivity(){

const container = document.getElementById("activityFeed");
if(!container) return;

const snapshot = await getDocs(collection(db,"activity"));

container.innerHTML="";

snapshot.forEach(doc=>{

const data = doc.data();

const item=document.createElement("div");

item.innerHTML=`
<strong>${data.user}</strong> ${data.action}
`;

container.appendChild(item);

});

}
