import { setLogLevel } from "firebase/app";
setLogLevel("debug");
import { StrictMode } from 'react'
import {useState, useEffect} from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Form from './components/Form.jsx'
import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signOut, onAuthStateChanged, connectAuthEmulator, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBykz-MF2S0f7DeOPKUcYuUOBACjLlJdjU",
  authDomain: "test-db699.firebaseapp.com",
  projectId: "test-db699",
  storageBucket: "test-db699.firebasestorage.app",
  messagingSenderId: "302246702327",
  appId: "1:302246702327:web:dbfc5e7e10ec4a4a88b7f2"
});

const auth = getAuth(firebaseApp);

try {
  connectAuthEmulator(auth, "http://localhost:9099");
} catch (error) {
  console.error("Error connecting to the emulator:", error);
}
function Main() {
  const [userIsRegistered, setUserIsRegistered] = useState(false);  
  const [userErrorInfo, setUserErrorInfo] = useState("");
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
    
    const handleLogin = (creds) => { 
  
      const loginEmailPassword = async() => {
      const loginEmail= creds.email;
      const loginPassword = creds.password;
  
      console.log(loginEmail);
      console.log(loginPassword);  
    
    try{
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      console.log(userCredential.user);
      setUserErrorInfo("");
      setUserIsRegistered(true);
      setUserIsLoggedIn(true);
    }
    catch(error) {
      console.log(error);
      setUserErrorInfo(error.message);
    }
  
    }
    loginEmailPassword();
    
    }
    
    const handleReg = (creds) => {

      if (creds.password !==creds.confirmPassword) {
        setUserErrorInfo("Passwords don't match");
        return;
      }
      else {
        const createEmailPassword = async () => {
          const loginEmail= creds.email;
          const loginPassword = creds.password;        
          console.log(loginEmail);
          console.log(loginPassword);

          try{
            const userCredential = await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
            console.log(userCredential.user);
            setUserErrorInfo("");
            setUserIsRegistered(true);
            setUserIsLoggedIn(true);

          }
          catch(error) {
            console.log(error);
            setUserErrorInfo(error.message);
          }
      }

      createEmailPassword();
    }
  }  
    const handleLogOut = async () => {
      console.log("Should Log Out Now")      
      await signOut(auth);
    }

      // Monitor authentication state using useEffect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user != null) {
        console.log("Logged In!");
        setUserIsLoggedIn(true);
        setUserIsRegistered(true);
      } else {
        console.log("No user");
        setUserIsLoggedIn(false);
        setUserIsRegistered(false);
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs only once


    return (
      <StrictMode>
        <Form isRegistered={userIsRegistered} errorInfo={userErrorInfo} onLoginSubmit={handleLogin} isLoggedIn={userIsLoggedIn} onCreateAccountSubmit={handleReg} onLogOut={handleLogOut}/>
        <App />
      </StrictMode>
    );
  }
  
  // Render the Main component
  createRoot(document.getElementById('root')).render(<Main />);