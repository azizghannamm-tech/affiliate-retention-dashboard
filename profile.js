import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyB8dDTnpPQVRAs7dkfc8QU3L5qUJtm-2jg",
authDomain: "affiliate-relations-17687.firebaseapp.com",
projectId: "affiliate-relations-17687"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const nameInput = document.getElementById("profileName");
const bioInput = document.getElementById("profileBio");
const saveBtn = document.getElementById("saveProfile");

const avatarUpload = document.getElementById("avatarUpload");
const profileAvatar = document.getElementById("profileAvatar");

let currentUser;
let avatarData = "";

/* LOAD PROFILE */

onAuthStateChanged(auth, async (user) => {

if(user){

currentUser = user;

const ref = doc(db,"profiles",user.uid);
const snap = await getDoc(ref);

if(snap.exists()){

const data = snap.data();

nameInput.value = data.name || "";
bioInput.value = data.bio || "";

if(data.avatar){
profileAvatar.src = data.avatar;
avatarData = data.avatar;
}

}

}

});

/* AVATAR PREVIEW */

avatarUpload.addEventListener("change", function(){

const file = this.files[0];

if(file){

const reader = new FileReader();

reader.onload = function(e){

profileAvatar.src = e.target.result;
avatarData = e.target.result;

}

reader.readAsDataURL(file);

}

});

/* SAVE PROFILE */

saveBtn.onclick = async () => {

await setDoc(doc(db,"profiles",currentUser.uid),{

name: nameInput.value,
bio: bioInput.value,
avatar: avatarData

});

alert("Profile Saved");

};
