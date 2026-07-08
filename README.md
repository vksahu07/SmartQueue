# 🚀 SmartQueue - Queue Management System

SmartQueue is a modern, full-stack queue management application designed to efficiently handle customer check-ins, token generation, and live queue status tracking across multiple branches and departments. 

It consists of a high-performance **React + Vite** frontend styled with **Tailwind CSS** and a robust **Spring Boot + JPA** backend connected to a **Supabase PostgreSQL** database.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React (Vite template)
- **Styling:** Tailwind CSS (modern, glassmorphism, responsive, custom animations)
- **Icons:** Lucide React
- **Routing:** React Router DOM
- **Notifications:** React Hot Toast

### Backend
- **Framework:** Spring Boot (v3.4.1)
- **Data Access:** Spring Data JPA / Hibernate
- **Database:** PostgreSQL (Hosted on Supabase)
- **Server:** Embedded Apache Tomcat (running on port 8080)

---

## ✨ Key Features

- **Multi-Role Dashboards:** Separate user interfaces for **Customers**, **Staff Members**, and **Administrators** determined dynamically by database profiles.
- **Token Booking:** Customers can select branches, departments, and services to book virtual tokens, complete with real-time wait estimation.
- **Queue Manager Panel:** Staff can call the next ticket, mark tickets as serving or completed, and view active lists.
- **Admin Command Center:** System-wide diagnostics, metrics, department and staff creation tools, system configuration (capacity, operational hours), and a QR Scanner utility.
- **Live Sync Support:** Front-to-back integration representing live updates and positions.
- **Robust Connection Pooling:** Configured with HikariCP and `prepareThreshold=0` optimization to handle Supabase pgBouncer transaction pooling smoothly.

---

## 📁 Project Structure

```
SmartQueue/
├── backend/                  # Java Spring Boot Backend Service
│   ├── src/main/java/        # Java Source Files (Controllers, Models, Repositories)
│   ├── src/main/resources/   # Application properties & config
│   ├── pom.xml               # Maven Dependency Management
│   └── mvnw.cmd              # Maven Wrapper Executable
├── src/                      # React Frontend Source Code
│   ├── components/           # Reusable UI Components (Navbar, Sidebar, etc.)
│   ├── context/              # Context Providers (AuthContext, ThemeContext)
│   ├── pages/                # Individual Pages (Dashboards, Booking, Scanner)
│   └── App.jsx               # App routing and layout coordinator
├── package.json              # NPM dependencies & scripts
├── vite.config.js            # Vite configuration
└── tailwind.config.js        # Tailwind CSS styling design configuration
```

---

## 🚀 Setup & Execution Instructions

### Backend (Spring Boot)
1. **Requirements:** Make sure you have **Java 17 (or newer)** and **Maven** installed.
2. **Database:** Configure your PostgreSQL database URL in [application.properties](file:///c:/Users/91940/OneDrive/Desktop/JavaProjects/SmartQueue/backend/src/main/resources/application.properties):
   ```properties
   spring.datasource.url=jdbc:postgresql://<host>:6543/postgres?sslmode=require&prepareThreshold=0
   spring.datasource.username=<username>
   spring.datasource.password=<password>
   ```
3. **Run Backend:** Open a terminal in the `/backend` folder and run:
   ```bash
   # On Windows (PowerShell/CMD)
   .\mvnw.cmd spring-boot:run

   # On Linux/macOS
   ./mvnw spring-boot:run
   ```
   The backend server will run on `http://localhost:8080`.

### Frontend (React + Vite)
1. **Requirements:** Ensure **Node.js** is installed.
2. **Install Dependencies:** Run inside the root directory:
   ```bash
   npm install
   ```
3. **Run Dev Server:** Start the frontend application using:
   ```bash
   npm run dev
   ```
   The web portal will open on `http://localhost:5173`.

---

## 🔒 Default Logins for Evaluation

To test different portals, use the following pre-seeded database accounts (securely verified without override bypasses):

| Role | Email Address | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@smartqueue.com` | `password` |
| **Staff** | `staff@smartqueue.com` | `password` |
| **Customer** | `customer@smartqueue.com` | `password` |

*New customer accounts can also be created securely via the **Register** (`/register`) page.*
