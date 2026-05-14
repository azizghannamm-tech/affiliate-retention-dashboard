import {
auth,
db
} from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
doc,
getDoc,
setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const nameInput = document.getElementById("profileName");
const bioInput = document.getElementById("profileBio");
const avatarUpload = document.getElementById("avatarUpload");
const profileAvatar = document.getElementById("profileAvatar");
const saveBtn = document.getElementById("saveProfile");

let currentUser;
let avatarBase64 = "";

const params = new URLSearchParams(window.location.search);
const profileId = params.get("uid");

onAuthStateChanged(auth, async (user)=>{

if(!user){
window.location.href="login.html";
return;
}

currentUser = user;

const uid = profileId || user.uid;

const ref = doc(db,"users",uid);
const snap = await getDoc(ref);

if(snap.exists()){

const data = snap.data();

nameInput.value = data.name || "";
bioInput.value = data.bio || "";

if(data.photo){
profileAvatar.src = data.photo;
avatarBase64 = data.photo;
}

}

if(profileId && profileId !== user.uid){

nameInput.disabled = true;
bioInput.disabled = true;
avatarUpload.style.display = "none";
saveBtn.style.display = "none";

}

});

avatarUpload.addEventListener("change",function(){

const file = this.files[0];
if(!file) return;

const reader = new FileReader();

reader.onload = function(e){

avatarBase64 = e.target.result;
profileAvatar.src = avatarBase64;

};

reader.readAsDataURL(file);

});

saveBtn.onclick = async ()=>{

await setDoc(doc(db,"users",currentUser.uid),{

name:nameInput.value,
bio:bioInput.value,
photo:avatarBase64

},{merge:true});

alert("Profile saved successfully");

};
