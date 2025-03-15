// Firebase initialization
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

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
const db = getDatabase(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

// Google Login
document.getElementById("google-login-btn").addEventListener("click", function() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const userId = result.user.uid;
      localStorage.setItem("userId", userId);
      window.location.href = "account.html";
    })
    .catch((error) => {
      console.error(error);
    });
});

// Account creation
document.getElementById("create-account-btn").addEventListener("click", function() {
  const userId = localStorage.getItem("userId");
  const username = document.getElementById("username").value;
  const displayName = document.getElementById("display-name").value;
  const profilePic = document.getElementById("profile-pic").files[0];

  // Check if username already exists
  const usernameRef = ref(db, 'users/');
  get(usernameRef).then(snapshot => {
    const existingUsernames = snapshot.val();
    const usernameTaken = Object.values(existingUsernames).some(user => user.username === username);
    if (usernameTaken) {
      document.getElementById("username-error").textContent = "Username is already taken!";
      return;
    }

    // Store the user data
    const newUserRef = ref(db, 'users/' + userId);
    set(newUserRef, {
      username: username,
      displayName: displayName,
      profilePic: profilePic ? profilePic.name : null,
    }).then(() => {
      window.location.href = "home.html";
    });
  });
});

// Home page logic to display friend requests
const userId = localStorage.getItem("userId");
const friendRequestsRef = ref(db, 'users/' + userId + '/friendRequests/');
get(friendRequestsRef).then(snapshot => {
  const requests = snapshot.val();
  const requestList = document.getElementById("friend-requests-list");
  if (requests) {
    for (const [friendId, status] of Object.entries(requests)) {
      const listItem = document.createElement("li");
      listItem.textContent = `Friend request from ${friendId}`;
      requestList.appendChild(listItem);
    }
  } else {
    requestList.textContent = "No friend requests.";
  }
});


// Simulate a friend request (you would call this when sending a real request)
function simulateFriendRequest(fromUserName, toUserId) {
  sendNotification(toUserId, fromUserName);
}
