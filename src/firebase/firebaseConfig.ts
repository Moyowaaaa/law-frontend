// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBI4hRTbUjIDeGxm3pPrH3VK50faFlA530",
  authDomain: "law-frontend.firebaseapp.com",
  projectId: "law-frontend",
  storageBucket: "law-frontend.appspot.com",
  messagingSenderId: "828865014667",
  appId: "1:828865014667:web:6d9ee33ecc96c16c465d8e",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
