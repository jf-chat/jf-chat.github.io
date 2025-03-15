// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// Firebase configuration
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
const provider = new GoogleAuthProvider();

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Redirect to home page if logged in
        window.location.href = "home.html";
    }
});

// Login with Google
document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            signInWithPopup(auth, provider)
                .then((result) => {
                    console.log("User signed in:", result.user);
                })
                .catch((error) => {
                    console.error("Error during login:", error);
                });
        });
    }
});
