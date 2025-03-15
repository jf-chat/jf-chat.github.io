// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, get, child } from "firebase/database";

// Your web app's Firebase configuration
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

// Firebase Authentication
const auth = getAuth();
const provider = new GoogleAuthProvider();

// Handle login with Google
document.getElementById('login-btn').addEventListener('click', async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log(user);
    checkUserExistence(user);
  } catch (error) {
    console.error(error);
  }
});

// Check if user exists, and redirect to account page if not
const checkUserExistence = async (user) => {
  const db = getDatabase();
  const userRef = ref(db, 'users/' + user.uid);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    window.location.href = "home.html";
  } else {
    window.location.href = "account.html";
  }
};

// Account creation process
document.getElementById('account-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const profilePic = document.getElementById('profilePic').files[0];
  const user = auth.currentUser;

  if (user) {
    const db = getDatabase();
    const newUserRef = ref(db, 'users/' + user.uid);

    // Check if username exists
    const snapshot = await get(child(ref(db), 'users'));
    const users = snapshot.val();
    if (Object.values(users).some(u => u.username === username)) {
      alert('Username already taken');
      return;
    }

    // Set the user data
    const userData = {
      username: username,
      displayName: user.displayName,
      profilePic: profilePic ? await uploadProfilePic(profilePic) : '',
      friends: {},
      friendRequests: {},
      notifications: {}
    };

    await set(newUserRef, userData);
    window.location.href = "home.html";
  }
});

// Upload profile picture
const uploadProfilePic = async (file) => {
  const storageRef = ref(getStorage(), 'profile_pics/' + file.name);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};

// Firebase Realtime Database Functions for Friends/Notifications
// Add friend request, accept friend request, etc. will be added here as needed
