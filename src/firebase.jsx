import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAztCep_dT9M-C1kJb994tyN8qY4rlGJeE",
  authDomain: "todo-list-fd29c.firebaseapp.com",
  projectId: "todo-list-fd29c",
  storageBucket: "todo-list-fd29c.appspot.com",
  messagingSenderId: "552923255630",
  appId: "1:552923255630:web:20118b232007561bf5041f",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };