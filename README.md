# 🏛️ Scheme Hub - Government Schemes Discovery & Recommendation Platform

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

An intelligent, full-stack Gov-Tech platform inspired by the official **[myScheme.gov.in](https://www.myscheme.gov.in/)** portal. Scheme Hub connects Indian citizens to Central & State Government welfare schemes through a **dynamic Spring Expression Language (SpEL) eligibility rule engine**, multi-stage application progress tracking, and automated batch ingestion pipelines.

---

## 🌟 Key Features

* **🧠 Dynamic SpEL Profile Matching Engine**:
  * Evaluates citizen demographics (Age, Gender, State, Annual Income, Occupation, Caste, Disability, etc.) against relational eligibility criteria.
  * Generates match percentage scores (**100% Eligible**, **75% Potentially Eligible**, **0% Ineligible**).
  * Provides a transparent **"Why Am I Eligible?"** assessment drawer detailing passed (✓), missing (⚠️), and failed (✗) criteria.
* **💰 Dynamic SpEL Benefit Calculator**:
  * Real-time benefit computation using SpEL expressions (e.g. `#annualIncome < 150000 ? 25000 : 15000`).
* **🔄 Dual Automated Scheme Ingestion Pipeline**:
  * **Bulk File Ingestion (CSV / JSON)**: Transactional batch importing (`@Transactional`) with schema validation and auto-creation of SpEL rules and document checklists.
  * **Automated Cron Feed Daemon (`@Scheduled`)**: Nightly background worker (`0 0 2 * * ?`) that polls welfare releases, prevents duplicates, stages new schemes into a `NEEDS_REVIEW` audit queue, and notifies administrators.
* **📋 Application Lifecycle Tracker & Document Verification**:
  * 6-stage interactive timeline stepper: `SAVED` ➔ `PLANNING` ➔ `STARTED` ➔ `SUBMITTED` ➔ `VERIFICATION` ➔ `APPROVED / REJECTED`.
  * Mandatory document upload checklist matching user files against scheme requirements.
* **⚖️ Side-by-Side Scheme Comparison Matrix**:
  * Multi-scheme selector to compare benefits, eligibility rules, and required documents in a side-by-side table.
* **🌐 Trilingual UI & Gov-Tech Accessibility**:
  * Complete trilingual support: **English**, **हिन्दी (Hindi)**, and **தமிழ் (Tamil)**.
  * Light / Dark Theme toggle with persistent state.
  * Indian Government Web Guidelines (GIGW) compliant font size resizers (**A-**, **A**, **A+**).
* **🔐 Role-Based Access Control (RBAC)**:
  * Secure stateless JWT authentication for `ROLE_USER` (Citizens), `ROLE_SCHEME_MANAGER` (Department Nodal Officers), and `ROLE_ADMIN` (System Administrators).

---

## 🏗️ Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                         │
│   • React 18 (JSX)           • Bootstrap 5 Gov-Tech Theme tokens       │
│   • Lucide React Icons       • Axios with Request/Response Interceptor │
│   • Light & Dark Modes       • Responsive Design & GIGW Accessibility  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ REST API (JWT Authenticated)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Spring Boot 3 + Java)                    │
│   • Spring Boot 3.3.x        • Spring Security 6 (Stateless JWT)       │
│   • Spring Data JPA          • Spring Expression Language (SpEL Engine)│
│   • Spring @Scheduled Cron   • Hibernate ORM                           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ JDBC / JPA
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                           DATABASE (MySQL 8)                           │
│   • 31+ Pre-Seeded Schemes   • Relational Eligibility Rules Table      │
│   • Mandatory Documents      • Citizen Applications & User Documents   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
* **Java**: JDK 17 or JDK 21+
* **Node.js**: v18+ & npm
* **MySQL Database**: v8.0+
* **Maven**: v3.8+ (or use IDE bundled Maven)

---

### 1. Database Setup

Create a MySQL database named `schemehub_db`:

```sql
CREATE DATABASE schemehub_db;
```

Update your MySQL credentials in `scheme-backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/schemehub_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
```

---

### 2. Backend Setup (Spring Boot)

```bash
cd scheme-backend
mvn clean install
mvn spring-boot:run
```

* Backend runs at: `http://localhost:8080`
* On first run, `DatabaseSeeder.java` automatically populates the database with **31 Central & State schemes**, default admin, scheme manager, and citizen accounts.

**Default Test Credentials:**
| Role | Username | Password |
| :--- | :--- | :--- |
| **System Admin** | `admin` | `admin123` |
| **Scheme Manager** | `manager` | `manager123` |
| **Citizen (User)** | `citizen` | `citizen123` |

---

### 3. Frontend Setup (React + Vite)

```bash
cd scheme-frontend
npm install
npm run dev
```

* Frontend runs at: `http://localhost:5173`

---

## 📂 Project Structure

```
scheme-project/
├── scheme-backend/               # Spring Boot Backend Application
│   ├── src/main/java/com/schemehub/backend/
│   │   ├── config/               # Security, JWT, Seeder, Web Configurations
│   │   ├── controller/           # REST Controllers (Auth, Scheme, Admin, Application, etc.)
│   │   ├── dto/                  # Data Transfer Objects
│   │   ├── entity/               # JPA Relational Entities
│   │   ├── exception/            # Global Exception Handlers
│   │   ├── repository/           # Spring Data JPA Repositories
│   │   └── service/              # Core Services (SpEL Engine, Ingestion, In-App Notifications)
│   └── src/main/resources/
│       └── application.properties# Backend Configuration & Database Connection
│
├── scheme-frontend/              # React + Vite Frontend Application
│   ├── public/                   # Static Assets & Batch JSON Templates
│   └── src/
│       ├── components/           # Navbar, Footer, UI Widgets
│       ├── context/              # Auth, Language, and Accessibility Contexts
│       ├── pages/                # Landing, Search, Recommendations, Profile, Compare, Admin
│       ├── App.jsx               # Application Root Routing
│       └── index.css             # myScheme Gov-Tech Design Tokens & Dark Theme
└── README.md
```

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
