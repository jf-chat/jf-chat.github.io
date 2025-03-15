// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

// Firebase Auth and Database
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, child, get } from "firebase/database";

const auth = getAuth();
const db = getDatabase();

// Check if the user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, fetch user data
        console.log("User is signed in:", user);
        fetchFriends(user.uid); // Load friends list if signed in
    } else {
        // No user is signed in
        console.log("No user signed in");
        window.location.href = "index.html"; // Redirect to login
    }
});

// Fetch user friends from Firebase
function fetchFriends(userId) {
    const friendsRef = ref(db, 'users/' + userId + '/friends');
    get(friendsRef).then((snapshot) => {
        if (snapshot.exists()) {
            const friends = snapshot.val();
            displayFriends(friends);
        } else {
            console.log("No friends found.");
        }
    }).catch((error) => {
        console.error(error);
    });
}

// Display friends in the sidebar
function displayFriends(friends) {
    const friendsList = document.getElementById('friends-list');
    friendsList.innerHTML = ''; // Clear the list

    for (const friendId in friends) {
        const li = document.createElement('li');
        li.textContent = friends[friendId].displayName;
        friendsList.appendChild(li);
    }
}

// Add a friend function
document.getElementById("addFriendBtn").addEventListener("click", function() {
    const friendId = prompt("Enter the User ID of the friend you want to add:");
    if (friendId) {
        addFriend(friendId);
    }
});

// Add a friend to the database
function addFriend(friendId) {
    const userId = auth.currentUser.uid;
    const userRef = ref(db, 'users/' + userId + '/friends/' + friendId);
    set(userRef, {
        displayName: "Friend" // You can customize this field later
    }).then(() => {
        alert("Friend added!");
        fetchFriends(userId); // Refresh the friends list
    }).catch((error) => {
        console.error("Error adding friend:", error);
    });
}
