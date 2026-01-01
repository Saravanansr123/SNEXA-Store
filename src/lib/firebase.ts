import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

/* =====================================
   FIREBASE CONFIG
===================================== */

const firebaseConfig = Object.freeze({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
});

/* =====================================
   VALIDATION (FAIL FAST)
===================================== */

if (!firebaseConfig.apiKey) {
  throw new Error("❌ Missing Firebase environment variables");
}

/* =====================================
   INIT APP (SAFE FOR HMR)
===================================== */

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

/* =====================================
   EXPORT SERVICES
===================================== */

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

/**
 * Functions region: asia-south1 (India)
 * Change only if backend region differs
 */
export const functions = getFunctions(app, "asia-south1");

export default app;
