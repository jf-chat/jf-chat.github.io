// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

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

// Initialize Firebase Auth
const auth = getAuth();
const provider = new GoogleAuthProvider();

// Login Function
function loginWithGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      // Store user info in localStorage or Firebase
      localStorage.setItem('userId', user.uid);
      window.location.href = 'account.html'; // Redirect to account creation
    })
    .catch((error) => {
      console.error("Error during login: ", error.message);
    });
}

// Account Creation
function createAccount() {
  const userId = generateRandomUserId();
  const username = document.getElementById('username').value || '@user';
  const displayName = document.getElementById('displayName').value;
  const birthday = document.getElementById('birthday').value;
  const profilePic = document.getElementById('profilePic').files[0] || null;
  
  const userData = {
    userId,
    username,
    displayName,
    birthday,
    profilePic: profilePic ? URL.createObjectURL(profilePic) : null,
  };

  const db = getDatabase();
  set(ref(db, 'users/' + userId), userData)
    .then(() => {
      window.location.href = 'home.html'; // Redirect to home page
    })
    .catch((error) => {
      console.error("Error creating account: ", error.message);
    });
}

// Generate Random User ID (8 characters)
function generateRandomUserId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let userId = '';
  for (let i = 0; i < 8; i++) {
    userId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return userId;
}

// Add Friend Function
function addFriend() {
  const friendUserId = document.getElementById('friendUserId').value;
  const userId = localStorage.getItem('userId');
  
  const db = getDatabase();
  set(ref(db, 'friendRequests/' + userId + '/' + friendUserId), {
    status: 'pending',
  })
  .then(() => {
    alert('Friend request sent!');
  })
  .catch((error) => {
    console.error("Error sending friend request: ", error.message);
  });
}

// Log Out Function
function logout() {
  localStorage.removeItem('userId');
  window.location.href = 'index.html'; // Redirect to login page
}

// Home Page Logic (Fetching Friends)
function fetchFriends() {
  const userId = localStorage.getItem('userId');
  const db = getDatabase();
  
  const friendsRef = ref(db, 'users/' + userId + '/friends');
  friendsRef.once('value')
    .then((snapshot) => {
      const friends = snapshot.val();
      if (friends) {
        const friendsList = Object.keys(friends).map(friendId => {
          return `<li>${friends[friendId].username}</li>`;
        }).join('');
        document.getElementById('friendsList').innerHTML = `<ul>${friendsList}</ul>`;
      } else {
        document.getElementById('friendsList').innerHTML = 'No friends yet. Click "Add Friend" to start.';
      }
    })
    .catch((error) => {
      console.error("Error fetching friends: ", error.message);
    });
}
