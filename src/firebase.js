import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD3R93uCXGXpItx9Y5hsoSndFgBIWDQSaA",
  authDomain: "remodify-site-2.firebaseapp.com",
  projectId: "remodify-site-2",
  storageBucket: "remodify-site-2.appspot.com",
  messagingSenderId: "842617441628",
  appId: "1:842617441628:web:55d6ea809598f1f1d30599",
  measurementId: "G-ZQR6SHWTCR"
};

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();