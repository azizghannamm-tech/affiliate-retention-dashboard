/* =========================
   GLOBAL STORAGE SYSTEM
========================= */

if (!localStorage.getItem("posts")) {
  localStorage.setItem("posts", JSON.stringify([]));
}

/* =========================
   AUTH SYSTEM
========================= */

const USERNAME = "agent";
const PASSWORD = "1234";

function isLoggedIn() {
  return localStorage.getItem("loggedIn") === "true";
}

function login(username, password) {

  if (username === USERNAME && password === PASSWORD) {

    localStorage.setItem("loggedIn", "true");
    window.location.href = "index.html";

  } else {
    alert("Invalid login");
  }

}

function logout() {

  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";

}

/* =========================
   PAGE PROTECTION
========================= */

const page = window.location.pathname.split("/").pop();

if (page === "index.html" || page === "") {

  if (!isLoggedIn()) {
    window.location.href = "login.html";
  }

}

if (page === "login.html") {

  if (isLoggedIn()) {
    window.location.href = "index.html";
  }

}

/* =========================
   POSTS SYSTEM
========================= */

function getPosts() {
  return JSON.parse(localStorage.getItem("posts"));
}

function savePosts(posts) {
  localStorage.setItem("posts", JSON.stringify(posts));
}

function addPost(title, content, tags) {

  const posts = getPosts();

  posts.unshift({
    id: Date.now(),
    title,
    content,
    tags,
    pinned: false,
    date: new Date().toLocaleString()
  });

  savePosts(posts);
}

function deletePost(id) {

  let posts = getPosts();

  posts = posts.filter(p => p.id !== id);

  savePosts(posts);
}

function togglePin(id) {

  const posts = getPosts();

  const post = posts.find(p => p.id === id);

  if (post) post.pinned = !post.pinned;

  savePosts(posts);
}

function editPost(id, newTitle, newContent) {

  const posts = getPosts();

  const post = posts.find(p => p.id === id);

  if (post) {

    post.title = newTitle;
    post.content = newContent;

  }

  savePosts(posts);
}

/* =========================
   SEARCH SYSTEM
========================= */

function searchPosts(query) {

  const posts = getPosts();

  return posts.filter(post =>
    post.title.toLowerCase().includes(query.toLowerCase()) ||
    post.content.toLowerCase().includes(query.toLowerCase())
  );

}

/* =========================
   TAG FILTER
========================= */

function filterByTag(tag) {

  const posts = getPosts();

  return posts.filter(post => post.tags.includes(tag));

}

/* =========================
   ANALYTICS
========================= */

function getAnalytics() {

  const posts = getPosts();

  return {
    totalPosts: posts.length,
    pinnedPosts: posts.filter(p => p.pinned).length,
    tagsUsed: [...new Set(posts.flatMap(p => p.tags))]
  };

}
