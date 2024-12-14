import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js';
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getFirestore, collection, getDocs,addDoc, query, where } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js';


// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCVXewlRhf6VlNCsqIMrWXzazY9mfUxXLU",
    authDomain: "sem-exam-seating-planner.firebaseapp.com",
    projectId: "sem-exam-seating-planner",
    storageBucket: "sem-exam-seating-planner.appspot.com",
    messagingSenderId: "572574273894",
    appId: "1:572574273894:web:3411aa2b8a6db04ef8b8a7",
    databaseURL: "https://sem-exam-seating-planner-default-rtdb.asia-southeast1.firebasedatabase.app/",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  const auth = getAuth(app);  // Initialize Firebase Authentication
  
  // Function to show notifications for the logged-in user
  async function showNotifications() {
    const user = auth.currentUser; // Get the current logged-in user
    console.log("uu:",user.uid);
    if (user) {
      const userId = user.uid;  // Get the user ID from Firebase Authentication
      const notificationsRef = collection(firestore, 'users', userId, 'notifications');
      const snapshot = await getDocs(notificationsRef);
  
      if (snapshot.empty) {
        console.log("No notifications found.");
        return;
      }
  
      // Clear previous notifications
      const notificationsContainer = document.getElementById("notifications-container");
      notificationsContainer.innerHTML = "";
  
      snapshot.forEach((doc) => {
        const notification = doc.data();
        // const notificationElement = document.createElement("li");
        const title = notification.title || "No Title";
    const message = notification.message || "No Message";
    const timestamp = notification.timestamp?.toDate() || new Date();

    // Create notification element
    const notificationDiv = document.createElement('div');
    notificationDiv.classList.add('notification');

    // Title element
    const titleEl = document.createElement('h3');
    titleEl.classList.add('notification-title');
    titleEl.textContent = title;

    // Message element
    const messageEl = document.createElement('p');
    messageEl.classList.add('notification-message');
    messageEl.textContent = message;

    // Timestamp element
    const timeEl = document.createElement('span');
    timeEl.classList.add('notification-time');
    timeEl.textContent = timestamp.toLocaleString();

    // Append elements to notification div
    notificationDiv.appendChild(titleEl);
    notificationDiv.appendChild(messageEl);
    notificationDiv.appendChild(timeEl);

    // Append notification div to container
    notificationsContainer.appendChild(notificationDiv);
  });
  }
}
  
  // Function to display notifications on the page when the page loads
//   window.onload = showNotifications;
onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is logged in:", user.uid);  // Access user details here
      showNotifications(user.uid);  // Proceed with showing notifications
    } else {
      console.log("No user is logged in.");
      alert("Please log in to view notifications.");
    }
  });