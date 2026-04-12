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
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.replace(/['"]/g, "").trim(),
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.replace(/['"]/g, "").trim(),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.replace(/['"]/g, "").trim(),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.replace(/['"]/g, "").trim(),
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.replace(/['"]/g, "").trim(),
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.replace(/['"]/g, "").trim(),
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.replace(/['"]/g, "").trim(),
};

// Validate config (prevent using placeholder values)
const isConfigValid = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey.length > 10 &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "your-project-id"
);

let app: FirebaseApp;
if (getApps().length > 0) {
  app = getApp();
} else {
  app = initializeApp(isConfigValid ? firebaseConfig : { ...firebaseConfig, apiKey: "demo-key" });
}

// Initialize Firestore with persistence (modern way)
let db: Firestore;

try {
  if (typeof window !== "undefined") {
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
        // You can add cache size limit if needed:
        // cacheSizeBytes: 100 * 1024 * 1024, // 100 MB
      }),
    });

    console.info("Firestore initialized with persistent local cache (multi-tab support)");
  } else {
    // Server-side: use standard Firestore (no persistence needed)
    db = getFirestore(app);
  }
} catch (error: any) {
  console.warn("Failed to initialize Firestore with persistent cache. Falling back to default:", error.message);

  // Fallback to basic getFirestore (no persistence)
  db = getFirestore(app);
}

const auth: Auth = getAuth(app);
const storage: FirebaseStorage = getStorage(app);

// Analytics (client-side only)
let analytics: Analytics | undefined = undefined;

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
      console.warn("Analytics isSupported() check failed:", err);
    });
}

export { app, auth, db, storage, analytics, isConfigValid };