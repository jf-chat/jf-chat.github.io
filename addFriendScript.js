// Firebase setup and sending friend request
import { getDatabase, ref, set } from "firebase/database";

// Get user ID
const userId = "generated_user_id"; // Replace with the logged-in user's ID

const sendRequestBtn = document.getElementById('sendRequestBtn');
const friendIdInput = document.getElementById('friendId');

sendRequestBtn.addEventListener('click', () => {
    const friendId = friendIdInput.value;
    
    if (friendId) {
        const db = getDatabase();
        const requestRef = ref(db, 'friend_requests/' + friendId);

        set(requestRef, {
            from: userId,
            to: friendId
        }).then(() => {
            alert("Friend request sent!");
        }).catch((error) => {
            console.error("Error sending request:", error);
        });
    } else {
        alert("Please enter a valid user ID.");
    }
});
