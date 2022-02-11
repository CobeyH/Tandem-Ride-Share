import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getDatabase, query, ref, set, get, equalTo } from "firebase/database";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrUBFWOzhP3XPuzi0ZYrNdNLcUWkLngTQ",
  authDomain: "carpooling-6112a.firebaseapp.com",
  databaseURL: "https://carpooling-6112a-default-rtdb.firebaseio.com/",
  projectId: "carpooling-6112a",
  storageBucket: "carpooling-6112a.appspot.com",
  messagingSenderId: "158541550551",
  appId: "1:158541550551:web:927805d53ab973714ab192",
  measurementId: "G-4QXLHB625R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig, "web-frontend");
export const auth = getAuth(app);
export const db = getDatabase(app);

const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = async () => {
  try {
    const response = await signInWithPopup(auth, googleProvider);
    const user = response.user;
    const q = query(ref(db, "users"), equalTo(user.uid, "uid"));
    const snapshot = await get(q);
    // If the user doesn't exist then add them.
    if (!snapshot.exists()) {
      await set(ref(db, "users/" + user.uid), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

export async function loginWithEmailAndPassword(
  email: string,
  password: string
) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err);
  }
}

export const registerWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    console.log(user.uid, user.displayName, user.email);
    await set(ref(db, "users/" + user.uid), {
      uid: user.uid,
      name: name,
      authProvider: "local",
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    alert(err);
  }
};

export async function sendPasswordReset(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Check your email for reset link");
  } catch (err) {
    console.error(err);
  }
}

export const logout = () => {
  signOut(auth);
};
