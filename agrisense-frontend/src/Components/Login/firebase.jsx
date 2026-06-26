/* eslint-disable no-unused-vars */
import {initializeApp} from 'firebase/app'
import {getAuth,GoogleAuthProvider} from 'firebase/auth'
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCgBCsNpNyZupOWrEi-CnKjMzY4UwbIzOo",
  authDomain: "agri-sense-404e5.firebaseapp.com",
  databaseURL: "https://agri-sense-404e5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "agri-sense-404e5",
  storageBucket: "agri-sense-404e5.firebasestorage.app",
  messagingSenderId: "409808454675",
  appId: "1:409808454675:web:12b609e5b64c9f7e886be6",
  measurementId: "G-FL0S50WQL4"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getDatabase(app);