import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// The user must provide these in the .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize only if config exists to prevent crashing if user hasn't set it up yet
let app;
let db = null;
let auth = null;
let googleProvider = null;

try {
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    console.log("Firebase Initialized Successfully.");
  } else {
    console.warn("Firebase config missing. Running in mock data mode.");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { db, auth, googleProvider, collection, getDocs, addDoc, onSnapshot, query, orderBy };
