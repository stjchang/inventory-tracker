// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAOuVPW04TMg9tdBhb6J5Bw3UdHD1lv9Y",
  authDomain: "hspantryapp-9a69c.firebaseapp.com",
  projectId: "hspantryapp-9a69c",
  storageBucket: "hspantryapp-9a69c.appspot.com",
  messagingSenderId: "550218371119",
  appId: "1:550218371119:web:09e4bf023474d7a8fdb6da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export {app, firestore}