// Import Firebase modules
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

// DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  const adminNameElement = document.getElementById("admin-name");
  const adminEmailElement = document.getElementById("admin-email");
  const adminRoleElement = document.getElementById("admin-role");

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid); // Assuming `admins` is your collection
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        adminNameElement.textContent = userData.name || "Admin";
        adminEmailElement.textContent = user.email || "No Email";
        adminRoleElement.textContent = userData.role || "No Role";
      } else {
        console.log("Admin data not found");
      }
    } else {
      window.location.replace("login.html");
    }
  });

  window.logout = async () => {
    try {
      await signOut(auth);
      window.location.replace("login.html");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };
});
