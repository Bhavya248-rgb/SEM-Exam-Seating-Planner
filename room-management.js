import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to display planners
async function loadPlanners() {
  const plannersRef = ref(db, 'planners');
  try {
    const snapshot = await get(plannersRef);
    if (snapshot.exists()) {
      const planners = snapshot.val();
      const plannerList = document.getElementById('planner-list');

      Object.keys(planners).forEach(plannerId => {
        const planner = planners[plannerId];
        const plannerItem = document.createElement('div');
        plannerItem.classList.add('planner-item');

        // Convert Base64 content to displayable data
        const roomFileData = base64ToText(planner.files.roomFile.content);
        const studentFileData = base64ToText(planner.files.studentFile.content);

        // Create tables for room file and student file data
        const roomTable = createTable(roomFileData);
        const studentTable = createTable(studentFileData);

        plannerItem.innerHTML = `
          <h2>${planner.plannerName}</h2>
          <div class="table-container">
            <h3>Room File Data</h3>
            ${roomTable}
          </div>
          <div class="table-container">
            <h3>Student File Data</h3>
            ${studentTable}
          </div>
        `;
        
        plannerList.appendChild(plannerItem);
      });
    } else {
      document.getElementById('planner-list').innerHTML = '<p>No planners available.</p>';
    }
  } catch (error) {
    console.error("Error loading planners:", error);
    alert("Error loading planners. Check console for details.");
  }
}

// Helper function to convert Base64 to Text
function base64ToText(base64) {
  const binary = atob(base64);
  let text = '';
  for (let i = 0; i < binary.length; i++) {
    text += String.fromCharCode(binary.charCodeAt(i));
  }
  return text;
}

// Helper function to create a table from CSV/text data
function createTable(data) {
  const rows = data.split('\n');
  let table = '<table><thead><tr>';

  // Use first row for table headers
  const headers = rows[0].split(',');
  headers.forEach(header => {
    table += `<th>${header.trim()}</th>`;
  });

  table += '</tr></thead><tbody>';

  // Populate the table rows
  rows.slice(1).forEach(row => {
    if (row.trim()) {
      const cols = row.split(',');
      table += '<tr>';
      cols.forEach(col => {
        table += `<td>${col.trim()}</td>`;
      });
      table += '</tr>';
    }
  });

  table += '</tbody></table>';
  return table;
}

// Load planners when the page loads
window.onload = loadPlanners;
