import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDCYdz86js-hid-lhkjhSTQPLstF9vrNxs",
    authDomain: "database-emails-distry.firebaseapp.com",
    projectId: "database-emails-distry",
    storageBucket: "database-emails-distry.firebasestorage.app",
    messagingSenderId: "148101364398",
    appId: "1:148101364398:web:96fdd3a8468537a0fccb3f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
