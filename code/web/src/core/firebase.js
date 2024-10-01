// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8l0iZLUqbDfoSXPmkqcftF0FhHqsitsY",
  authDomain: "ml-hackathon-2539c.firebaseapp.com",
  projectId: "ml-hackathon-2539c",
  storageBucket: "ml-hackathon-2539c.appspot.com",
  messagingSenderId: "931590139911",
  appId: "1:931590139911:web:d457098cff33e567eabaa2",
  measurementId: "G-7V5FH6C151"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)