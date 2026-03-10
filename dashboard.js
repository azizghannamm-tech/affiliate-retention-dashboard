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


const firebaseConfig = {
apiKey: "AIzaSyB8dDTnpPQVRAs7dkfc8QU3L5qUJtm-2jg",
authDomain: "affiliate-relations-17687.firebaseapp.com",
projectId: "affiliate-relations-17687"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


/* AUTH */

onAuthStateChanged(auth, async (user)=>{

if(!user){
window.location.href="login.html"
return
}

loadAgentDirectory()
setupPostSystem()

})


/* AGENT DIRECTORY */

async function loadAgentDirectory(){

const container=document.getElementById("agentGrid")
if(!container) return

container.innerHTML="Loading..."

const snapshot=await getDocs(collection(db,"profiles"))

container.innerHTML=""

snapshot.forEach(docSnap=>{

const data=docSnap.data()

const card=document.createElement("div")
card.className="agentCard"

card.innerHTML=`

<img src="${data.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || "Agent")}` }">

<div class="agentName">${data.name || "Agent"}</div>

<div class="agentRole">${data.role || "Agent"}</div>

<div class="agentBio">${data.bio || ""}</div>

`

container.appendChild(card)

})

}


/* POSTS */

function setupPostSystem(){

document.querySelectorAll(".tabContent").forEach(section=>{

const title=section.querySelector(".postTitle")
const content=section.querySelector(".postContent")
const tags=section.querySelector(".postTags")
const pinned=section.querySelector(".postPinned")
const button=section.querySelector(".createPostBtn")
const container=section.querySelector(".postsContainer")

if(!container) return

const sectionName=container.dataset.section

loadPosts(sectionName)

button.onclick=async()=>{

await addDoc(collection(db,"posts"),{

title:title.value,
content:content.innerHTML,
tags:tags.value,
pinned:pinned.checked,
section:sectionName,
created:serverTimestamp()

})

title.value=""
tags.value=""
content.innerHTML=""

loadPosts(sectionName)

}

})

}


/* LOAD POSTS */

async function loadPosts(section){

const container=document.querySelector(`.postsContainer[data-section="${section}"]`)
if(!container) return

const snapshot=await getDocs(collection(db,"posts"))

container.innerHTML=""

snapshot.forEach(docSnap=>{

const data=docSnap.data()

if(data.section!==section) return

const card=document.createElement("div")
card.className="postCard"

card.innerHTML=`

${data.pinned ? "<div class='pinned'>📌 PINNED</div>" : ""}

<h3>${data.title}</h3>

<div class="postMeta">${data.tags || ""}</div>

<div>${data.content}</div>

<button class="deletePost" data-id="${docSnap.id}">Delete</button>

`

container.appendChild(card)

})

}


/* DELETE */

document.addEventListener("click",async(e)=>{

if(e.target.classList.contains("deletePost")){

await deleteDoc(doc(db,"posts",e.target.dataset.id))

location.reload()

}

})
