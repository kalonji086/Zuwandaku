import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import type { Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDYHS8vPdg6AyCKLu8oI0CWGN_IeDbMFHg",
  authDomain: "zuwandaku.firebaseapp.com",
  projectId: "zuwandaku",
  storageBucket: "zuwandaku.firebasestorage.app",
  messagingSenderId: "801011057705",
  appId: "1:801011057705:web:99be7f47e870562a48c838",
  measurementId: "G-7J44TMP17N",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Analytics is browser-only — lazy init to avoid SSR crash
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

export const storage = getStorage(app);
export { app, analytics };
