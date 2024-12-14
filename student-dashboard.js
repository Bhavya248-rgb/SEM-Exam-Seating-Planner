import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

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
const db = getDatabase(app);
const firestore = getFirestore(app);

// Function to decode base64 string and log the third column with matching rollNo
async function fetchAndDecodeAllocationData(user) {
  try {
    // Reference to the specific allocationFile content
    const allocationRef = ref(db, "planners/-OE1HE1yCu4hTzN3omti/files/allocationFile/content");

    // Fetch the content from the database
    const snapshot = await get(allocationRef);
    if (snapshot.exists()) {
      const allocationContent = snapshot.val();  // This is the content of allocationFile

      // Decode the base64 content
      const decodedContent = atob(allocationContent); // Decode from base64 to plain text (CSV format)

      console.log("Decoded CSV content:");
      console.log(decodedContent);

      // Split the decoded content into rows (assuming it's CSV format)
      const rows = decodedContent.split("\n");

      // Loop through the rows and check the third column for matching rollNo
      console.log("Rows where third column matches the current user's rollNo:");
      rows.forEach((row, index) => {
        // Split the row into columns by commas
        const columns = row.split(",");
        
        // Skip the first two rows (header rows) if necessary
        if (index >= 2 && columns.length >= 3) {
          // Compare third column with current user's rollNo

          if (columns[2] == user.rollNo) {  // Check if third column matches rollNo
            console.log("Matching row: ", row);  // Log the whole row
          }
        }
      });

      // Fetch user details from Firestore to get rollNo
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const rollNo = userData.rollNo || "No Roll No Available";  // Default rollNo if not found
        console.log(`Current user UID: ${user.uid}, RollNo: ${rollNo}`);
      } else {
        console.log("No user document found in Firestore.");
      }

    } else {
      console.log("No allocation data available.");
    }
  } catch (error) {
    console.error("Error fetching or decoding allocation data:", error);
  }
}

// Listen for authentication state changes to get the current user
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User is logged in.");
    
    // Fetch user data from Firestore to get rollNo
    const userDocRef = doc(firestore, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const rollNo = userData.rollNo || null;

      if (rollNo) {
        user.rollNo = rollNo; // Add rollNo to user object for use later
        // Fetch and decode allocation data once the user is authenticated
        await fetchAndDecodeAllocationData(user);
      } else {
        console.log("No rollNo found for the current user.");
      }
    } else {
      console.log("User data not found in Firestore.");
    }
  } else {
    console.log("No user is logged in.");
  }
});
