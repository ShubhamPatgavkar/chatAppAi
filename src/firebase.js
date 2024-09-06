import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDmo2S96jhjCvMBcCHEEkTh0KY1cxPjC60",
    authDomain: "chatappai-ded92.firebaseapp.com",
    projectId: "chatappai-ded92",
    storageBucket: "chatappai-ded92.appspot.com",
    messagingSenderId: "560598311596",
    appId: "1:560598311596:web:261bcda90fe04516ecf509"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
