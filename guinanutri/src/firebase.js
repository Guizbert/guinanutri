// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "guinanutri-4b984.firebaseapp.com",
  projectId: "guinanutri-4b984",
  storageBucket: "guinanutri-4b984.appspot.com",
  messagingSenderId: "95215492094",
  appId: "1:95215492094:web:1709a704c0c7d63de3feaf"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);