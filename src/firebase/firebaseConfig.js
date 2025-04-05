// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYFdr1zO0VEr7Iml5KSIKeKgAg1xfa1tk",
  authDomain: "vrs-image-upload.firebaseapp.com",
  projectId: "vrs-image-upload",
  storageBucket: "vrs-image-upload.firebasestorage.app",
  messagingSenderId: "229288731586",
  appId: "1:229288731586:web:a782053ca04bc81a1d6c5b",
  measurementId: "G-K59KLX6R51"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };