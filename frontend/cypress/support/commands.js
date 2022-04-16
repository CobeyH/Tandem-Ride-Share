import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import { attachCustomCommands } from "cypress-firebase";
import {firebaseConfig} from "../../src/firebase/firebase"


const shouldUseEmulator = window.location.hostname === "localhost";
// Emulate RTDB
if (shouldUseEmulator) {
  firebaseConfig.databaseURL = `http://localhost:9000?ns=${firebaseConfig.projectId}`;
  console.debug(`Using RTDB emulator: ${firebaseConfig.databaseURL}`);
}

// Initialize Firebase instance
firebase.initializeApp(firebaseConfig);

// Emulate Auth
if (shouldUseEmulator) {
  firebase.auth().useEmulator(`http://localhost:9099/`);
  console.debug(`Using Auth emulator: http://localhost:9099/`);
}


attachCustomCommands({ Cypress, cy, firebase });
