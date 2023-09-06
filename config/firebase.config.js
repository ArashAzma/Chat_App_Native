import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCWHotRdJZhrygu_hJkuJdYo4TjlpQr9Ng",
    authDomain: "chatnative-ddb5f.firebaseapp.com",
    projectId: "chatnative-ddb5f",
    storageBucket: "chatnative-ddb5f.appspot.com",
    messagingSenderId: "559742811688",
    appId: "1:559742811688:web:1c744ddc6e637a2fa3bf1d",
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const fireAuth = getAuth(app);
const fireDb = getFirestore(app);
const fireStorage = getStorage(app);

export { app, fireAuth, fireDb, fireStorage };
