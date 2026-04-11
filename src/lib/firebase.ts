import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.replace(/['"]/g, ""),
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.replace(/['"]/g, ""),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.replace(/['"]/g, ""),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.replace(/['"]/g, ""),
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.replace(/['"]/g, ""),
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.replace(/['"]/g, ""),
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.replace(/['"]/g, "")
};

// Check if Firebase config is valid (not placeholders)
const isConfigValid = !!(firebaseConfig.apiKey && firebaseConfig.apiKey !== "your_api_key");

// Initialize Firebase
// We always return an app instance to avoid breaking other services, 
// but we only initialize with config if it's valid.
const app = getApps().length > 0 
  ? getApp() 
  : initializeApp(isConfigValid ? firebaseConfig : { ...firebaseConfig, apiKey: "INVALID_KEY" });

// Initialize Firestore with optimized settings
let db;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    }),
    // Add long polling if needed for environments with proxy issues
    // experimentalForceLongPolling: true 
  });
} catch (e) {
  // If initialization fails (e.g. multiple tabs without proper manager), 
  // fallback to standard getFirestore
  db = getFirestore(app);
  console.warn("Firestore initialization with persistence failed, falling back to standard initialization:", e);
}

const auth = getAuth(app);
const storage = getStorage(app);

// Initialize Analytics conditionally
let analytics;
// Analytics requires measurementId to be present and a browser environment
if (typeof window !== "undefined" && isConfigValid && firebaseConfig.measurementId) {
  isSupported().then((supported) => {
    if (supported) {
      try {
        analytics = getAnalytics(app);
      } catch (err) {
        console.warn("Firebase Analytics initialization failed: ", err);
      }
    }
  }).catch(err => {
    console.warn("Firebase Analytics isSupported check failed: ", err);
  });
}

export { app, auth, db, storage, analytics, isConfigValid };
