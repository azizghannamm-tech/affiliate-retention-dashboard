import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
apiKey: "YOUR_KEY",
authDomain: "YOUR_DOMAIN",
projectId: "YOUR_PROJECT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const nameInput = document.getElementById("profileName");
const bioInput = document.getElementById("profileBio");
const saveBtn = document.getElementById("saveProfile");

let currentUser;

onAuthStateChanged(auth, async (user) => {

if(user){

currentUser = user;

const ref = doc(db,"profiles",user.uid);
const snap = await getDoc(ref);

if(snap.exists()){

const data = snap.data();

nameInput.value = data.name || "";
bioInput.value = data.bio || "";

}

}

});

saveBtn.onclick = async () => {

await setDoc(doc(db,"profiles",currentUser.uid),{

name:nameInput.value,
bio:bioInput.value

});

alert("Profile Saved");

};
