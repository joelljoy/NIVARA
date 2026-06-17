# 🏥 NIVARA

NIVARA is a modern healthcare information and management platform designed to streamline patient care, medical record management, appointment scheduling, medication tracking, and health monitoring through a secure digital ecosystem.

The platform provides dedicated dashboards for patients, doctors, and administrators while ensuring secure access to healthcare records through role-based authorization and authentication mechanisms.

---

## ✨ Features

### 👨‍⚕️ Doctor Portal

* Doctor profile management
* Patient search and management
* Access request handling
* Patient health overview
* Clinical activity dashboard
* Appointment management
* Medical record access

### 🧑‍💼 Patient Portal

* Patient registration and profile management
* Personal healthcare dashboard
* Medical history tracking
* Vitals monitoring
* Medication management
* Appointment tracking
* Doctor access control

### 📅 Appointment Management

* Schedule appointments
* Track upcoming appointments
* Appointment history
* Doctor-patient coordination
* Appointment status management

### 💊 Medication Management

* Medication records
* Prescription tracking
* Treatment monitoring
* Medication history
* Patient medication dashboard

### ❤️ Vitals Monitoring

* Blood pressure records
* Heart rate monitoring
* Temperature tracking
* Health history visualization
* Patient wellness insights

### 📂 Medical Records Management

* Upload and manage records
* Organize patient documents
* Record search functionality
* Access control management
* Medical history storage
* Secure healthcare data management

### 🔐 Security Features

* JWT-based authentication
* Role-based access control (RBAC)
* Secure API endpoints
* Protected healthcare records
* Access monitoring
* Privacy-focused architecture

---

## 🏗️ Project Architecture

```text
NIVARA
│
├── Authentication Module
│   ├── Login
│   ├── Registration
│   ├── JWT Authentication
│   └── Role Management
│
├── Patient Module
│   ├── Patient Profiles
│   ├── Medical History
│   ├── Vitals Tracking
│   └── Medication Records
│
├── Doctor Module
│   ├── Doctor Dashboard
│   ├── Patient Management
│   ├── Access Requests
│   └── Clinical Overview
│
├── Appointment Module
│   ├── Scheduling
│   ├── Upcoming Appointments
│   ├── Appointment History
│   └── Status Management
│
└── Medical Records Module
    ├── Record Storage
    ├── Record Search
    ├── Secure Access
    └── Patient History
```

---

## 🚀 Tech Stack

### Frontend

* React
* TypeScript
* Vite
* React Router

### Backend

* NestJS
* Node.js
* TypeScript

### Database

* PostgreSQL

### Authentication & Security

* JWT Authentication
* Role-Based Access Control

### API Development

* REST APIs
* NestJS Modular Architecture

---

## 📁 Project Structure

```text
src/
│
├── auth/
│
├── users/
│
├── patients/
│
├── doctors/
│
├── appointments/
│
├── medications/
│
├── vitals/
│
├── records/
│
└── database/
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/joelljoy/NIVARA.git
```

### Navigate to Project

```bash
cd NIVARA
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create:

```text
.env
```

Add database and authentication credentials.

### Start Development Server

```bash
npm run start:dev
```

Application will run at:

```text
http://localhost:3000
```

---

## 🛠️ Build for Production

```bash
npm run build
```

Run production server:

```bash
npm run start:prod
```

---

## 🔮 Future Enhancements

* AI Health Assistant
* OCR Medical Report Processing
* Telemedicine Integration
* E-Prescription Management
* Blockchain-Based Record Verification
* Wearable Device Integration
* Predictive Health Analytics
* Multi-Hospital Interoperability

---

## 🎯 Use Cases

* Hospitals
* Clinics
* Healthcare Providers
* Diagnostic Centers
* Patients
* Telemedicine Platforms

---

## 📸 Screens Included

* Authentication System
* Doctor Dashboard
* Patient Dashboard
* Appointment Management
* Medication Management
* Vitals Tracking
* Medical Records Module

---


