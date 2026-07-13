import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPxY3eXtbrR49kMnqbAIiZUJZ0KIFbR8c",
  authDomain: "lms-portal-bb2de.firebaseapp.com",
  projectId: "lms-portal-bb2de",
  storageBucket: "lms-portal-bb2de.firebasestorage.app",
  messagingSenderId: "348642046429",
  appId: "1:348642046429:web:0a73f2d94bcb35bc578634"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;