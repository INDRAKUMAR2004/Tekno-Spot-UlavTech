import { getApp, getApps, initializeApp, FirebaseApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
  Auth,
} from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCq16MWIsRTAGIlLUF10fl461DhCwGS8fc",
  authDomain: "ulavtech-5001c.firebaseapp.com",
  projectId: "ulavtech-5001c",
  storageBucket: "ulavtech-5001c.appspot.com",
  messagingSenderId: "1058028122926",
  appId: "1:1058028122926:web:ab329337d147c59b5900bf",
  measurementId: "G-6WWZ61YEJE",
};

// ✅ Initialize app (only once)
export const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Initialize Firestore (React Native config)
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

// ✅ Initialize Auth with AsyncStorage persistence
let auth: Auth;

try {
  // This ensures only one instance of Auth is created with persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (error) {
  // If Auth is already initialized (hot reload, etc.), use getAuth()
  auth = getAuth(app);
}

export { auth };

// ✅ Firebase Storage
export const storage = getStorage(app);
