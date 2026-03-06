import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { 
getAuth,
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
getFirestore,
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


/* FIREBASE CONFIG */

const firebaseConfig = {
apiKey: "AIzaSyB8dDTnpPQVRAs7dkfc8QU3L5qUJtm-2jg",
authDomain: "affiliate-relations-17687.firebaseapp.com",
projectId: "affiliate-relations-17687"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


/* HEADER ELEMENTS (MATCHING YOUR HTML IDS) */

const agentAvatar = document.getElementById("agentAvatar");
const agentName = document.getElementById("agentName");
const agentEmail = document.getElementById("agentEmail");

const profileBtn = document.getElementById("profileBtn");
const dropdown = document.getElementById("profileDropdown");
const logoutBtn = document.getElementById("logoutBtn");


/* PROFILE DROPDOWN */

if(profileBtn){
profileBtn.onclick = () => {
dropdown.classList.toggle("show");
};
}


/* LOGOUT */

if(logoutBtn){
logoutBtn.onclick = () => {
signOut(auth);
window.location.href = "login.html";
};
}


/* AUTH STATE */

onAuthStateChanged(auth, async (user) => {

if(!user){
window.location.href = "login.html";
return;
}


/* LOAD PROFILE FROM FIRESTORE */

const ref = doc(db,"profiles",user.uid);
const snap = await getDoc(ref);

if(snap.exists()){

const data = snap.data();


/* SET NAME */

if(agentName){
agentName.textContent = data.name || "Agent";
}


/* SET EMAIL */

if(agentEmail){
agentEmail.textContent = user.email;
}


/* SET PHOTO */

if(agentAvatar){

if(data.photo){
agentAvatar.src = data.photo;
}
else{

/* fallback avatar */

const name = data.name || "Agent";

agentAvatar.src =
`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6b46c1&color=fff`;

}

}

}

});
