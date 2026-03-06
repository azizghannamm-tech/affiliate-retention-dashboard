import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getAuth,
GoogleAuthProvider,
signInWithPopup,
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
getFirestore,
collection,
addDoc,
getDocs,
query,
where,
orderBy,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// FIREBASE CONFIG

const firebaseConfig = {

apiKey: "YOUR_API_KEY",
authDomain: "YOUR_DOMAIN",
projectId: "YOUR_PROJECT_ID",
storageBucket: "YOUR_BUCKET",
messagingSenderId: "YOUR_ID",
appId: "YOUR_APP"

};


// INIT

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// AUTH STATE

onAuthStateChanged(auth, async (user)=>{

if(!user){
window.location.href="login.html";
return;
}

document.getElementById("agentEmail").innerText=user.email;

const q=query(
collection(db,"users"),
where("email","==",user.email)
);

const snap=await getDocs(q);

let role="agent";

snap.forEach(doc=>{
role=doc.data().role;
});

document.getElementById("accessLevel").innerText=role;

if(role==="admin"){
document.getElementById("adminPanel").style.display="block";
}

loadSection("home");

});


// SECTION SWITCH

window.openSection=function(section){

document.querySelectorAll(".section").forEach(sec=>{
sec.style.display="none";
});

document.getElementById(section).style.display="block";

loadSection(section);

};


// LOAD POSTS

async function loadSection(section){

const container=document.getElementById(section+"Posts");

container.innerHTML="Loading...";

const q=query(
collection(db,"posts"),
where("section","==",section),
orderBy("date","desc")
);

const snap=await getDocs(q);

container.innerHTML="";

snap.forEach(doc=>{

const data=doc.data();

const card=document.createElement("div");

card.className="postCard";

card.innerHTML=`
<h3>${data.title}</h3>
<p>${data.content}</p>
`;

container.appendChild(card);

});

}


// CREATE POST

const postBtn=document.getElementById("publishPost");

postBtn.onclick=async()=>{

const title=document.getElementById("postTitle").value;

const section=document.getElementById("postSection").value;

const content=document.getElementById("postContent").value;

const tags=document.getElementById("postTags").value;

await addDoc(collection(db,"posts"),{

title:title,
section:section,
content:content,
tags:tags,
date:serverTimestamp()

});

alert("Post published");

document.getElementById("postTitle").value="";
document.getElementById("postContent").value="";
};


// LOGOUT

document.getElementById("logoutBtn").onclick=()=>{
signOut(auth);
};
