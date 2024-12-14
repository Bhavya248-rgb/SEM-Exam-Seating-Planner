// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVXewlRhf6VlNCsqIMrWXzazY9mfUxXLU",
  authDomain: "sem-exam-seating-planner.firebaseapp.com",
  projectId: "sem-exam-seating-planner",
  storageBucket: "sem-exam-seating-planner.appspot.com",
  messagingSenderId: "572574273894",
  appId: "1:572574273894:web:3411aa2b8a6db04ef8b8a7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Handle form submission
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent page reload

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    // Log in using Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, username, password);
    const user = userCredential.user;

    // Fetch the user's role from Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const role = userDoc.data().role;

      // Redirect based on the role
      switch (role) {
        case 'admin':
          window.location.href = 'admin-index.html';
          break;
        case 'student':
          window.location.href = 'student.html';
          break;
        case 'invigilator':
          window.location.href = 'invigilator-dashboard.html';
          
          break;
        default:
          alert('Invalid role! Please contact the administrator.');
      }
    } else {
      alert('User role not found. Please contact support.');
    }
  } catch (error) {
    console.error('Login error: ', error);
    alert('Login failed. Please check your username and password.');
  }
});
