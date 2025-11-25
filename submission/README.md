# Full-Stack Contact Management System

A simple full-stack web application built using **React**, **Node.js**, **Express**, and **MySQL**.  
Users can register, log in, and submit messages.  
Admins can log in and view all submitted messages through an admin dashboard.

## 📌 Project Objective

Create a minimal full-stack system where:
- Users register and log in
- Contact form auto-fills user name & email after login
- Messages are stored in a database
- Admin can view all stored messages

This completes the requirements of a working MVP (Minimum Viable Product).

## 🧱 Tech Stack

### Frontend
- React (Vite)
- Axios
- sessionStorage authentication

### Backend
- Node.js
- Express
- MySQL2
- JWT Authentication
- Bcrypt password hashing
- Helmet, CORS, XSS-clean, express-rate-limit

### Database
- MySQL with two tables: users and contacts

## 📁 Folder Structure

AI_assisted_project/
│
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── .env
│   ├── package.json
│   ├── sql-schema.sql
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── Login.jsx
│       ├── Register.jsx
│       ├── UserPanel.jsx
│       └── AdminPanel.jsx
│
└── submission/

## 🚀 How to Run the Project

### Backend Setup
cd backend
npm install
cp .env.example .env

Edit .env with:
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=contactdb
JWT_SECRET=yourstrongsecret

Create database tables:
mysql -u root -p < sql-schema.sql

Start backend:
npm run dev

Backend runs on: http://localhost:4000

### Frontend Setup
cd frontend
npm install
npm run dev

Open in browser: http://localhost:5173

## 🧪 Application Workflow

✔ First Launch  
✔ Registration  
✔ Login  
✔ User Panel  
✔ Admin Panel  

## 🔐 Security Features

- Password hashing (bcryptjs)
- JWT authentication
- Helmet
- XSS filtering
- Rate limiting
- Protected admin routes

## 📦 Submission Folder Structure

submission/
│
├── source_code/
│    ├── backend/
│    └── frontend/
│
├── README.md
├── ai_notes.txt
└── sample_output/

## 👨‍💻 AI Assistance Notes

AI was used to generate backend + frontend code, solve issues, and prepare documentation.  
Manual corrections include .env updates, DB fixes, and UI adjustments.

## ✔ Status

Project fully completed and ready for submission.

## 👤 Team

N.Chanakya,B.Dinesh,Jeshwith
