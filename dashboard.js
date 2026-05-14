// dashboard.js

import { auth, db } from "./firebase.js";

import {

onAuthStateChanged,
signOut

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {

collection,
getDocs,
addDoc,
deleteDoc,
doc,
getDoc,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let currentUser;
let currentUserRole = "agent";


/* AUTH */

onAuthStateChanged(auth, async (user)=>{

if(!user){

window.location.href = "login.html";

return;

}

currentUser = user;


/* LOAD USER ROLE */

try{

const userRef = doc(db,"users",user.uid);

const userSnap = await getDoc(userRef);

if(userSnap.exists()){

const userData = userSnap.data();

currentUserRole = userData.role || "agent";

window.isAdmin = currentUserRole === "admin";

}else{

window.isAdmin = false;

}

}catch(err){

console.error("Role load error:", err);

window.isAdmin = false;

}


/* LOAD FEATURES */

loadAgentDirectory();

setupPostSystem();


/* LOGOUT */

const logoutBtn =
document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.onclick = async ()=>{

await signOut(auth);

window.location.href = "login.html";

};

}

});


/* DIRECTORY */

async function loadAgentDirectory(){

const grid =
document.getElementById("agentGrid");

if(!grid) return;

grid.innerHTML = "Loading...";

const snapshot =
await getDocs(collection(db,"users"));

grid.innerHTML = "";

snapshot.forEach((docSnap)=>{

const data = docSnap.data();

const card =
document.createElement("div");

card.className = "agentCard";

card.innerHTML = `

<img src="${
data.photo ||
'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.name || "Agent")
}">

<div class="agentName">
${data.name || "Agent"}
</div>

<div class="agentRole">
${data.role || "agent"}
</div>

<div class="agentBio">
${data.bio || ""}
</div>

`;

grid.appendChild(card);

});

}


/* POSTS */

function setupPostSystem(){

document
.querySelectorAll(".postsContainer")
.forEach((container)=>{

const section =
container.dataset.section;

loadPosts(section);

const parent =
container.closest(".tool");

if(!parent) return;


/* POST ELEMENTS */

const title =
parent.querySelector(".postTitle");

const tags =
parent.querySelector(".postTags");

const content =
parent.querySelector(".postContent");

const pinned =
parent.querySelector(".postPinned");

const button =
parent.querySelector(".createPostBtn");

const search =
parent.querySelector(".postSearch");


/* HIDE ADMIN FEATURES */

if(!window.isAdmin){

if(title) title.style.display = "none";

if(tags) tags.style.display = "none";

if(content) content.style.display = "none";

if(pinned)
pinned.parentElement.style.display = "none";

if(button) button.style.display = "none";

const toolbar =
parent.querySelector(".editorToolbar");

if(toolbar)
toolbar.style.display = "none";

}


/* CREATE POST */

if(button){

button.onclick = async ()=>{

if(!window.isAdmin){

alert("Admins only");

return;

}

if(!title.value || !content.innerHTML){

alert("Fill all fields");

return;

}

await addDoc(collection(db,"posts"),{

title:title.value,

content:DOMPurify.sanitize(
content.innerHTML
),

tags:tags.value,

pinned:pinned.checked,

section:section,

author:currentUser.email,

created:serverTimestamp()

});

title.value = "";

tags.value = "";

content.innerHTML = "";

loadPosts(section);

};

}


/* SEARCH */

if(search){

search.oninput = ()=>{

const term =
search.value.toLowerCase();

container
.querySelectorAll(".postCard")
.forEach((card)=>{

card.style.display =
card.innerText
.toLowerCase()
.includes(term)
? "block"
: "none";

});

};

}

});

}


/* LOAD POSTS */

async function loadPosts(section){

const container =
document.querySelector(
`.postsContainer[data-section="${section}"]`
);

if(!container) return;

container.innerHTML = "Loading posts...";

const snapshot =
await getDocs(collection(db,"posts"));

container.innerHTML = "";

snapshot.forEach((docSnap)=>{

const data = docSnap.data();

if(data.section !== section) return;

const card =
document.createElement("div");

card.className = "postCard";

card.innerHTML = `

${data.pinned
? "<div class='pinned'>📌 PINNED</div>"
: ""
}

<h3>${data.title}</h3>

<div class="postMeta">
${data.author || ""}
</div>

<div>
${data.content}
</div>

${
window.isAdmin
? `
<div class="postActions">

<button
class="deletePost"
data-id="${docSnap.id}"
>

Delete

</button>

</div>
`
: ""
}

`;

container.appendChild(card);

});

}


/* DELETE POSTS */

document.addEventListener("click",async(e)=>{

if(e.target.classList.contains("deletePost")){

if(!window.isAdmin){

alert("Admins only");

return;

}

if(!confirm("Delete post?")) return;

await deleteDoc(

doc(db,"posts",e.target.dataset.id)

);

location.reload();

}

});
