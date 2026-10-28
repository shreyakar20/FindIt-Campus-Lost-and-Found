# 🧭 FindIt — Campus Lost & Found Portal

> A modern, responsive, full-stack web application designed for college campuses to help students report lost belongings, list found items, and reunite owners with their lost valuables.

[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Express%20%7C%20MongoDB-blue.svg)](#tech-stack)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-green.svg)](https://www.mongodb.com/atlas)
[![Frontend](https://img.shields.io/badge/Frontend-Vite%20%2B%20React%2018-purple.svg)](https://vitejs.dev/)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-brightgreen.svg)](#)

---

## 📌 Links & Live Deployment
* **Live Web Portal**: `https://findit-campus-frontend.vercel.app` *(Placeholder - add your link upon Vercel deploy)*
* **Backend REST API**: `https://findit-campus-backend.vercel.app` *(Placeholder - add your link upon Vercel deploy)*
* **GitHub Repository**: `https://github.com/<your-username>/findit-campus-portal` *(Placeholder)*

---

## 📖 Table of Contents
1. [Problem Statement](#1-problem-statement)
2. [Proposed Solution](#2-proposed-solution)
3. [Key Features](#3-key-features)
4. [Technology Stack](#4-technology-stack)
5. [System Architecture](#5-system-architecture)
6. [Folder Structure](#6-folder-structure)
7. [Database Schema (MongoDB Mongoose)](#7-database-schema-mongodb-mongoose)
8. [RESTful API Endpoints](#8-restful-api-endpoints)
9. [Prerequisites](#9-prerequisites)
10. [Local Installation & Setup Guide](#10-local-installation--setup-guide)
11. [MongoDB Atlas Cloud Database Setup](#11-mongodb-atlas-cloud-database-setup)
12. [Seeding Initial Campus Data](#12-seeding-initial-campus-data)
13. [Vercel Deployment Guide](#13-vercel-deployment-guide)
14. [Testing & Verification](#14-testing--verification)
15. [Screenshots & UI Previews](#15-screenshots--ui-previews)
16. [Future Enhancements](#16-future-enhancements)

---

## 1. Problem Statement
On busy college campuses, students frequently misplace essential personal belongings—such as student IDs, laptops, chargers, textbooks, keys, and wallets. Current campus lost & found solutions rely on scattered WhatsApp/Telegram groups, physical notice boards, or overcrowded student union front desks. These methods suffer from:
* **Low Visibility**: Reports get buried under chat messages or unread bulletin boards.
* **Lack of Categorization**: Searching for a specific item (e.g., "AirPods" or "Dorm Key") is tedious.
* **No Real-Time Status**: Listings remain unaddressed even after items are returned, leading to confusion.
* **No Centralized Record**: Security and administration have no single source of truth for lost campus property.

---

## 2. Proposed Solution
**FindIt** provides a centralized, mobile-responsive web portal dedicated to campus lost and found tracking:
* Allows students to quickly log lost items or list items they found.
* Provides real-time dashboard analytics (Total items, Lost items, Found items, Reunited items).
* Empowers students with instant search (by title, description, or campus location) and status/category filters.
* Facilitates one-click status updates to **"Returned"** once an item has been handed back to its owner.
* Fully cloud-backed using **MongoDB Atlas**, with a RESTful Express backend and high-performance React (Vite) interface.

---

## 3. Key Features
* 📊 **Dynamic Dashboard Statistics**: Real-time counts for Total, Lost, Found, and Returned items calculated directly from the database.
* 📝 **Report an Item Modal**: Clean form with validation for item name, type (Lost/Found), category, location, date, contact details, and description.
* 🔍 **Real-Time Search & Multi-Filter**: Search by keywords and filter by status (`All`, `Lost`, `Found`, `Returned`) and category (`Electronics`, `Documents/ID Cards`, `Books`, `Accessories`, `Clothing`, `Other`).
* 🏷️ **Visual Status Badges**:
  * 🔴 **Lost**: Highlighted in soft coral/rose.
  * 🟢 **Found**: Highlighted in soft emerald green.
  * 🟣 **Returned**: Highlighted in lavender with a verification badge.
* ✏️ **Edit & Update Listing**: Modify item details, update locations, or adjust status as circumstances change.
* ✅ **Quick Mark as Returned**: One-click action to mark items as reunited with their rightful owner.
* 🗑️ **Delete with Confirmation Dialog**: Protected deletion preventing accidental record loss.
* 📱 **Fully Responsive Design**: Optimized for smartphones, tablets, and desktop displays with smooth animations and pastel aesthetics.
* ☁️ **MongoDB Atlas Integration**: Cloud data persistence (no mock or localStorage data).

---

## 4. Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 | Functional components with Hooks (`useState`, `useEffect`, `useCallback`) |
| **Build Tool** | Vite 6 | Instant hot-reloading and lightning-fast production bundle compilation |
| **Styling** | Custom CSS3 | Pastel blue, lavender, light grey color scheme; fully responsive grid & flexbox |
| **Iconography** | Lucide React | Lightweight, consistent SVG icon system |
| **Backend Framework** | Node.js + Express.js | Modular REST API with JSON middleware, CORS, and error handlers |
| **Database** | MongoDB Atlas | Cloud-hosted NoSQL database with Mongoose ODM modeling and schema validation |
| **Hosting & Deployment** | Vercel | Serverless Express API deployment & Static SPA frontend hosting |

---

## 5. System Architecture

```
┌────────────────────────────────────────────────────────┐
│               CLIENT / BROWSER (Vite + React)          │
│  - App.jsx (State Management & Fetch API)              │
│  - Reusable UI Components & Responsive CSS             │
└───────────────────────────┬────────────────────────────┘
                            │
               HTTP JSON Requests (CORS Enabled)
               [GET, POST, PUT, DELETE]
                            │
┌───────────────────────────▼────────────────────────────┐
│             EXPRESS REST API (Node.js Server)          │
│  - server.js (Middleware, Health Check, Route Mount)   │
│  - routes/items.js (CRUD Controllers & Validation)     │
└───────────────────────────┬────────────────────────────┘
                            │
                    Mongoose ODM Driver
                            │
┌───────────────────────────▼────────────────────────────┐
│            MONGODB ATLAS (Cloud Database)              │
│  - Database: "findit"                                  │
│  - Collection: "items"                                 │
└────────────────────────────────────────────────────────┘
```

---

## 6. Folder Structure

```
Find-it/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection logic & serverless cache
│   ├── models/
│   │   └── Item.js             # Mongoose Item Schema & validation
│   ├── routes/
│   │   └── items.js            # REST API endpoints (GET, POST, PUT, DELETE)
│   ├── .env.example            # Backend environment template
│   ├── .env                    # Local environment variables (ignored by git)
│   ├── package.json            # Backend dependencies & npm scripts
│   ├── seed.js                 # Database seeding script for sample items
│   ├── server.js               # Express application entry point
│   ├── test-api.js             # Unit verification test suite
│   ├── test-http.js            # HTTP endpoints integration test suite
│   └── vercel.json             # Vercel serverless deployment config
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmationDialog.jsx # Modal confirmation for item deletion
│   │   │   ├── DashboardStats.jsx     # Overview cards for counts
│   │   │   ├── EditItemForm.jsx       # Modal to edit item and update status
│   │   │   ├── EmptyState.jsx         # Friendly empty state display
│   │   │   ├── Hero.jsx               # Campus welcoming banner
│   │   │   ├── ItemCard.jsx           # Individual listing card with action buttons
│   │   │   ├── ItemForm.jsx           # Modal form to report lost/found items
│   │   │   ├── LoadingSpinner.jsx     # Animated loader
│   │   │   ├── Navbar.jsx             # Top bar with branding & API status
│   │   │   ├── SearchAndFilters.jsx   # Search query & category/status filters
│   │   │   └── Toast.jsx              # Floating feedback notification
│   │   ├── App.css                    # Modern pastel stylesheet & responsive rules
│   │   ├── App.jsx                    # Core application logic & API calls
│   │   ├── index.css                  # CSS reset, variables & base styles
│   │   └── main.jsx                   # React DOM root entry
│   ├── .env.example            # Frontend environment template
│   ├── .env                    # Local frontend environment (VITE_API_URL)
│   ├── index.html              # HTML5 entry with Google Fonts
│   ├── package.json            # Frontend dependencies & scripts
│   ├── vercel.json             # SPA rewrites config for Vercel
│   └── vite.config.js          # Vite config with dev API proxy
│
├── .gitignore                  # Git ignore rules for node_modules, .env, dist
├── package.json                # Root convenience scripts for running both
└── README.md                   # Full documentation & project guide
```

---

## 7. Database Schema (MongoDB Mongoose)

The `Item` collection is defined in `backend/models/Item.js`:

```javascript
{
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: 120
  },
  type: {
    type: String,
    required: [true, 'Item type is required'],
    enum: ['Lost', 'Found']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Electronics', 'Documents/ID Cards', 'Books', 'Accessories', 'Clothing', 'Other']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 1000
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    maxlength: 200
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  contact: {
    type: String,
    required: [true, 'Contact info is required'],
    maxlength: 150
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['Lost', 'Found', 'Returned'],
    default: 'Lost' // Automatically mirrors type on creation
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

---

## 8. RESTful API Endpoints

Base URL (Local): `http://localhost:5000`  
Base URL (Production): `https://<your-backend>.vercel.app`

| Method | Endpoint | Description | Query / Body Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status & DB connectivity | None |
| `GET` | `/api/items` | Retrieve all items with optional filters | `?search=macbook&status=Lost&category=Electronics` |
| `GET` | `/api/items/:id` | Retrieve single item by MongoDB ObjectId | URL param: `:id` |
| `POST` | `/api/items` | Create new Lost or Found item report | JSON Body with required fields |
| `PUT` | `/api/items/:id` | Update an existing item's fields or status | JSON Body with fields to update |
| `DELETE` | `/api/items/:id` | Permanently remove an item from database | URL param: `:id` |

### Sample `POST /api/items` Payload:
```json
{
  "itemName": "Blue Hydroflask 32oz",
  "type": "Lost",
  "category": "Accessories",
  "description": "Navy blue bottle with campus sticker on side",
  "location": "Recreation Gym Court 2",
  "date": "2026-10-28",
  "contact": "student@campus.edu | 555-0144",
  "status": "Lost"
}
```

### Sample `PUT /api/items/:id` (Mark as Returned):
```json
{
  "status": "Returned"
}
```

---

## 9. Prerequisites
Ensure you have the following installed on your machine:
* **Node.js** (v18.x or higher) -> [Download Node.js](https://nodejs.org/)
* **npm** (v9.x or higher)
* A free **MongoDB Atlas** account -> [Register MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
* A free **Vercel** account -> [Sign up on Vercel](https://vercel.com/)
* **Git** installed -> [Download Git](https://git-scm.com/)

---

## 10. Local Installation & Setup Guide

### Step 1: Clone or Navigate to the Project
```bash
cd Find-it
```

### Step 2: Install Dependencies
You can install dependencies for both frontend and backend using:
```bash
# Using root script:
npm run install:all

# Or manually:
cd backend && npm install
cd ../frontend && npm install
```

### Step 3: Configure Environment Variables

1. **Backend Environment**:
   Inside `backend/`, copy the example file:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Open `backend/.env` and insert your MongoDB Atlas URI:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/findit?retryWrites=true&w=majority
   PORT=5000
   ```

2. **Frontend Environment**:
   Inside `frontend/`, check `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

### Step 4: Run the Backend & Frontend

Open two terminal windows:

* **Terminal 1: Start Backend**
  ```bash
  cd backend
  npm run dev
  # Server will start on http://localhost:5000
  ```

* **Terminal 2: Start Frontend**
  ```bash
  cd frontend
  npm run dev
  # Vite dev server will start on http://localhost:5173
  ```

Open your browser and navigate to **`http://localhost:5173`**.

---

## 11. MongoDB Atlas Cloud Database Setup

Follow these exact steps to obtain your free cloud database:

1. **Sign in to MongoDB Atlas**:
   Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and sign in.
2. **Create a Free Cluster**:
   * Click **Build a Database**.
   * Choose the **M0 Free** shared tier.
   * Select a cloud provider (e.g. AWS) and a region nearest to you.
   * Click **Create Cluster**.
3. **Set Up Database Access (Credentials)**:
   * In the left sidebar, click **Security > Database Access**.
   * Click **Add New Database User**.
   * Authentication Method: **Password**.
   * Set a username (e.g. `findit_user`) and a secure password.
   * Role: **Read and write to any database**.
   * Click **Add User**.
4. **Configure Network Access (IP Whitelist)**:
   * In the left sidebar, click **Security > Network Access**.
   * Click **Add IP Address**.
   * Click **Allow Access from Anywhere** (`0.0.0.0/0`). *(Crucial for local testing and Vercel cloud serverless access).*
   * Click **Confirm**.
5. **Get Connection String**:
   * Navigate back to **Deployments > Database**.
   * Click the **Connect** button on your cluster.
   * Choose **Drivers** (Node.js).
   * Copy the connection string format:
     ```
     mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
     ```
   * Replace `<username>` and `<password>` with your database user credentials.
   * Add `/findit` right before the `?` query parameter:
     ```
     mongodb+srv://findit_user:YourSecretPass@cluster0.mongodb.net/findit?retryWrites=true&w=majority
     ```
6. Paste this complete string into your `backend/.env` as `MONGO_URI`.

---

## 12. Seeding Initial Campus Data

To populate your MongoDB Atlas database with realistic sample lost and found items (AirPods, Campus ID, Calculus Textbook, Wallet, etc.):

```bash
cd backend
npm run seed
```

Output:
```text
Connecting to MongoDB...
Connected successfully.
Cleared 0 existing items from database.
✅ Successfully seeded 8 sample items into MongoDB Atlas!
Database connection closed cleanly.
```

Refresh the web app at `http://localhost:5173` to see the populated listings and calculated statistics!

---

## 13. Vercel Deployment Guide

Deploying FindIt on Vercel takes 5 minutes by creating two projects in your Vercel Dashboard (one for the backend API and one for the frontend React app).

### Part A: Deploy the Backend (Express API)
1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com/) and click **Add New > Project**.
3. Import your GitHub repository (`findit-campus-portal`).
4. In the configuration screen:
   * **Root Directory**: Click *Edit* and select **`backend`**.
   * **Framework Preset**: Select **Other**.
5. Expand **Environment Variables**:
   * Add key `MONGO_URI` with your full MongoDB Atlas connection string.
   * Add key `PORT` with value `5000`.
6. Click **Deploy**.
7. Once deployed, note your backend URL (e.g., `https://findit-api.vercel.app`).
   * Test it by visiting `https://findit-api.vercel.app/api/health` in your browser. It should respond with `status: "healthy"`.

### Part B: Deploy the Frontend (React + Vite)
1. In Vercel, click **Add New > Project** again.
2. Select the same GitHub repository.
3. In the configuration screen:
   * **Root Directory**: Click *Edit* and select **`frontend`**.
   * **Framework Preset**: Select **Vite**.
   * Build command: `npm run build`
   * Output directory: `dist`
4. Expand **Environment Variables**:
   * Add key: `VITE_API_URL`
   * Value: Your deployed backend URL from Part A (e.g. `https://findit-api.vercel.app`).
5. Click **Deploy**.
6. Visit your live frontend URL! Test reporting an item, updating status, and deleting.

---

## 14. Testing & Verification

The project includes built-in verification scripts:

```bash
# Run schema and route validation tests
cd backend
npm test

# Run HTTP integration endpoint tests
node test-http.js

# Build frontend to check production compilation
cd ../frontend
npm run build
```

Both tests verify that:
* Mongoose validation forbids empty inputs and enforces enums.
* Express routes handle 404s and 400 validation failures cleanly.
* Vite compiles all JSX assets and Lucide icons without warnings.

---

## 15. Screenshots & UI Previews

*(Take screenshots from your browser after running `npm run dev` and embed them here)*

| View | Description |
| :--- | :--- |
| **Hero & Statistics** | Overview cards with live Lost, Found, and Returned counts |
| **Search & Filters** | Instant keyword search, category filter, and status selector |
| **Report an Item** | Responsive modal with field-level validation and clean design |
| **Item Card** | Displays details, status badge, location, and quick "Mark Returned" |

---

## 16. Future Enhancements
* 📷 **Image Uploads**: Integration with Cloudinary or AWS S3 for item photos.
* 🔐 **Student Authentication**: Single Sign-On (SSO) with university `.edu` Google Workspace accounts.
* 🔔 **Campus Notification Alerts**: Email notifications when a found item matches a lost report's category.
* 🗺️ **Interactive Campus Map**: Visual map pins showing where items were reported lost or found.

---

## 📄 College Assignment Checklist
- [x] Complete full-stack MERN application (React, Node, Express, MongoDB).
- [x] Cloud database on MongoDB Atlas (no mock data or localStorage).
- [x] All CRUD operations implemented (Create, Read, Update, Delete).
- [x] Form validation with clear user alerts.
- [x] Dynamic dashboard statistics derived from real records.
- [x] Filter by status (Lost/Found/Returned) and category.
- [x] Clean pastel design with responsive layouts.
- [x] Serverless deployment configuration for Vercel.
- [x] Security: No credentials hardcoded, `.gitignore` configured.
- [x] Seed script for populating demo items.

---
**FindIt Team** — Built with passion for college students everywhere.
