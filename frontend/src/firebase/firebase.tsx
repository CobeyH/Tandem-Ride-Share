import {
  AuthProvider,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";

// Import the functions you need from the SDKs you need
import { FirebaseError, initializeApp } from "firebase/app";
import { getUser, setUser } from "./database";
import { createStandaloneToast, UseToastOptions } from "@chakra-ui/react";
import extendedTheme from "../theme/style";

//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
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
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// Setup emulators for local development
if (location.hostname === "localhost") {
  console.log("Starting on localhost");
  connectDatabaseEmulator(db, "localhost", 9000);
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
}

export type ProviderType = "google" | "facebook";

export const signInWithProvider = async (
  provider: AuthProvider,
  authProvider: ProviderType
) => {
  try {
    const response = await signInWithPopup(auth, provider);
    const user = response.user;
    // If the user doesn't exist then add them.
    getUser(user.uid).catch((err) => {
      if (err === undefined) {
        setUser({
          uid: user.uid,
          name: user.displayName ? user.displayName : "User",
          authProvider,
          email: user.email ? user.email : "",
        });
      } else {
        console.log(err);
      }
    });
  } catch (err) {
    if (err instanceof FirebaseError) {
      handleAuthError(err);
    } else {
      console.log(err);
    }
  }
};

export async function loginWithEmailAndPassword(
  email: string,
  password: string
) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    if (err instanceof FirebaseError) {
      handleAuthError(err);
    } else {
      console.log(err);
    }
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
    await setUser({
      uid: user.uid,
      name: name,
      authProvider: "local",
      email: email,
    });
  } catch (err) {
    if (err instanceof FirebaseError) {
      handleAuthError(err);
    } else {
      console.log(err);
    }
  }
};

const handleAuthError = (error: FirebaseError) => {
  const toast = createStandaloneToast({ theme: extendedTheme });
  const report: UseToastOptions = {
    title: "",
    status: "error",
    description: "",
    isClosable: true,
  };
  switch (error.code) {
    case "auth/email-already-in-use":
      report.title = "User Already Exists";
      report.description =
        "The provided email is already in use by an existing user. Each user must have a unique email. ";
      break;
    case "auth/invalid-email":
      report.title = "Invalid Email Address";
      report.description =
        "The provided value for the email user property is invalid. It must be a string email address. ";
      break;
    case "auth/user-not-found":
      report.title = "User Not Found";
      report.description =
        "There is no existing user record corresponding to the provided information.";
      break;
    case "auth/missing-email":
      report.title = "Missing Email";
      report.description = "Please provide a valid email address.";
      break;
    case "auth/account-exists-with-different-credential":
      report.title = "Account Already Exists";
      report.description =
        "It's possible you already created an account with a different login service.";
      break;
    default:
      report.title = error.code;
      report.description = error.message;
      break;
  }
  toast(report);
};

export async function sendPasswordReset(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (err) {
    console.error(err);
  }
}

export const logout = () => {
  signOut(auth);
};
