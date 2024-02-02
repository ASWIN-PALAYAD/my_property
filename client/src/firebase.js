// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-realestate-2f505.firebaseapp.com",
  projectId: "mern-realestate-2f505",
  storageBucket: "mern-realestate-2f505.appspot.com",
  messagingSenderId: "640185810232",
  appId: "1:640185810232:web:bcb9b03023b9fac1fd55cd"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);