import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDrnkWUVTjVvjQ7KBqLHZ--_PSMruefcY",
  authDomain: "blog-gpt-af3da.firebaseapp.com",
  projectId: "blog-gpt-af3da",
  storageBucket: "blog-gpt-af3da.appspot.com",
  messagingSenderId: "632220840654",
  appId: "1:632220840654:web:2d7bcf0592ffd9859fd69f",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
