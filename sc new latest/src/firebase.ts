
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCZ5CsjXDLLo4b71PjDmU878xEHH45KGpw",
    authDomain: "skillcoderss.firebaseapp.com",
    projectId: "skillcoderss",
    storageBucket: "skillcoderss.firebasestorage.app",
    messagingSenderId: "1078647410006",
    appId: "1:1078647410006:web:5a6fd30eae62b905ad9af7"
};

console.log("Firebase Config HARDCODED (Port 5173):", firebaseConfig);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
console.log("Auth initialized:", auth);
console.log("Auth Config:", auth.config);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
