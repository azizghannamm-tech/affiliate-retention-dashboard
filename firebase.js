
// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getAuth
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {

apiKey: "AIzaSyB8dDTnpPQVRAs7dkfc8QU3L5qUJtm-2jg",

authDomain: "affiliate-relations-17687.firebaseapp.com",

projectId: "affiliate-relations-17687",

storageBucket: "affiliate-relations-17687.appspot.com",

messagingSenderId: "642027131905",

appId: "1:642027131905:web:5f0076ee7b34578b9f9c00"

};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


export {
auth,
db
};
```
