// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-b75b5.firebaseapp.com",
  projectId: "mern-estate-b75b5",
  storageBucket: "mern-estate-b75b5.appspot.com",
  messagingSenderId: "567028344467",
  appId: "1:567028344467:web:bf76939f36d6d6a8808f66"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

