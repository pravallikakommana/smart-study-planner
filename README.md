# 📚 Smart Study Planner

## 💡 Project Overview
Smart Study Planner is a web application that automatically generates personalized study plans based on subjects, difficulty levels, study hours, and exam dates. It also tracks completed and pending tasks and carries unfinished tasks into the next plan.

---

## 🚀 Features
- Automatic study plan generation
- Daily and Exam mode scheduling
- Subject-wise time distribution
- Pending task tracking system
- Carry forward incomplete tasks to next plan
- Save and view study history
- Task completion marking system

---

## 🛠 Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Python (Flask)
- Database: Firebase Firestore
- API Communication: REST APIs

---

## 📁 Project Structure
frontend/
- index.html
- login.html
- register.html
- dashboard.html
- script.js
- style.css

backend/
- app.py
- requirements.txt
- planner/
  - algorithm.py
  - __init__.py

---

## ⚙️ How It Works
1. User logs in and adds subjects
2. System generates study plan based on inputs
3. Backend distributes time based on difficulty
4. User marks completed tasks
5. Pending tasks are carried to next plan automatically

---

## 🔥 API Endpoints
- /generate → Generate study plan
- /save → Save plan
- /history → Get previous plans
- /update → Update task status

---

## 📌 Note
This project is still in development and deployment phase. Live version will be added after hosting setup.

---

## ⭐ Status
Working prototype with full backend logic and frontend integration
