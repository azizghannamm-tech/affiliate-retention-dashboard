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

/* ------------------ FIREBASE CONFIG ------------------ */

const firebaseConfig = {
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_DOMAIN",
projectId: "YOUR_PROJECT",
storageBucket: "YOUR_BUCKET",
messagingSenderId: "YOUR_ID",
appId: "YOUR_APP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();

/* ------------------ LOGIN ------------------ */

const loginBtn = document.getElementById("googleLogin");

if (loginBtn) {
loginBtn.onclick = async () => {
await signInWithPopup(auth, provider);
};
}

/* ------------------ LOGOUT ------------------ */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
logoutBtn.onclick = () => signOut(auth);
}

/* ------------------ AUTH STATE ------------------ */

onAuthStateChanged(auth, async user => {

if (!user) {
window.location.href = "login.html";
return;
}

document.getElementById("agentName").innerText = user.displayName;
document.getElementById("agentEmail").innerText = user.email;

/* CHECK ACCESS LEVEL */

const q = query(collection(db,"users"), where("email","==",user.email));
const snap = await getDocs(q);

let role = "agent";

snap.forEach(doc=>{
role = doc.data().role;
});

document.getElementById("accessLevel").innerText = role;

/* SHOW ADMIN PANEL */

if(role === "admin"){
document.getElementById("adminPanel").style.display = "block";
}

loadSection("home");

});

/* ------------------ LOAD POSTS ------------------ */

async function loadSection(section){

const content = document.getElementById("contentArea");

content.innerHTML = "Loading...";

const q = query(
collection(db,"posts"),
where("section","==",section),
orderBy("date","desc")
);

const snap = await getDocs(q);

content.innerHTML = "";

snap.forEach(doc=>{

const data = doc.data();

const card = document.createElement("div");

card.className = "postCard";

card.innerHTML = `
<h2>${data.title}</h2>
<div>${data.content}</div>
`;

content.appendChild(card);

});

}

/* ------------------ NAVIGATION ------------------ */

window.openSection = function(section){
loadSection(section);
};

/* ------------------ ADMIN POST ------------------ */

const postBtn = document.getElementById("publishPost");

if(postBtn){

postBtn.onclick = async ()=>{

const title = document.getElementById("postTitle").value;
const section = document.getElementById("postSection").value;
const content = document.getElementById("postContent").value;
const tags = document.getElementById("postTags").value;

await addDoc(collection(db,"posts"),{

title:title,
section:section,
content:content,
tags:tags,
date:serverTimestamp()

});

alert("Post published!");

document.getElementById("postTitle").value="";
document.getElementById("postContent").value="";

};

}
