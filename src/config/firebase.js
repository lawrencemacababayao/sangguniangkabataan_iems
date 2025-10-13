import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjrQ-sYxRRZ76HOjJ7pEtFY1T7OJnuN1E",
  authDomain: "sk-iems.firebaseapp.com",
  projectId: "sk-iems",
  storageBucket: "sk-iems.firebasestorage.app",
  messagingSenderId: "629409798645",
  appId: "1:629409798645:web:e755e962944e50140ca8bc",
  measurementId: "G-16W16TF0WV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app);