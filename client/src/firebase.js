import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAMz-7eDS446xPwuyTJvFpNbs2FauuH-qI",
  authDomain: "backtester-3764d.firebaseapp.com",
  projectId: "backtester-3764d",
  storageBucket: "backtester-3764d.firebasestorage.app",
  messagingSenderId: "869904032747",
  appId: "1:869904032747:web:0d2cc618e26cf3fa2f6fae",
  measurementId: "G-70YKWTSFBT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);