import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmaxdwrTgl-sppswDGyEGpBqzr3FbF2AI",
  authDomain: "shopco-e3079.firebaseapp.com",
  projectId: "shopco-e3079",
  storageBucket: "shopco-e3079.appspot.com",
  messagingSenderId: "786682614303",
  appId: "1:786682614303:web:5cefb81c145227616b7b2a",
  measurementId: "G-10M7S1TKQW",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);
const auth = getAuth(app);

const storage = getStorage(app);

export { auth, db, storage };
