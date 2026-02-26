# Job Portal Backend API

## 📌 Project Overview

This project is a complete backend API for a Job Portal similar to Naukri.com.

It supports:
- Job Seeker registration and profile management
- Employer registration and job posting
- Job applications and tracking
- Skill management and skill-based matching
- Saved jobs and job alerts
- Messaging system
- Company reviews
- Analytics
- Subscription plans

Built using Node.js, Express.js, and SQLite.

---

## Tech Stack

- Node.js
- Express.js
- SQLite
- JWT (Authentication)
- bcrypt (Password Hashing)

---

## Project Structure

```
job-portal-backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── app.js
├── database/
│   ├── schema.sql
│   ├── seeds.sql
│   └── jobportal.db
├── .gitignore
├── package.json
└── README.md
```

---

## Setup Instructions

### 1️⃣ Clone Repository

```
git clone <repository-url>
cd job-portal-backend
```

### 2️⃣ Install Dependencies

```
npm install
```

### 3️⃣ Start Server

```
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---

## Authentication

- JWT-based authentication
- Token expiry: 1 hour
- Role-based access control:
  - jobseeker
  - employer

Protected routes require:

```
Authorization: Bearer <token>
```

---

## Database Design

The system includes the following entities:

- Users
- Job Seeker Profiles
- Companies
- Employers
- Jobs
- Applications
- Skills
- User Skills
- Job Skills
- Work Experience
- Education
- Saved Jobs
- Job Alerts
- Messages
- Company Reviews
- Analytics (profile_views, job_views)
- Subscription Plans

All relationships are maintained using foreign keys.

Schema is defined in:

```
database/schema.sql
```

Sample seed data is provided in:

```
database/seeds.sql
```

---

## Features Implemented

### Authentication
- Job Seeker Registration
- Employer Registration
- Login with JWT

### Job Seeker
- Profile Management
- Add Work Experience
- Add Education
- Add Skills
- Apply to Jobs
- Save Jobs
- Job Alerts
- View Analytics

### Employer
- Post Jobs
- View Posted Jobs
- View Applications
- Update Application Status
- Search Candidates
- View Job Analytics

### General Features
- Messaging System
- Company Reviews
- Duplicate Application Prevention
- Role-based Authorization
- Input Validation
- Error Handling with Proper HTTP Codes

---

## Security Measures

- Password hashing using bcrypt
- JWT authentication
- Parameterized SQL queries (SQL injection prevention)
- Unique constraints to prevent duplicates
- Role-based middleware protection

---

## Analytics

- Profile Views
- Job Views
- Application Conversion Rate
- Shortlisted Candidates Count

---

## ⚠ Assumptions

- Resume upload simplified for assignment
- Skill matching uses basic matching logic
- Analytics simplified for demonstration
- Email notifications simulated

---

## Future Improvements

- AI-based job recommendations
- Resume parsing with NLP
- Email notification service
- Payment gateway for subscriptions
- Advanced filtering and search optimization

---

## Developed By

Harini
