import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Hardcoded Firebase configuration (replace with your own if needed)
const firebaseConfig = {
  apiKey: "AIzaSyDEte16f8P90Q6OLiiOiVdn4ZL4Vs4cqbY",
  authDomain: "ai-decision-intelligence-b5718.firebaseapp.com",
  projectId: "ai-decision-intelligence-b5718",
  storageBucket: "ai-decision-intelligence-b5718.firebasestorage.app",
  messagingSenderId: "838884845703",
  appId: "1:838884845703:web:b86b159325f5a49689f022",
  measurementId: "G-GWEEHKRXJ8",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize services
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });

export default app;
