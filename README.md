# Scalable Task Management System (Full-Stack)

This project was developed as a technical assignment for the **Backend Developer (Intern)** position. It features a secure, scalable REST API with Role-Based Access Control (RBAC) and a React-based frontend.

## 🚀 Live Demo
* **Frontend:** `https://primetrade-ai-1-2r5g.onrender.com`
* **Backend:** `https://primetrade-ai-8z46.onrender.com`

---

## ✅ Core Features Implemented
* **Authentication:** Secure user registration and login using **JWT (JSON Web Tokens)** and **bcrypt** for password hashing.
* **Role-Based Access (RBAC):** Middleware-driven access control distinguishing between `User` and `Admin` roles.
* **CRUD Operations:** Full Create, Read, Update, and Delete functionality for a secondary "Tasks" entity.
* **Input Validation:** Server-side sanitization and validation to prevent SQL injection and ensure data integrity.
* **API Versioning:** All endpoints are structured under `/api/v1/` for better maintainability.

---

## 🛠️ Tech Stack
* **Backend:** Node.js, Express.js.
* **Database:** MySQL (Hosted on Aiven).
* **Frontend:** React.js (with React Router & Hooks).
* **Security:** JWT, Bcrypt, CORS.

---

## 📂 Project Structure
```text
├── backend/
│   ├── app.js            # Main server and API routes
│   └── .env              # Environment variables (DB Credentials, JWT Secret)
├── frontend/
│   ├── src/
│   │   ├── components/   # ProtectedRoute, Login, Register, Dashboard
│   │   └── App.jsx       # Routing logic
└── README.md
```

# 📈 Scalability Note
To ensure this system can handle high traffic and growing data, the following strategies are proposed:

- **Caching**: Implement Redis for frequently accessed data (like user sessions) to reduce database latency.  
- **Load Balancing**: Deploy backend instances behind an Nginx load balancer to distribute traffic.  
- **Database Optimization**: Use connection pooling (already implemented) and index specific columns like `user_id` for faster queries.  
- **Containerization**: Use Docker to ensure consistent environments across development and production.  

---

# 📖 API Documentation
You can find the Postman Collection link below to test the endpoints:

[Postman Collection Link
](https://malayakumarpradhan716-6986272.postman.co/workspace/916d73d8-c361-4ae5-8f02-c9cebf7f6810/collection/53372938-ce4cf25e-8811-4083-82a5-e34136dc9f3d?action=share&source=copy-link&creator=53372938)
---

# ⚙️ How to Run Locally
1. **Clone the repository.**  
2. **Install dependencies:**  
   ```bash
   npm install
   Run this in both /backend and /frontend.
3. **Set up your .env file with:**
- **DB_HOST**
- **DB_USER**
- **DB_PASSWORD**
- **MY_SECRET_TOKEN**
4. **Start the backend:**
  ```bash
  node app.js
  ```
5. **Start the frontend:**
  ```bash
  npm run dev


