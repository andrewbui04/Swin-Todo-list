// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore"; // Import Firestore
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "self_create",
  authDomain: "self_create",
  projectId: "self_create",
  storageBucket: "self_create",
  messagingSenderId: "self_create",
  appId: "self_create"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);
export { auth, db }