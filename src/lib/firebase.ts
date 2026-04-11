import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.replace(/['"]/g, ""),
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.replace(/['"]/g, ""),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.replace(/['"]/g, ""),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.replace(/['"]/g, ""),
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.replace(/['"]/g, ""),
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.replace(/['"]/g, ""),
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.replace(/['"]/g, ""),
};

// Check if Firebase config is valid (not placeholders)
const isConfigValid = !!(firebaseConfig.apiKey && firebaseConfig.apiKey !== "your_api_key");

// Initialize Firebase App
const app: FirebaseApp = getApps().length > 0
  ? getApp()
  : initializeApp(isConfigValid ? firebaseConfig : { ...firebaseConfig, apiKey: "INVALID_KEY" });

// Initialize Firestore with persistence (optimized for multi-tab)
let db: Firestore;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
} catch (e) {
  // Fallback to standard getFirestore if persistence fails
  console.warn("Firestore persistence initialization failed, falling back to standard:", e);
  db = getFirestore(app);
}

const auth: Auth = getAuth(app);
const storage: FirebaseStorage = getStorage(app);

// Analytics (client-side only + conditional)
let analytics: Analytics | undefined;

if (typeof window !== "undefined" && isConfigValid && firebaseConfig.measurementId) {
  isSupported()
    .then((supported) => {
      if (supported) {
        try {
          analytics = getAnalytics(app);
        } catch (err) {
          console.warn("Firebase Analytics initialization failed:", err);
        }
      }
    })
    .catch((err) => {
      console.warn("Firebase Analytics isSupported check failed:", err);
    });
}

export { app, auth, db, storage, analytics, isConfigValid };