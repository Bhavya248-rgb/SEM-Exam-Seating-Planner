import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js';
import { getFirestore, collection, getDocs,addDoc, query, where } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js';

import { serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js';

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

// Admin click handler
document.getElementById("notifyButton").addEventListener("click", function() {
    sendNotification("Your seminar seating has been updated", "Seminar Notification", "student");
    sendNotification("You have been assigned as invigilator", "Invigilator Assignment", "invigilator");
  });

  // Function to send notification to users based on role
  async function sendNotification(message,title, role) {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('role', '==', role));
    const snapshot = await getDocs(q);
  
    snapshot.forEach(async (doc) => {
      const userId = doc.id;
      const notificationsRef = collection(doc.ref, 'notifications');
  
      // Add notification document to the user's notifications subcollection
      await addDoc(notificationsRef, {
        title:title,
        message: message,
        role: role,
        timestamp: serverTimestamp(),
        readStatus: false // Notification hasn't been read yet
      });
    });
  
    alert("Notification sent to all " + role + "s!");
}