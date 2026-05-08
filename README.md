# 🖥️ Tubman University Computer Lab Inventory System

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey.svg)
![Stack](https://img.shields.io/badge/stack-Electron%20%7C%20React%20%7C%20NestJS-blueviolet.svg)
![Database](https://img.shields.io/badge/database-SQLite-003B57.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-In%20Development-orange.svg)

---

## 📋 Project Overview

The **Tubman University Computer Lab Inventory System** is a full-stack desktop
application built to modernize how the university manages its computer lab
equipment. It replaces manual paper-based tracking with a centralized,
role-based digital system that handles equipment records, borrowing workflows,
overdue management, and maintenance reporting — all from a single desktop
interface.

This project was developed as a final-year Computer Science capstone project
at Tubman University.

---

## ✨ Features

- 🔐 **Role-Based Access Control** — Admin, Technician, Faculty, and Student roles
- 📦 **Equipment Management** — Add, edit, track, and categorize lab equipment
- 🔄 **Checkout & Return System** — Full borrowing lifecycle with due dates
- 📝 **Student Request Workflow** — Students submit requests; admins approve or reject
- ⏰ **Overdue Detection** — Automatic flagging with reminder notifications
- 📊 **Reports & Analytics** — Utilization, loss/damage, and maintenance reports
- 📄 **PDF & Excel Export** — Export any report with one click
- 👤 **User Management** — Admin can create, edit, and manage all user accounts
- 🌙 **Modern UI** — Clean, responsive interface built with React + Tailwind CSS
- 💾 **Local SQLite Database** — No internet required; data stays on the machine

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Desktop Shell | Electron.js v41 | Wraps the web app as a native desktop app |
| Frontend | React.js v19 + TypeScript | User interface |
| Styling | Tailwind CSS | Utility-first CSS framework |
| Routing | React Router v6 | Client-side navigation |
| Backend | NestJS v10 + TypeScript | REST API server |
| Database | SQLite + TypeORM | Local persistent storage |
| Auth | JWT + Passport.js | Secure authentication |
| Charts | Recharts | Dashboard analytics |
| PDF Export | jsPDF + AutoTable | Report generation |
| API Docs | Swagger (dev only) | Interactive API documentation |

---

## 👥 Team

| Role | Member | Responsibilities | 
|------|--------|-----------------|
| 🧑‍💼 Project Lead | Princeton | Project management, architecture decisions, integration 
| 🎨 Frontend Developer | Regesrotph | React UI, routing, component design, Tailwind styling 
| ⚙️ Backend Developer | Philip | NestJS API, authentication, business logic 
| 🗄️ Database Engineer | Oliver | SQLite schema, TypeORM entities, migrations 
| 🧪 QA Engineer | Ernest | Testing, bug reporting, quality assurance 
| 🚀 DevOps | Alice | Electron packaging, build pipeline, deployment 

---

## 📅 Project Timeline

| Milestone | Date |
|-----------|------|
| Project Kickoff | March 30, 2026 |
| Requirements & SRS | April 6, 2026 |
| Backend API Complete | April 20, 2026 |
| Frontend UI Complete | April 28, 2026 |
| Integration & Testing | May 5, 2026 |
| Final Submission | May 7, 2026 |

---

## 🏗️ Project Structure
___
desktop-inventory/                ← GitHub repository root
├── README.md                     ← Project documentation (this file)
│
├── backend/                      ← NestJS REST API
│   ├── src/
│   │   ├── auth/                 ← JWT authentication module
│   │   ├── users/                ← User management module
│   │   ├── equipment/            ← Equipment CRUD module
│   │   ├── checkout/             ← Checkout management module
│   │   ├── checkout-requests/    ← Student request workflow
│   │   ├── entities/             ← TypeORM database entities
│   │   ├── guards/               ← JWT & roles guards
│   │   ├── strategies/           ← Passport JWT strategy
│   │   ├── decorators/           ← Custom decorators
│   │   ├── app.module.ts         ← Root NestJS module
│   │   └── main.ts               ← Entry point (runs on port 3000)
│   ├── dist/                     ← Compiled JS (auto-generated)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                     ← Electron + React application
│   ├── electron/                 ← Electron main process
│   │   ├── main.js               ← App entry, window & backend launcher
│   │   ├── preload.js            ← Secure Electron ↔ React bridge
│   │   └── splash.html           ← Loading screen on startup
│   ├── public/
│   │   ├── icon.png              ← Application icon
│   │   └── index.html            ← HTML entry point
│   ├── src/                      ← React source code
│   │   ├── components/           ← Reusable components (Navbar, etc.)
│   │   ├── pages/                ← Full pages (Dashboard, Login, etc.)
│   │   ├── App.js                ← Root component with routing
│   │   └── index.tsx             ← React entry point
│   ├── build/                    ← Compiled React (auto-generated)
│   ├── dist-installer/           ← Windows installer (auto-generated)
│   └── package.json              ← Frontend + Electron + build config
│
└── docs/                         ← Project documentation
├── SRS-Doc.pdf
├── Project-Plan.pdf
└── api-contract.md

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or higher → https://nodejs.org/en/download
- **npm** v9 or higher (comes with Node.js)
- **Git** → https://git-scm.com/downloads

Verify your installation:
```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show v9.x.x or higher
```

---

### Installation

**Step 1 — Clone the repository:**
```bash
git clone https://github.com/raccazahn/desktop-inventory.git
cd desktop-inventory
```

**Step 2 — Install backend dependencies:**
```bash
cd backend
npm install
```

**Step 3 — Install frontend + Electron dependencies:**
```bash
cd ../frontend
npm install
```

**Step 4 — Set up environment variables:**

Create a `.env` file inside `backend/` with the following:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h
DB_PATH=lab_inventory.db
```

---

### Running in Development

**Terminal 1 — Start the backend:**
```bash
cd backend
npm run start:dev
```
Backend runs at `http://localhost:3000`
Swagger API docs at `http://localhost:3000/api/docs`

**Terminal 2 — Start the Electron + React app:**
```bash
cd frontend
npm run electron:dev
```

---

### Building the Windows Installer

**Step 1 — Build the backend:**
```bash
cd backend
npm run build
```

**Step 2 — Build and package:**
```bash
cd frontend
npm run electron:build:win
```

Installer will be at:
frontend/dist-installer/DesktopInventory-Setup-0.1.0.exe

---

## 👤 User Roles & Access

| Role | Access Level | Description |
|------|-------------|-------------|
| **Admin** | Full Access | Manages users, equipment, checkouts, and reports |
| **Technician** | Partial Access | Manages equipment and checkout operations |
| **Faculty** | Limited Access | Views equipment and submits borrow requests |
| **Student** | Limited Access | Views available equipment and submits requests |

> 🔐 Login credentials are managed by your system administrator.
> Contact your lab admin to receive your account details.

---

## 🔌 API Overview

The backend runs on `http://localhost:3000`. Full interactive documentation
available in development at `http://localhost:3000/api/docs`.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /auth/login | Login and get JWT token | Public |
| GET | /users | Get all users | Admin |
| POST | /users | Create new user | Admin |
| GET | /equipment | Get all equipment | All roles |
| POST | /equipment | Add new equipment | Admin, Technician |
| PATCH | /equipment/:id | Update equipment | Admin, Technician |
| DELETE | /equipment/:id | Delete equipment | Admin |
| GET | /checkout | Get all checkouts | Admin, Technician |
| POST | /checkout | Create checkout | Admin, Technician |
| POST | /checkout-requests | Submit borrow request | Student, Faculty |
| PATCH | /checkout-requests/:id | Approve or reject request | Admin, Technician |

---

## 📸 Screenshots

> Screenshots will be added upon final release.

| Dashboard | Equipment Catalog |
|-----------|------------------|
| ![Dashboard](.docs/wirefime/Dashboard_Screen.png) | ![Equipment](.docs/wirefime/Equipment_Catalog.png) |

| Checkout System | Reports |
|----------------|---------|
| ![Checkout](.docs/wirefime/Checkout_form.png) | ![Reports](.docs/wirefime/Reports_page.png) |

---

## 🐛 Known Issues & Troubleshooting

| Problem | Solution |
|---------|----------|
| App shows "Backend did not start" | Make sure Node.js v18+ is installed |
| `npm install` fails with SyntaxError | Node.js version is too old — update to v20+ LTS |
| Port 3000 already in use | Run `taskkill /F /IM node.exe` then restart |
| SQLite error on first launch | Delete `lab_inventory.db` and restart to regenerate |
| White screen on startup | Wait for backend to fully load — first launch takes ~30s |

---

## 📚 Documentation

- [📄 SRS Document](./docs/SRS-Doc.pdf)
- [📅 Project Plan](./docs/Project-Plan.pdf)
- [🔌 API Contract](./docs/api-contract.md)
- [📖 User Manual](./docs/User-Manual.pdf)

---

## 🤝 Contributing

This is a university capstone project managed by the project team.

1. Create a branch: `git checkout -b feature/your-feature-name`
2. Commit changes: `git commit -m "feat: describe your change"`
3. Push branch: `git push origin feature/your-feature-name`
4. Open a Pull Request for team review

**Commit message format:**
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation update
- `style:` — UI or styling changes
- `refactor:` — Code restructure

---

## 📜 License

This project is licensed under the **MIT License**.
Developed for academic purposes at **Tubman University, Maryland Cunty, Liberia**.
© 2026 Tubman University CS Capstone Team. All rights reserved.

---

<div align="center">
  <strong>Built with ❤️ by the Tubman University Computer Science Students</strong><br/>
  <sub>Computer Science Department · May 2026</sub>
</div>