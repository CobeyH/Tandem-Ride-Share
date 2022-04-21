import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import { attachCustomCommands } from "cypress-firebase";
import { firebaseConfig } from "../../src/firebase/firebase";

// Emulate RTDB if Env variable is passed
const rtdbEmulatorHost = Cypress.env("FIREBASE_DATABASE_EMULATOR_HOST");
if (rtdbEmulatorHost) {
  firebaseConfig.databaseURL = `http://${rtdbEmulatorHost}?ns=${firebaseConfig.projectId}`;
}

firebase.initializeApp(firebaseConfig);

const authEmulatorHost = Cypress.env("FIREBASE_AUTH_EMULATOR_HOST");
if (authEmulatorHost) {
  firebase.auth().useEmulator(`http://${authEmulatorHost}/`);
  console.debug(`Using Auth emulator: http://${authEmulatorHost}/`);
}

attachCustomCommands({ Cypress, cy, firebase });
