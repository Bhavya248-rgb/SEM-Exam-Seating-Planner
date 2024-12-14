# SEM-Exam-Seating-Planner
Seating Planner Web App Documentation 
Project Overview 
The Seating Planner Web App is designed to streamline the management of seating 
arrangements for exams. It provides different portals for Admin, Students, and 
Invigilators, each with specific features tailored to their role. The app allows the Admin 
to upload data, manage room assignments, send notifications, and analyze seating 
data. Students can view their upcoming exams and seating arrangements, while 
Invigilators can manage their invigilation schedules and attendance. 
Technologies Used 
Frontend: HTML, CSS, JavaScript 
Backend: Firebase (for user authentication, data storage, and notifications) 
User Roles and Flow 
1. Index Page 
The index page provides three options: Admin, Student, and Invigilator. 
Clicking on any role redirects the user to a login page. 
Users must enter their email and password to log in. 
Based on the user role, they are redirected to their respective portal (Admin Portal, 
Student Portal, or Invigilator Portal). 
Admin Portal 
Dashboard: 
Displays the seating planner for students and invigilators. 
Provides analytics related to seating arrangements, exam schedules, and room 
management. 
Side Navbar Options 
Room Management: Admin can upload and view room assignments, student details, 
and invigilator assignments. 
Upload Files: Admin can upload files for room assignments, student seating details, 
and invigilator schedules. 
Notifications: Admin can send notifications to both students and invigilators regarding 
seating arrangements and exam schedules. 
Settings: Admin can set custom preferences such as exam schedule formats or seating 
preferences. 
Profile: Admin can view and manage their profile details. 
Student Portal 
Dashboard 
Displays the upcoming exams, including seating arrangements for each exam. 
Students can view which seat they are assigned to and any special instructions for the 
exam. 
Notifications 
Students can see notifications sent by the Admin regarding seating arrangements or 
changes in exam schedules. 
Profile 
Students can view and manage their profile details (email, name, etc.). 
Invigilator Portal 
Dashboard 
Displays the invigilator's exam schedule, showing which exams they are assigned to 
invigilate. 
Exam Tools 
Includes tools like a QR Scanner for recording attendance of students during the exam. 
Notifications 
Invigilators receive notifications from the Admin regarding invigilation schedules, exam 
instructions, and other updates. 
Profile 
Invigilators can view and manage their personal details (email, name, etc.). 
Navbar Functionality 
The side navbar is adjustable, allowing users to expand or minimize it based on their 
preference. 
This feature enhances the user experience by allowing more space when needed. 
Key Features 
Role-Based Access: The app provides a role-based experience with separate portals for 
Admin, Student, and Invigilator. 
File Upload and Room Management: Admins can upload and manage files related to 
rooms, students, and invigilators. 
Notifications: The Admin can send notifications to students and invigilators, ensuring 
that all parties are up to date. 
QR Attendance: Invigilators have access to a QR scanner to record student attendance 
during the exam. 
Profile Management: Each user can view and manage their profile details. 
Tech Stack 
Frontend: 
HTML for the structure of the pages 
CSS for styling and layout 
JavaScript for dynamic features such as navbar resizing and notifications 
Backend: 
Firebase Authentication for user login and authentication 
Firebase Firestore for storing user data (student, invigilator, admin) 
Firebase Cloud Messaging for sending real-time notifications 
User Stories 
Admin 
As an Admin, I want to upload files for room and invigilator assignments so that I can 
manage the exam arrangements easily. 
As an Admin, I want to send notifications to students and invigilators so that they are 
aware of any changes in the seating arrangement or schedules. 
As an Admin, I want to view seating and invigilation data and analyze the exam setup 
through a dashboard. 
Student 
As a Student, I want to view my seating arrangements and upcoming exams so that I 
can be prepared for the exam. 
As a Student, I want to receive notifications regarding any changes to seating or exam 
schedules. 
As a Student, I want to update my profile with my details. 
Invigilator 
As an Invigilator, I want to see my invigilation schedule so that I can prepare for my 
duties. 
As an Invigilator, I want to use a QR scanner to mark student attendance. 
As an Invigilator, I want to receive notifications about invigilation updates. 
Future Improvements 
Automated Room Allocation: Implement an algorithm to automatically assign rooms to 
students based on available capacity. 
Attendance Verification: Add functionality to verify student attendance based on face 
recognition or biometric data. 
Advanced Analytics: Implement detailed reports and insights for Admins on room 
utilization, exam schedules, and student attendance. 
Conclusion 
This web app simplifies exam seating management by providing intuitive portals for 
Admins, Students, and Invigilators. It leverages Firebase for user authentication, real
time data storage, and notifications, creating an efficient and streamlined experience for all users involved
