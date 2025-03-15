// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, push } from "firebase/database";

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
const auth = getAuth();
const db = getDatabase(app);

// Firebase Authentication state change to handle the login flow
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User logged in:', user);
    localStorage.setItem('userId', user.uid); // Store user ID after login
  } else {
    window.location.href = 'index.html'; // Redirect to login page if not logged in
  }
});

// Login Function
function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      localStorage.setItem('userId', user.uid);
      window.location.href = 'account.html'; // Redirect to account creation page
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
  
  set(ref(db, 'friendRequests/' + userId + '/' + friendUserId), { status: 'pending' })
    .then(() => {
      alert('Friend request sent!');
    })
    .catch((error) => {
      console.error("Error sending friend request: ", error.message);
    });
}

// Notifications logic
const notificationsBtn = document.getElementById('notifications-btn');
const notificationsDropdown = document.getElementById('notifications-dropdown');
const notificationsList = document.getElementById('notifications-list');

// Toggle notifications dropdown visibility
notificationsBtn.addEventListener('click', () => {
  notificationsDropdown.style.display = notificationsDropdown.style.display === 'block' ? 'none' : 'block';
});

// Function to add notification to the dropdown
function addNotification(notificationText, notificationId) {
  const notificationItem = document.createElement('li');
  notificationItem.classList.add('notification-item');
  notificationItem.innerHTML = `
    ${notificationText}
    <div class="notification-buttons">
      <button class="accept" onclick="respondToRequest('${notificationId}', true)">Accept</button>
      <button class="decline" onclick="respondToRequest('${notificationId}', false)">Decline</button>
    </div>
  `;
  notificationsList.appendChild(notificationItem);
}

// Function to send notifications to the user (for simplicity, you can store these in the database)
function sendNotification(toUserId, fromUserName) {
  const notificationId = push(ref(db, 'notifications/' + toUserId)).key;
  set(ref(db, 'notifications/' + toUserId + '/' + notificationId), {
    text: `${fromUserName} sent you a friend request.`,
    status: 'pending'
  });
}

// Function to handle accepting or declining friend requests
function respondToRequest(notificationId, accepted) {
  const userId = localStorage.getItem('userId'); // Get current user ID

  // Update the notification status in the database
  const status = accepted ? 'accepted' : 'declined';
  set(ref(db, 'notifications/' + userId + '/' + notificationId), { status: status });

  // Show the result in the dropdown
  addNotification(`${status === 'accepted' ? 'You accepted' : 'You declined'} the friend request.`, notificationId);
}

// Simulate a friend request (you would call this when sending a real request)
function simulateFriendRequest(fromUserName, toUserId) {
  sendNotification(toUserId, fromUserName);
}
