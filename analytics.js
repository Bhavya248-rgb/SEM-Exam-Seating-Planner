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

document.addEventListener("DOMContentLoaded", () => {
  const plannersRef = ref(db, "planners");

  get(plannersRef).then((snapshot) => {
    if (!snapshot.exists()) {
      console.error("No planners found in the database.");
      return;
    }

    const plannerData = snapshot.val();
    console.log('Planner Data:', plannerData);  // Debug log

    for (const plannerId in plannerData) {
      const planner = plannerData[plannerId];
      const roomFileContent = planner.files.roomFile.content;
      const studentFileContent = planner.files.studentFile.content;
      const allocationFileContent = planner.files.allocationFile.content;

      // Decode Base64 CSV files
      const roomData = atob(roomFileContent).split("\n").map(row => row.split(","));
      const studentData = atob(studentFileContent).split("\n").map(row => row.split(","));
      const allocationData = atob(allocationFileContent).split("\n").map(row => row.split(","));

      // Parse headers and rows
      const roomHeaders = roomData[0];
      const roomRows = roomData.slice(1);
      const studentHeaders = studentData[0];
      const studentRows = studentData.slice(1);
      const allocationHeaders = allocationData[0];
      const allocationRows = allocationData.slice(1);

      // Analyze data
      const analytics = generateAnalytics(roomRows, studentRows, allocationRows);

      // Render analytics results
      renderAnalytics(analytics);
    }
  });

  function generateAnalytics(roomRows, studentRows, allocationRows) {
    // Calculate total rooms, total seats, students per course, and allocations per room
    const totalRooms = roomRows.length;
  
    // Calculate total seats in all rooms
    const totalSeats = roomRows.reduce((sum, room) => {
      const benches = parseInt(room[2], 10);
      const studentsPerBench = parseInt(room[3], 10);
  
      if (isNaN(benches) || isNaN(studentsPerBench)) {
        console.error(`Invalid data for room ${room[1]}. Benches: ${room[2]}, Students per bench: ${room[3]}`);
        return sum;
      }
  
      return sum + (benches * studentsPerBench);
    }, 0);
  
    const totalStudents = studentRows.length;
  
    // Calculate students per course, ensuring no undefined values
    const courseCounts = studentRows.reduce((counts, student) => {
      const course = student[1];
      if (course) {
        counts[course] = (counts[course] || 0) + 1;
      }
      return counts;
    }, {});
  
    // Remove courses with zero students or undefined counts
    for (const course in courseCounts) {
      if (courseCounts[course] === 0 || courseCounts[course] === undefined) {
        delete courseCounts[course];
      }
    }
  
    // Calculate allocation details per room
    const roomAllocations = roomRows.map(room => {
      const roomNo = room[1];
  
      // Count how many times the roomNo appears in the allocationRows
      const allocatedSeats = allocationRows.filter(allocation => allocation[1] === roomNo).length;
  
      // Return room allocation details
      return {
        roomNo,
        allocatedSeats,
        totalSeats: parseInt(room[2], 10) * parseInt(room[3], 10),
      };
    });
  
    return {
      totalRooms,
      totalSeats,
      totalStudents,
      courseCounts,
      roomAllocations,
    };
  }
  

  function renderAnalytics(analytics) {
    const analyticsContainer = document.getElementById("analytics-container");
    analyticsContainer.innerHTML = `
      <h2>Analytics</h2>
      <p>Total Rooms: ${analytics.totalRooms-1}</p>
      <p>Total Seats: ${analytics.totalSeats}</p>
      <p>Total Students: ${analytics.totalStudents-1}</p>
  
      <h3>Students per Course</h3>
      <ul>
        ${Object.entries(analytics.courseCounts).map(([course, count]) => {
          return count ? `<li>${course}: ${count}</li>` : '';  // Ensure count is valid before displaying
        }).join("")}
      </ul>
  
      <h3>Room Allocations</h3>
      <table>
        <thead>
          <tr>
            <th>Room No</th>
            <th>Allocated Seats</th>
            <th>Total Seats</th>
            <th>Seating Efficiency</th>
          </tr>
        </thead>
        <tbody>
          ${analytics.roomAllocations.map(room => {
            if (room.allocatedSeats !== undefined && room.totalSeats !== undefined && room.roomNo !== undefined) {
              const seatingEfficiency = (room.allocatedSeats / room.totalSeats) * 100;
              return `
                <tr>
                  <td>${room.roomNo}</td>
                  <td>${room.allocatedSeats}</td>
                  <td>${room.totalSeats}</td>
                  <td>${seatingEfficiency.toFixed(2)}%</td>
                </tr>
              `;
            } else {
              // Skip the room if either allocatedSeats or totalSeats is undefined
              return '';
            }
          }).join("")}
        </tbody>
      </table>
    `;
  }
  
  
  
});

