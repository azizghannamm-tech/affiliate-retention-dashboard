```javascript
// app.js

import { auth, db } from "./firebase.js";

import {

onAuthStateChanged,
signInWithEmailAndPassword,
createUserWithEmailAndPassword,
GoogleAuthProvider,
signInWithPopup,
signOut

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {

doc,
setDoc,
getDoc,
collection,
getDocs,
addDoc,
deleteDoc,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let currentUser;
let isAdmin = false;


/* =========================
PAGE CHECK
========================= */

const currentPage =
window.location.pathname.split("/").pop();


/* =========================
AUTH
========================= */

onAuthStateChanged(auth, async(user)=>{

if(currentPage === "login.html"){

if(user){

window.location.href =
"index.html";

}

return;

}

if(!user){

window.location.href =
"login.html";

return;

}

currentUser = user;


/* LOAD USER */

const userRef =
doc(db,"users",user.uid);

const userSnap =
await getDoc(userRef);

let userData = {};

if(userSnap.exists()){

userData = userSnap.data();

}else{

userData = {

name:"Agent",
email:user.email,
role:"agent",
bio:"",
photo:"",
created:new Date()

};

await setDoc(userRef,userData);

}

isAdmin =
userData.role === "admin";


/* TOP BAR */

const nameEl =
document.getElementById("agentName");

const emailEl =
document.getElementById("agentEmail");

const roleEl =
document.getElementById("accessLevel");

const avatarEl =
document.getElementById("agentAvatar");

if(nameEl)
nameEl.innerText =
userData.name;

if(emailEl)
emailEl.innerText =
user.email;

if(roleEl)
roleEl.innerText =
isAdmin
? "Administrator"
: "Agent";

if(avatarEl){

avatarEl.src =

userData.photo ||

`https://ui-avatars.com/api/?name=${
encodeURIComponent(userData.name)
}&background=2e5aac&color=fff`;

}


/* HIDE ADMIN TOOLS */

if(!isAdmin){

document
.querySelectorAll(".adminOnly")
.forEach(el=>{

el.style.display = "none";

});

}


/* LOAD DATA */

loadPosts();

loadDirectory();

});


/* =========================
LOGIN
========================= */

const loginBtn =
document.getElementById("loginBtn");

if(loginBtn){

loginBtn.onclick = async()=>{

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

try{

await signInWithEmailAndPassword(
auth,
email,
password
);

window.location.href =
"index.html";

}catch(err){

document.getElementById("error")
.innerText = err.message;

}

};

}


/* =========================
SIGNUP
========================= */

const signupBtn =
document.getElementById("signupBtn");

if(signupBtn){

signupBtn.onclick = async()=>{

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

try{

const cred =

await createUserWithEmailAndPassword(
auth,
email,
password
);

await setDoc(
doc(db,"users",cred.user.uid),
{

name:"Agent",
email:email,
role:"agent",
bio:"",
photo:"",
created:new Date()

}
);

window.location.href =
"index.html";

}catch(err){

document.getElementById("error")
.innerText = err.message;

}

};

}


/* =========================
GOOGLE LOGIN
========================= */

const googleBtn =
document.getElementById("googleBtn");

if(googleBtn){

googleBtn.onclick = async()=>{

try{

const provider =
new GoogleAuthProvider();

const result =
await signInWithPopup(
auth,
provider
);

const user =
result.user;

const ref =
doc(db,"users",user.uid);

const snap =
await getDoc(ref);

if(!snap.exists()){

await setDoc(ref,{

name:user.displayName || "Agent",

email:user.email,

role:"agent",

bio:"",

photo:user.photoURL || "",

created:new Date()

});

}

window.location.href =
"index.html";

}catch(err){

document.getElementById("error")
.innerText = err.message;

}

};

}


/* =========================
LOGOUT
========================= */

const logoutBtn =
document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.onclick = async()=>{

await signOut(auth);

window.location.href =
"login.html";

};

}


/* =========================
CREATE POST
========================= */

window.createPost =
async(section)=>{

if(!isAdmin){

alert("Admins only");

return;

}

const title =
document.getElementById(
`${section}-title`
);

const content =
document.getElementById(
`${section}-content`
);

if(!title.value ||
!content.value){

alert("Fill all fields");

return;

}

await addDoc(
collection(db,"posts"),
{

section:section,

title:title.value,

content:content.value,

author:currentUser.email,

created:serverTimestamp()

}
);

title.value = "";
content.value = "";

loadPosts();

};


/* =========================
LOAD POSTS
========================= */

async function loadPosts(){

const snapshot =
await getDocs(
collection(db,"posts")
);

document
.querySelectorAll(".posts")
.forEach(el=>{

el.innerHTML = "";

});

snapshot.forEach((docSnap)=>{

const data =
docSnap.data();

const wrapper =
document.getElementById(
`${data.section}-posts`
);

if(!wrapper) return;

const div =
document.createElement("div");

div.className = "postCard";

div.innerHTML = `

<h3>${data.title}</h3>

<div class="postMeta">
${data.author || ""}
</div>

<p>${data.content}</p>

${
isAdmin
? `
<button
onclick="deletePost('${docSnap.id}')"
>
Delete
</button>
`
: ""
}

`;

wrapper.appendChild(div);

});

}


/* =========================
DELETE POST
========================= */

window.deletePost =
async(id)=>{

if(!isAdmin) return;

await deleteDoc(
doc(db,"posts",id)
);

loadPosts();

};


/* =========================
DIRECTORY
========================= */

async function loadDirectory(){

const grid =
document.getElementById("agentGrid");

if(!grid) return;

const snapshot =
await getDocs(
collection(db,"users")
);

grid.innerHTML = "";

snapshot.forEach((docSnap)=>{

const data =
docSnap.data();

const card =
document.createElement("div");

card.className =
"agentCard";

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
```
