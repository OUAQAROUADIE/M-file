import { getAuth, GoogleAuthProvider  } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyD1OJPxd3tq3jGU6AZZYVOLwl106AOEOSo",
    authDomain: "file-management-system-1367a.firebaseapp.com",
    projectId: "file-management-system-1367a",
    storageBucket: "file-management-system-1367a.appspot.com",
    messagingSenderId: "974183914091",
    appId: "1:974183914091:web:bf36c69c91654664002f2e",
    measurementId: "G-ZLP3BXZ25E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();


export { app,provider, analytics, auth, db, storage };
