import {getAuth, GoogleAuthProvider} from "firebase/auth";


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,

  authDomain: "login-e-comm.firebaseapp.com",
  projectId: "login-e-comm",
  storageBucket: "login-e-comm.firebasestorage.app",
  messagingSenderId: "31026810216",
  appId: "1:31026810216:web:1328884fefd7b06c7e1add"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider=  new GoogleAuthProvider();

export {auth, provider}