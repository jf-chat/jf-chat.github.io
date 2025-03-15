// Import Firebase setup
import { getDatabase, ref, set, get } from "firebase/database";

// Fetch friends from Firebase
const db = getDatabase();
const friendsList = document.getElementById('friends-list');
const addFriendBtn = document.getElementById('add-friend-btn');

addFriendBtn.addEventListener('click', () => {
    window.location.href = 'addFriend.html';
});

// Fetch friends from the database
get(ref(db, 'friends/')).then((snapshot) => {
    if (snapshot.exists()) {
        const friends = snapshot.val();
        Object.keys(friends).forEach((key) => {
            const friend = friends[key];
            const friendDiv = document.createElement('div');
            friendDiv.textContent = friend.username;
            friendsList.appendChild(friendDiv);
        });
    } else {
        friendsList.textContent = 'No friends yet!';
    }
});
