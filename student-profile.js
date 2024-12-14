// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

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
const auth = getAuth();
const db = getFirestore(app);

// Wait for the page to load before initializing Firebase Auth
document.addEventListener("DOMContentLoaded", () => {
  
  const studentNameElement = document.getElementById("student-name");
  const studentEmailElement = document.getElementById("student-email");
  const studentRollnoElement = document.getElementById("student-rollno");

  // Check if the user is logged in
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Get the student's details from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Update the profile with the fetched name, email, and roll number
        studentNameElement.textContent = user.email.split('@')[0] || "No Name Available";  // Default name if not found
        studentEmailElement.textContent = user.email || "No Email Available";  // Default email if not found
        studentRollnoElement.textContent = userData.rollNo || "No Roll No Available";  // Default rollNo if not found
      } else {
        console.log("No user document found");
      }
    } else {
      // User is not logged in, redirect to login page (optional)
      window.location.replace("login.html");
    }
  });

  // Function to handle logout
  window.logout = async () => {
    try {
      await signOut(auth);
      window.location.replace("login.html");  // Redirect to login page
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };
});
