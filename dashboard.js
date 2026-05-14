import {
const parent = container.closest(".tool");

const title = parent.querySelector(".postTitle");
const tags = parent.querySelector(".postTags");
const content = parent.querySelector(".postContent");
const pinned = parent.querySelector(".postPinned");
const button = parent.querySelector(".createPostBtn");
const search = parent.querySelector(".postSearch");

button.onclick = async ()=>{

if(!title.value || !content.innerHTML){
alert("Fill title and content");
return;
}

await addDoc(collection(db,"posts"),{

title:title.value,
content:DOMPurify.sanitize(content.innerHTML),
tags:tags.value,
pinned:pinned.checked,
section:section,
author:name.textContent,
authorId:currentUser.uid,
created:serverTimestamp()

});

content.innerHTML="";
title.value="";
tags.value="";

loadPosts(section);

};

search.oninput = ()=>{

const term = search.value.toLowerCase();

container.querySelectorAll(".postCard").forEach(post=>{

post.style.display =
post.innerText.toLowerCase().includes(term)
? "block"
: "none";

});

};

});

}

async function loadPosts(section){

const container = document.querySelector(`.postsContainer[data-section="${section}"]`);
if(!container) return;

const q = query(
collection(db,"posts"),
where("section","==",section)
);

const snapshot = await getDocs(q);

container.innerHTML="";

snapshot.forEach(docSnap=>{

const data = docSnap.data();

const card = document.createElement("div");
card.className = "postCard";

card.innerHTML = `

${data.pinned ? "<div class='pinned'>📌 PINNED</div>" : ""}

<h3>${data.title}</h3>

<div class="postMeta">${data.author || ""} • ${data.tags || ""}</div>

<div>${data.content}</div>

${
data.authorId === currentUser.uid || currentUserRole === "admin"
? `
<div class="postActions">
<button class="deletePost" data-id="${docSnap.id}">
Delete
</button>
</div>
`
: ""
}

`;

container.appendChild(card);

});

}

document.addEventListener("click", async (e)=>{

if(e.target.classList.contains("deletePost")){

if(!confirm("Delete post?")) return;

await deleteDoc(doc(db,"posts",e.target.dataset.id));

e.target.closest(".postCard").remove();

}

});
