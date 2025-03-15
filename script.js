// Import necessary Firebase setup
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { initializeApp } from "firebase/app";

// Firebase configuration and initialization
const firebaseConfig = {
  apiKey: "AIzaSyC8ust9ZkX9zqXPNjy9g4-7QmmQDasxewc",
  authDomain: "jf-chat-1ac2e.firebaseapp.com",
  projectId: "jf-chat-1ac2e",
  storageBucket: "jf-chat-1ac2e.firebasestorage.app",
  messagingSenderId: "81241551133",
  appId: "1:81241551133:web:1c6e4ff5afe09d38b0f1f4",
  measurementId: "G-2GPYBGZYQ7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase();

// Google login
const googleLoginBtn = document.getElementById('google-login-btn');

googleLoginBtn.addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            
            // Check if the user has already created an account
            const userRef = ref(db, 'users/' + user.uid);
            get(userRef).then((snapshot) => {
                if (!snapshot.exists()) {
                    // User doesn't have an account, redirect to account creation page
                    window.location.href = 'account.html';
                } else {
                    // User has an account, go to the home page
                    window.location.href = 'home.html';
                }
            }).catch((error) => {
                console.error("Error checking account:", error);
            });
        })
        .catch((error) => {
            console.error("Error during sign-in:", error);
        });
});
