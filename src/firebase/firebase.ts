import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? {
  apiKey: "AIzaSyDWvpGhkuqSthyFEGKfrhd9GLrfSbuBhJY",
  authDomain: "blog-gpt-prod.firebaseapp.com",
  projectId: "blog-gpt-prod",
  storageBucket: "blog-gpt-prod.appspot.com",
  messagingSenderId: "105513199245",
  appId: "1:105513199245:web:b99cb38596ae83df07e4c4"
} : {
  apiKey: 'AIzaSyDDrnkWUVTjVvjQ7KBqLHZ--_PSMruefcY',
  authDomain: 'blog-gpt-af3da.firebaseapp.com',
  projectId: 'blog-gpt-af3da',
  storageBucket: 'blog-gpt-af3da.appspot.com',
  messagingSenderId: '632220840654',
  appId: '1:632220840654:web:2d7bcf0592ffd9859fd69f',
};

// Initialize Firebase
const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { db, firebaseApp };
