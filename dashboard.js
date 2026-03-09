// ==========================
// POST SYSTEM SETUP
// ==========================

function setupPostSystem(){

const sections = document.querySelectorAll(".tabContent");

sections.forEach(section=>{

const title = section.querySelector(".postTitle");
const tags = section.querySelector(".postTags");
const content = section.querySelector(".postContent");
const pinned = section.querySelector(".postPinned");
const button = section.querySelector(".createPostBtn");
const container = section.querySelector(".postsContainer");

if(button){

button.onclick = async ()=>{

if(!title.value || !content.innerHTML){
alert("Title and content required");
return;
}

const sectionName = container.dataset.section;

await addDoc(collection(db,"posts"),{

title: title.value,
content: content.innerHTML,
tags: tags.value || "",
pinned: pinned.checked || false,
section: sectionName,
author: agentName.textContent,
authorId: auth.currentUser.uid,
likes: 0,
created: serverTimestamp()

});

title.value="";
tags.value="";
content.innerHTML="";
pinned.checked=false;

loadPosts(sectionName);

};

}

if(container){
loadPosts(container.dataset.section);
}

});

}


// ==========================
// LOAD POSTS
// ==========================

async function loadPosts(section){

const container =
document.querySelector(`.postsContainer[data-section="${section}"]`);

if(!container) return;

container.innerHTML="Loading posts...";

const snapshot = await getDocs(collection(db,"posts"));

let posts=[];

snapshot.forEach(docSnap=>{
posts.push({id:docSnap.id,...docSnap.data()});
});

// PINNED FIRST
posts.sort((a,b)=>(b.pinned===true)-(a.pinned===true));

container.innerHTML="";

posts.forEach(data=>{

if(data.section!==section) return;

const card=document.createElement("div");
card.className="postCard";

const date = data.created?.seconds
? new Date(data.created.seconds*1000).toLocaleDateString()
: "";

const tagsHTML = (data.tags||"")
.split(",")
.map(tag=>`<span class="tag" data-tag="${tag.trim()}">#${tag.trim()}</span>`)
.join("");

card.innerHTML=`

${data.pinned ? "<div class='pinned'>📌 PINNED</div>" : ""}

<h3>${data.title}</h3>

<div class="postMeta">
👤 ${data.author || "Agent"} • 📅 ${date}
</div>

<div class="postTags">
${tagsHTML}
</div>

<div class="postContent collapsed">
${data.content}
</div>

<button class="expandPost">Read more</button>

<div class="postActions">

<button class="likePost" data-id="${data.id}">
👍 ${data.likes || 0}
</button>

<button class="editPost" data-id="${data.id}">
✏️ Edit
</button>

<button class="deletePost" data-id="${data.id}">
🗑 Delete
</button>

</div>

`;

container.appendChild(card);

});

if(container.innerHTML===""){
container.innerHTML="No posts yet.";
}

}


// ==========================
// COLLAPSIBLE POSTS
// ==========================

document.addEventListener("click",e=>{

if(e.target.classList.contains("expandPost")){

const post = e.target.previousElementSibling;

post.classList.toggle("collapsed");

e.target.textContent =
post.classList.contains("collapsed")
? "Read more"
: "Collapse";

}

});


// ==========================
// TAG FILTER
// ==========================

document.addEventListener("click",e=>{

if(e.target.classList.contains("tag")){

const tag=e.target.dataset.tag.toLowerCase();

document.querySelectorAll(".postCard").forEach(post=>{

post.style.display=
post.innerText.toLowerCase().includes(tag)
? "block"
: "none";

});

}

});


// ==========================
// LIKE POST
// ==========================

document.addEventListener("click",async e=>{

if(e.target.classList.contains("likePost")){

const id=e.target.dataset.id;

const ref=doc(db,"posts",id);

const snap=await getDoc(ref);

const likes=(snap.data().likes||0)+1;

await updateDoc(ref,{likes});

document.querySelectorAll(".postsContainer")
.forEach(c=>loadPosts(c.dataset.section));

}

});


// ==========================
// DELETE POST
// ==========================

let deletePostId=null;

document.addEventListener("click",e=>{

if(e.target.classList.contains("deletePost")){

deletePostId=e.target.dataset.id;

document.getElementById("deleteModal").style.display="flex";

}

});

document.getElementById("confirmDelete")?.addEventListener("click",async()=>{

if(!deletePostId) return;

await deleteDoc(doc(db,"posts",deletePostId));

deletePostId=null;

document.getElementById("deleteModal").style.display="none";

document.querySelectorAll(".postsContainer")
.forEach(c=>loadPosts(c.dataset.section));

});

document.getElementById("cancelDelete")?.addEventListener("click",()=>{

deletePostId=null;

document.getElementById("deleteModal").style.display="none";

});


// ==========================
// INLINE EDIT
// ==========================

document.addEventListener("click",e=>{

if(e.target.classList.contains("editPost")){

const card=e.target.closest(".postCard");

const title=card.querySelector("h3");
const content=card.querySelector(".postContent");

title.contentEditable=true;
content.contentEditable=true;

title.focus();

e.target.textContent="Save";
e.target.classList.remove("editPost");
e.target.classList.add("savePost");

}

});


// ==========================
// SAVE EDIT
// ==========================

document.addEventListener("click",async e=>{

if(e.target.classList.contains("savePost")){

const card=e.target.closest(".postCard");

const id=e.target.dataset.id;

const title=card.querySelector("h3").innerText;
const content=card.querySelector(".postContent").innerHTML;

await updateDoc(doc(db,"posts",id),{
title,
content
});

card.querySelector("h3").contentEditable=false;
card.querySelector(".postContent").contentEditable=false;

e.target.textContent="✏️ Edit";
e.target.classList.remove("savePost");
e.target.classList.add("editPost");

}

});
