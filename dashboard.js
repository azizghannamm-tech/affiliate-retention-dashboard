import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"

const auth = getAuth()
const db = getFirestore()

// =================
// TABS
// =================

const tabs = [
"home",
"retention",
"updates",
"tools",
"evertrust",
"uw guidelines",
"payments",
"files",
"contacts"
]

const container = document.querySelector(".container")

const tabsDiv = document.createElement("div")
tabsDiv.className = "tabs"

const contentArea = document.createElement("div")

tabs.forEach((name,i)=>{

const tab = document.createElement("div")
tab.className="tab"
tab.innerText=name

const content = document.createElement("div")
content.className="tabContent"
content.innerHTML=`<h3>${name}</h3><p>Content from database will appear here.</p>`

if(i===0){
tab.classList.add("active")
content.classList.add("active")
}

tab.onclick=()=>{

document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"))
document.querySelectorAll(".tabContent").forEach(c=>c.classList.remove("active"))

tab.classList.add("active")
content.classList.add("active")

}

tabsDiv.appendChild(tab)
contentArea.appendChild(content)

})

container.prepend(contentArea)
container.prepend(tabsDiv)


// =================
// PROFILE EDITOR
// =================

const profileBtn = document.getElementById("profileBtn")

const modal = document.createElement("div")
modal.className="profileModal"

modal.innerHTML=`

<div class="profileCard">

<h3>Edit Profile</h3>

<img id="profilePreview" class="profileAvatar">

<input id="profileName" placeholder="Name">

<input id="profilePhoto" placeholder="Photo URL">

<textarea id="profileBio" placeholder="Bio"></textarea>

<button id="saveProfile">Save</button>

</div>

`

document.body.appendChild(modal)

profileBtn.addEventListener("dblclick",()=>{
modal.style.display="flex"
loadProfile()
})


// =================
// LOAD PROFILE
// =================

async function loadProfile(){

const user = auth.currentUser
if(!user) return

const ref = doc(db,"profiles",user.uid)
const snap = await getDoc(ref)

if(snap.exists()){

const data = snap.data()

document.getElementById("profileName").value=data.name||""
document.getElementById("profilePhoto").value=data.photo||""
document.getElementById("profileBio").value=data.bio||""

document.getElementById("profilePreview").src=data.photo||""

}

}


// =================
// SAVE PROFILE
// =================

document.addEventListener("click",async(e)=>{

if(e.target.id==="saveProfile"){

const user = auth.currentUser
if(!user) return

const name=document.getElementById("profileName").value
const photo=document.getElementById("profilePhoto").value
const bio=document.getElementById("profileBio").value

await setDoc(doc(db,"profiles",user.uid),{

name,
photo,
bio

})

modal.style.display="none"

}

})
