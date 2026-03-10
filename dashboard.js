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
deleteDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


/* FIREBASE CONFIG */

const firebaseConfig = {
apiKey: "AIzaSyB8dDTnpPQVRAs7dkfc8QU3L5qUJtm-2jg",
authDomain: "affiliate-relations-17687.firebaseapp.com",
projectId: "affiliate-relations-17687"
};


/* INIT */

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


/* ELEMENTS */

const avatar = document.getElementById("agentAvatar");
const name = document.getElementById("agentName");
const email = document.getElementById("agentEmail");
const role = document.getElementById("accessLevel");

const profileBtn = document.getElementById("profileBtn");
const dropdown = document.getElementById("profileDropdown");
const logoutBtn = document.getElementById("logoutBtn");

let currentUser;


/* AUTH CHECK */

onAuthStateChanged(auth, async (user)=>{

if(!user){
window.location.href="login.html";
return;
}

currentUser=user;


/* LOAD PROFILE */

const ref = doc(db,"profiles",user.uid);
const snap = await getDoc(ref);

if(snap.exists()){

const data = snap.data();

name.textContent = data.name || "Agent";
email.textContent = user.email;

const photo =
data.photo ||
`https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || "Agent")}&background=2e5aac&color=fff`;

avatar.src = photo;

}



/* LOGOUT BUTTON */

if (logoutBtn) {

logoutBtn.onclick = async () => {

try {

await signOut(auth);

window.location.href = "login.html";

} catch (err) {

console.error("Logout failed:", err);
alert("Failed to logout");

}

};

}


/* LOAD FEATURES */

loadAgentDirectory();

/* wait for tabs to render */

setTimeout(()=>{
setupPostSystem();
},200);

});


/* AGENT DIRECTORY */

async function loadAgentDirectory(){

const grid = document.getElementById("agentGrid");
if(!grid) return;

grid.innerHTML="Loading agents...";

const snapshot = await getDocs(collection(db,"profiles"));

grid.innerHTML="";

snapshot.forEach(docSnap=>{

const data = docSnap.data();

const card=document.createElement("div");
card.className="agentCard";

card.innerHTML=`

<img src="${
data.photo ||
`https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || "Agent")}&background=2e5aac&color=fff`
}">

<div class="agentName">${data.name || "Agent"}</div>

<div class="agentRole">${data.role || "Agent"}</div>

<div class="agentBio">${data.bio || ""}</div>

`;

grid.appendChild(card);

});

}


/* POST SYSTEM */

function setupPostSystem(){

document.querySelectorAll(".postsContainer").forEach(container=>{

const section = container.dataset.section;

loadPosts(section);

const parent = container.closest(".tool");

const title = parent.querySelector(".postTitle");
const tags = parent.querySelector(".postTags");
const content = parent.querySelector(".postContent");
const pinned = parent.querySelector(".postPinned");
const button = parent.querySelector(".createPostBtn");
const search = parent.querySelector(".postSearch");


/* CREATE POST */

button.onclick = async ()=>{

if(!title.value || !content.innerHTML){
alert("Fill title and content");
return;
}

await addDoc(collection(db,"posts"),{

title:title.value,
content:content.innerHTML,
tags:tags.value,
pinned:pinned.checked,
section:section,
author:name.textContent,
created:serverTimestamp()

});

title.value="";
tags.value="";
content.innerHTML="";

loadPosts(section);

};


/* SEARCH */

search.oninput = ()=>{

const term = search.value.toLowerCase();

container.querySelectorAll(".postCard").forEach(post=>{

post.style.display =
post.innerText.toLowerCase().includes(term)
? "block"
: "none";

});

};

});

}


/* LOAD POSTS */

async function loadPosts(section){

const container=document.querySelector(`.postsContainer[data-section="${section}"]`);
if(!container) return;

const snapshot=await getDocs(collection(db,"posts"));

container.innerHTML="";

snapshot.forEach(docSnap=>{

const data=docSnap.data();

if(data.section!==section) return;

const card=document.createElement("div");
card.className="postCard";

card.innerHTML=`

${data.pinned ? "<div class='pinned'>📌 PINNED</div>" : ""}

<h3>${data.title}</h3>

<div class="postMeta">${data.author || ""} • ${data.tags || ""}</div>

<div>${data.content}</div>

<div class="postActions">
<button class="deletePost" data-id="${docSnap.id}">
Delete
</button>
</div>

`;

container.appendChild(card);

});

}


/* DELETE POST */

document.addEventListener("click",async(e)=>{

if(e.target.classList.contains("deletePost")){

if(!confirm("Delete post?")) return;

await deleteDoc(doc(db,"posts",e.target.dataset.id));

location.reload();

}

});
