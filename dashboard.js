import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth,onAuthStateChanged,signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore,doc,getDoc,collection,getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* FIREBASE */

const firebaseConfig = {
apiKey:"AIzaSyB8dDTnpPQVRAs7dkfc8QU3L5qUJtm-2jg",
authDomain:"affiliate-relations-17687.firebaseapp.com",
projectId:"affiliate-relations-17687"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ELEMENTS */

const agentAvatar=document.getElementById("agentAvatar");
const agentName=document.getElementById("agentName");
const agentEmail=document.getElementById("agentEmail");
const agentRole=document.getElementById("accessLevel");

const logoutBtn=document.getElementById("logoutBtn");

/* LOGOUT */

if(logoutBtn){
logoutBtn.onclick=()=>{
signOut(auth);
window.location.href="login.html";
};
}

/* AUTH */

onAuthStateChanged(auth,async(user)=>{

if(!user){
window.location.href="login.html";
return;
}

/* LOAD PROFILE */

const ref=doc(db,"profiles",user.uid);
const snap=await getDoc(ref);

if(snap.exists()){

const data=snap.data();

agentName.textContent=data.name||"Agent";
agentEmail.textContent=user.email;

if(data.photo){
agentAvatar.src=data.photo;
}else{
agentAvatar.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(data.name||"Agent")}&background=2e5aac&color=fff`;
}

}

/* LOAD DIRECTORY */

loadAgentDirectory();

});

/* AGENT DIRECTORY */

async function loadAgentDirectory(){

const grid=document.getElementById("agentGrid");
if(!grid) return;

grid.innerHTML="Loading agents...";

const snapshot=await getDocs(collection(db,"profiles"));

grid.innerHTML="";

snapshot.forEach(docSnap=>{

const data=docSnap.data();

const name=data.name||"Agent";
const bio=data.bio||"";
const role=data.role||"Agent";

const photo=data.photo||
`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2e5aac&color=fff`;

const card=document.createElement("div");
card.className="agentCard";

card.innerHTML=`
<img src="${photo}">
<div class="agentName">${name}</div>
<div class="agentRole">${role}</div>
<div class="agentBio">${bio}</div>
`;

card.onclick=()=>{
window.location.href="profile.html?uid="+docSnap.id;
};

grid.appendChild(card);

});

}
