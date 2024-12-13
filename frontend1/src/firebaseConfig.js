// src/firebaseConfig.js
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";



// const firebaseConfig = {
//   apiKey: "your-api-key",
//   authDomain: "your-auth-domain",
//   projectId: "your-project-id",
//   storageBucket: "your-storage-bucket",
//   messagingSenderId: "your-messaging-sender-id",
//   appId: "your-app-id",
// };

const firebaseConfig = {
  apiKey: "AIzaSyDwwz8f3QSDJqPa4r1dc9YXZw5Z9JJMpbs",
  authDomain: "project-6059770593.firebaseapp.com",
  projectId: "lokeshmail",
  storageBucket: "lokeshmail.firebasestorage.app",
  messagingSenderId: "6059770593",
  appId: "1:6059770593:web:7791ef395bb9c851c4ada0",
  measurementId: "G-0NWNYZT27Y"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Initialize Firebase Auth


export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User signed in:", result.user);
    return result.user; // Return user information if needed
  } catch (error) {
    console.error("Error during Google Sign-In:", error);
    throw error;
  }
};
