import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDioiamcqmihv8MCq_eHHvRt3GSkCkm51Q",
  authDomain: "emailerproject-e0233.firebaseapp.com",
  projectId: "emailerproject-e0233",
  storageBucket: "emailerproject-e0233.firebasestorage.app",
  messagingSenderId: "84554711473",
  appId: "1:84554711473:web:e5e1eecadb7db6ac657d90",
  measurementId: "G-ZMEB3LXJPZ"
};


// const firebaseConfig = {
//   apiKey: "AIzaSyBhLcQQbWb9BQ6J4woH0QhJgU8084npL8g",
//   authDomain: "mailer-68dbb.firebaseapp.com",
//   projectId: "mailer-68dbb",
//   storageBucket: "mailer-68dbb.firebasestorage.app",
//   messagingSenderId: "973735658733",
//   appId: "1:973735658733:web:a9e62f84ff0317f08f78e4",
//   measurementId: "G-P87PYLB2J9"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User signed in successfully");
    return result.user;
  } catch (error) {
    console.error("Error during Google Sign-In:", error.message);
    throw error;
  }
};
