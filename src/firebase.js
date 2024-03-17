
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from 'firebase/firestore'
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyB1unHlarr3Fh6r57Ddrm9o4LhMFy8ixak",
    authDomain: "chat-app-test-dbe36.firebaseapp.com",
    projectId: "chat-app-test-dbe36",
    storageBucket: "chat-app-test-dbe36.appspot.com",
    messagingSenderId: "515557996573",
    appId: "1:515557996573:web:830e3c5e6190293f3faef4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)
auth.languageCode = 'it';