import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDBTKaLFvmNWXH2t4E3wCEOajcvm7ziqMY",
  authDomain: "neuroguard-sign-up.firebaseapp.com",
  projectId: "neuroguard-sign-up",
  storageBucket: "neuroguard-sign-up.firebasestorage.app",
  messagingSenderId: "15655849170",
  appId: "1:15655849170:web:305984e6e66a0f1f93710b"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
