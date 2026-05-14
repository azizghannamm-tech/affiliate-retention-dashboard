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
serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let currentUser;


/* AUTH */

onAuthStateChanged(auth,(user)=>{

if(!user){

window.location.href = "login.html";

return;

}

currentUser = user;

loadAgentDirectory();

setupPostSystem();

});


/* DIRECTORY */

async function loadAgentDirectory(){

const grid =
document.getElementById("agentGrid");

if(!grid) return;

grid.innerHTML = "Loading...";

const snapshot =
await getDocs(collection(db,"profiles"));

grid.innerHTML = "";

snapshot.forEach((docSnap)=>{

const data = docSnap.data();

const card =
document.createElement("div");

card.className = "agentCard";

card.innerHTML = `

<img src="${
data.photo ||
'https://ui-avatars.com/api/?name=Agent'
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


/* CREATE */

button.onclick = async ()=>{

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


/* SEARCH */

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

<div class="postActions">

<button
class="deletePost"
data-id="${docSnap.id}"
>

Delete

</button>

</div>

`;

container.appendChild(card);

});

}


/* DELETE */

document.addEventListener("click",async(e)=>{

if(e.target.classList.contains("deletePost")){

if(!confirm("Delete post?")) return;

await deleteDoc(

doc(db,"posts",e.target.dataset.id)

);

location.reload();

}

});
