import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, get,set,onValue } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

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
const db = getDatabase(app);

// References
const disabilitiesRef = ref(db, "settings/disabilities");
const toggleSwitch = document.getElementById("disabilitiesToggle");

// Fetch initial value and set the toggle
onValue(disabilitiesRef, (snapshot) => {
  if (snapshot.exists()) {
    toggleSwitch.checked = snapshot.val();
  } else {
    console.log("No data available for disabilities.");
  }
});

// Listen for changes on the toggle switch
toggleSwitch.addEventListener("change", () => {
  const isChecked = toggleSwitch.checked;
  set(disabilitiesRef, isChecked)
    .then(() => console.log("Disabilities setting updated:", isChecked))
    .catch((error) => console.error("Error updating disabilities setting:", error));
});
