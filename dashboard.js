import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

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

    const allocations = [];
    const invigilatorAllocations = [];  // Array to store invigilator allocations

    for (const plannerId in plannerData) {
      const roomFile = plannerData[plannerId].files.roomFile.content;
      const studentFile = plannerData[plannerId].files.studentFile.content;

      // Decode Base64 CSV files
      const roomData = atob(roomFile).split("\n").map(row => row.split(","));
      const studentData = atob(studentFile).split("\n").map(row => row.split(","));

      // Debug log to check roomData and studentData
      console.log('Room Data:', roomData);
      console.log('Student Data:', studentData);

      // Parse headers and rows
      const roomHeaders = roomData[0];
      const roomRows = roomData.slice(1);
      const studentHeaders = studentData[0];
      const studentRows = studentData.slice(1);

      // Sort Rooms and Students
      roomRows.sort((a, b) => a[0].localeCompare(b[0]) || a[1] - b[1]);
      studentRows.sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]) || a[2] - b[2] || a[3] - b[3]);

      // Initialize room matrices
      const roomMatrices = roomRows.map(room => {
        const [block, roomNo, benches, studentsPerBench, rows, cols] = room.map(Number.isNaN(Number) ? x => x : x => parseInt(x));
        return {
          block,
          roomNo,
          benches,
          studentsPerBench,
          rows,
          cols,
          matrix: Array.from({ length: rows }, () => Array(cols).fill(null))
        };
      });

      // Allocate Students to Rooms
      for (const student of studentRows) {
        const [date, course, classNumber, studentID, disability] = student;
        let allocated = false;

        for (const room of roomMatrices) {
          if (allocated) break;

          const { rows, cols, matrix } = room;

          // Allocate student of the same course with a column difference
          for (let colIndex = 0; colIndex < cols; colIndex += 2) {
            if (allocated) break;

            for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
              if (matrix[rowIndex][colIndex] === null) {
                matrix[rowIndex][colIndex] = { studentID, course, date };
                allocations.push({
                  block: room.block,
                  roomNo: room.roomNo,
                  studentID,
                  course,
                  date,
                  row: rowIndex + 1,  // 1-based row index
                  col: colIndex + 1   // 1-based column index
                });
                allocated = true;
                break;
              }
            }
          }

          // Fill gaps with other course students if necessary
          if (!allocated) {
            for (let colIndex = 1; colIndex < cols; colIndex += 2) {
              for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
                if (matrix[rowIndex][colIndex] === null) {
                  matrix[rowIndex][colIndex] = { studentID, course, date };
                  allocations.push({
                    block: room.block,
                    roomNo: room.roomNo,
                    studentID,
                    course,
                    date,
                    row: rowIndex + 1,
                    col: colIndex + 1,
                  });
                  allocated = true;
                  break;
                }
              }
              if (allocated) break;
            }
          }
        }

        if (!allocated) {
          console.warn(`Could not allocate student ${studentID}`);
        }
      }

      // Allocate Invigilators to Rooms
      roomMatrices.forEach((room) => {
        const { block, roomNo, rows, cols } = room;
        const invigilatorID = `${roomNo}`;  // Assign invigilator ID based on room number
        const invigilatorDate = new Date().toISOString().split('T')[0];  // Assign today's date for invigilator

        invigilatorAllocations.push({
          block,
          roomNo,
          invigilatorID,
          date: invigilatorDate
        });
      });

      // Save the allocation table to Firebase
      const allocationFile = generateCSV(allocations);
      const base64AllocationFile = btoa(allocationFile);  // Convert to Base64

      const allocationRef = ref(db, `planners/${plannerId}/files/allocationFile`);
      update(allocationRef, {
        content: base64AllocationFile
      }).then(() => {
        console.log('Allocation file saved successfully');
      }).catch((error) => {
        console.error('Error saving allocation file:', error);
      });

      // Save invigilator allocation file to Firebase
      const invigilatorAllocationFile = generateInvigilatorCSV(invigilatorAllocations);
      const base64InvigilatorAllocationFile = btoa(invigilatorAllocationFile);  // Convert to Base64

      const invigilatorAllocationRef = ref(db, `planners/${plannerId}/files/invigilatorAllocationFile`);
      update(invigilatorAllocationRef, {
        content: base64InvigilatorAllocationFile
      }).then(() => {
        console.log('Invigilator allocation file saved successfully');
      }).catch((error) => {
        console.error('Error saving invigilator allocation file:', error);
      });

      // Render allocations to the dashboard
      renderAllocations(allocations);
      renderInvigilatorAllocations(invigilatorAllocations)

    }
  });

  function generateCSV(data) {
    const header = ['Block', 'Room No', 'Student ID', 'Course', 'Date', 'Row', 'Column'];
    const rows = data.map(allocation => [
      allocation.block,
      allocation.roomNo,
      allocation.studentID,
      allocation.course,
      allocation.date,
      allocation.row,
      allocation.col
    ]);

    // Convert rows into CSV format
    const csvContent = [header, ...rows].map(row => row.join(',')).join("\n");
    return csvContent;
  }

  function generateInvigilatorCSV(data) {
    const header = ['Block', 'Room No', 'Invigilator ID', 'Date'];
    const rows = data.map(allocation => [
      allocation.block,
      allocation.roomNo,
      allocation.invigilatorID,
      allocation.date
    ]);

    // Convert rows into CSV format
    const csvContent = [header, ...rows].map(row => row.join(',')).join("\n");
    return csvContent;
  }

  function renderAllocations(allocations) {
    const tableBody = document.querySelector("#allocations-table tbody");
    tableBody.innerHTML = "";

    allocations.forEach(allocation => {
      const row = document.createElement("tr");
      Object.values(allocation).forEach(value => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });
      tableBody.appendChild(row);
    });
  }

  function renderInvigilatorAllocations(invigilatorAllocations) {
    const tableBody = document.querySelector("#invigilator-allocations-table tbody");
    tableBody.innerHTML = "";

    invigilatorAllocations.forEach(allocation => {
      const row = document.createElement("tr");
      Object.values(allocation).forEach(value => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });
      tableBody.appendChild(row);
    });
}

});
