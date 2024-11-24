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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
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
       
    
    try{
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);      
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
          try{
            const userCredential = await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
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