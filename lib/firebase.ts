import { initializeApp } from "firebase/app";
import firebase from "firebase/app";
import "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import getStorage instead of storage

const firebaseConfig = {
  apiKey: "AIzaSyBKrCa7qu7fWk6s0sOGThk7wKfFxpFjYUA",
  authDomain: "online-banking-da52f.firebaseapp.com",
  projectId: "online-banking-da52f",
  storageBucket: "online-banking-da52f.firebasestorage.app",
  messagingSenderId: "680921073446",
  appId: "1:680921073446:web:827e2130536386b88ae3e7",
  measurementId: "G-XNLKELX163",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize storag

export { app, auth, db, storage };

// import { initializeApp } from "firebase/app";
// import firebase from "firebase/app";
// import "firebase/database";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage"; // Import getStorage instead of storage

// const firebaseConfig = {
//   apiKey: "AIzaSyDMCy6VPG1YqOAj25abtx7hiP4lj_hs-ak",
//   authDomain: "yield-6f99c.firebaseapp.com",
//   projectId: "yield-6f99c",
//   storageBucket: "yield-6f99c.firebasestorage.app",
//   messagingSenderId: "944176572423",
//   appId: "1:944176572423:web:cb74a0c5b9f867b69d22a2",
//   measurementId: "G-3B50B50LVS",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app); // Initialize storag

// export { app, auth, db, storage };
