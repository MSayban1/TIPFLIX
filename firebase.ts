
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDR8V8gsuX4NBfjiTh-K8R33gEUVRwQjYk",
  authDomain: "tipflix-7a16a.firebaseapp.com",
  databaseURL: "https://tipflix-7a16a-default-rtdb.firebaseio.com",
  projectId: "tipflix-7a16a",
  storageBucket: "tipflix-7a16a.firebasestorage.app",
  messagingSenderId: "433959916138",
  appId: "1:433959916138:web:eaa14fb292a0f894b6b013"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
