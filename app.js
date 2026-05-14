import {
await setDoc(userRef,{
email:user.email,
role:"agent",
name:user.displayName || "Agent",
photo:user.photoURL || "",
created:new Date()
});

}

const data = (await getDoc(userRef)).data();

if(nameEl) nameEl.innerText = data.name || "Agent";
if(emailEl) emailEl.innerText = user.email;
if(roleEl) roleEl.innerText = data.role || "agent";

if(avatarEl){
avatarEl.src = data.photo || "https://ui-avatars.com/api/?name=Agent";
}

});

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const googleBtn = document.getElementById("googleBtn");

if(loginBtn){

loginBtn.addEventListener("click", async ()=>{

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;
const error = document.getElementById("error");

try{

await signInWithEmailAndPassword(auth,email,password);
window.location.href="index.html";

}catch(err){
error.innerText = err.message;
}

});

}

if(signupBtn){

signupBtn.addEventListener("click", async ()=>{

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;
const error = document.getElementById("error");

try{

const userCredential = await createUserWithEmailAndPassword(auth,email,password);

await setDoc(doc(db,"users",userCredential.user.uid),{
email,
role:"agent",
name:"Agent",
bio:"",
photo:"",
created:new Date()
});

window.location.href="index.html";

}catch(err){
error.innerText = err.message;
}

});

}

if(googleBtn){

googleBtn.addEventListener("click", async ()=>{

try{

const result = await signInWithPopup(auth,googleProvider);
const user = result.user;

const ref = doc(db,"users",user.uid);
const snap = await getDoc(ref);

if(!snap.exists()){

await setDoc(ref,{
email:user.email,
role:"agent",
name:user.displayName || "Agent",
photo:user.photoURL || "",
bio:"",
created:new Date()
});

}

window.location.href="index.html";

}catch(err){

const error = document.getElementById("error");
error.innerText = err.message;

}

});

}
