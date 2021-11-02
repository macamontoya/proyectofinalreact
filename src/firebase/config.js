import app from "firebase/app"
import firebase from "firebase"
const firebaseConfig = {
    apiKey: "AIzaSyAn5vRReoHm6bOX_6sMVzZ1DQvjIxQGB4A",
    authDomain: "proyecto-final-react-bab8f.firebaseapp.com",
    projectId: "proyecto-final-react-bab8f",
    storageBucket: "proyecto-final-react-bab8f.appspot.com",
    messagingSenderId: "324230121992",
    appId: "1:324230121992:web:facf6f3df97da52a549fbd"
  };
app.initializeApp(firebaseConfig) 
export const auth= firebase.auth()
export const storage= app.storage ()
export const db= app.firestore()
