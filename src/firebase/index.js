// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore"; // Import Firestore
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCRDsJkcvvv3YaS6eQ6an3phq5IXaoUos",
  authDomain: "swin-todo-list.firebaseapp.com",
  projectId: "swin-todo-list",
  storageBucket: "swin-todo-list.appspot.com",
  messagingSenderId: "825889524218",
  appId: "1:825889524218:web:1ac53f6430c152557c7c43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);
export { auth, db }