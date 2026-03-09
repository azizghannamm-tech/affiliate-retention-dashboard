// app.js
// Import Firebase modules (make sure firebase is initialized in firebase.js)
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

import { app } from "./firebase.js"; // your firebase config/initialization file

const auth = getAuth(app);

// ---------------- LOGIN PAGE LOGIC ----------------
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const googleBtn = document.getElementById("googleBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "index.html";
    } catch (err) {
      document.getElementById("error").textContent = err.message;
    }
  });
}

if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      window.location.href = "index.html";
    } catch (err) {
      document.getElementById("error").textContent = err.message;
    }
  });
}

// ---------------- DASHBOARD PAGE LOGIC ----------------
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
}

// ---------------- AUTH STATE REDIRECT ----------------
onAuthStateChanged(auth, user => {
  const path = window.location.pathname;

  if (!user && path.endsWith("index.html")) {
    // Not logged in → send to login
    window.location.href = "login.html";
  }

  if (user && path.endsWith("login.html")) {
    // Already logged in → send to dashboard
    window.location.href = "index.html";
  }

  // If user is logged in and on dashboard, you can also populate profile info:
  if (user && path.endsWith("index.html")) {
    document.getElementById("agentName").textContent = user.displayName || "Agent";
    document.getElementById("agentEmail").textContent = user.email;
    document.getElementById("agentAvatar").src = user.photoURL 
      || `https://ui-avatars.com/api/?name=${user.displayName || "Agent"}&background=2e5aac&color=fff`;
  }
});
