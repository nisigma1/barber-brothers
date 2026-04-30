import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const publicFirebaseFallbackConfig = {
  apiKey: "AIzaSyBFCFMufU9FHQ0emIA3UaL3UXPynLSGGeY",
  authDomain: "barber-brothers-3786c.firebaseapp.com",
  projectId: "barber-brothers-3786c",
  storageBucket: "barber-brothers-3786c.firebasestorage.app",
  messagingSenderId: "490091607279",
  appId: "1:490091607279:web:32b69e87e6059b7f2f971a",
} satisfies FirebaseOptions;

const firebaseClientConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? publicFirebaseFallbackConfig.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? publicFirebaseFallbackConfig.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? publicFirebaseFallbackConfig.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? publicFirebaseFallbackConfig.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? publicFirebaseFallbackConfig.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? publicFirebaseFallbackConfig.appId,
};

export function isFirebaseClientConfigured() {
  return Object.values(firebaseClientConfig).every(Boolean);
}

export function getFirebaseClientApp(): FirebaseApp | null {
  if (!isFirebaseClientConfigured()) {
    return null;
  }

  return getApps().length > 0 ? getApp() : initializeApp(firebaseClientConfig);
}

export function getFirebaseClientAuth() {
  const app = getFirebaseClientApp();

  return app ? getAuth(app) : null;
}

export function getFirebaseClientDb() {
  const app = getFirebaseClientApp();

  return app ? getFirestore(app) : null;
}
