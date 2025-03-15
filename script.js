// Import Firebase setup
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC8ust9ZkX9zqXPNjy9g4-7QmmQDasxewc",
  authDomain: "jf-chat-1ac2e.firebaseapp.com",
  projectId: "jf-chat-1ac2e",
  storageBucket: "jf-chat-1ac2e.firebasestorage.app",
  messagingSenderId: "81241551133",
  appId: "1:81241551133:web:1c6e4ff5afe09d38b0f1f4",
  measurementId: "G-2GPYBGZYQ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

// Google login
const googleLoginBtn = document.getElementById('google-login-btn');

googleLoginBtn.addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            // Redirect to home page after successful login
            window.location.href = 'home.html';
        })
        .catch((error) => {
            console.error("Error during sign-in:", error);
        });
});
