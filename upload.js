// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// File Upload Logic
document.getElementById("planner-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("Form submitted");

  const plannerName = document.getElementById("planner-name").value;
  const roomFile = document.getElementById("room-file").files[0];
  const studentFile = document.getElementById("student-file").files[0];
  const invigilatorFile = document.getElementById("invigilator-file").files[0];

  if (!plannerName || !roomFile || !studentFile) {
    alert("All fields are required!");
    return;
  }

  console.log("Fields are valid, starting upload...");

  try {
    // Convert files to Base64
    const roomFileData = await fileToBase64(roomFile);
    const studentFileData = await fileToBase64(studentFile);
    const invigilatorFileData = await fileToBase64(invigilatorFile);

    // Store in Firebase Realtime Database
    const plannerRef = push(ref(db, "planners"));
    await set(plannerRef, {
      plannerName,
      files: {
        roomFile: {
          name: roomFile.name,
          type: roomFile.type,
          size: roomFile.size,
          content: roomFileData
        },
        studentFile: {
          name: studentFile.name,
          type: studentFile.type,
          size: studentFile.size,
          content: studentFileData
        },
        invigilatorFile: {
          name: invigilatorFile.name,
          type: invigilatorFile.type,
          size: invigilatorFile.size,
          content: invigilatorFileData
        },
      },
      timestamp: new Date().toISOString()
    });

    alert("Files uploaded successfully!");
    console.log("Upload successful");

    // Optionally reset the form
    document.getElementById("planner-form").reset();
  } catch (error) {
    console.error("Error uploading files:", error);
    alert("Failed to upload files. Check the console for details.");
  }
});

// Helper function to convert file to Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]); // Exclude the data URI prefix
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}