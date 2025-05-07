// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFK4eb69CXgAwAVs0r9jMJxM0Wi5Wj9O4",
  authDomain: "romaar-d03b0.firebaseapp.com",
  projectId: "romaar-d03b0",
  storageBucket: "romaar-d03b0.firebasestorage.app",
  messagingSenderId: "909017101788",
  appId: "1:909017101788:web:08a67511e27c1d2fa78b19"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};