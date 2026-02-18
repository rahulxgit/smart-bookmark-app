# 🚀 Smart Bookmark App — Fullstack Assignment (Abstrabit Talent Team)

A **production-ready full-stack bookmark management application** built using **Next.js + Supabase**, designed to help users securely save, manage, and organize web bookmarks with authentication and real-time data handling.

This project was developed as part of a **micro-challenge assignment provided by the Abstrabit Talent Team** for the **Fullstack Role evaluation process**.

Delpoy Link - https://smart-bookmark-app-sigma-murex.vercel.app/

---

## 📌 Assignment Context

This project was completed as part of the screening process for:

**Company:** Abstrabit
**Role:** Fullstack / AI-ML (Intern / Full-time)
**Challenge Duration:** 72-hour micro-challenge
**Objective:** Build a scalable, production-quality application using modern full-stack practices.

The goal was to demonstrate:

* Fullstack development skills
* Clean architecture
* Scalable code structure
* Authentication & database integration
* Production-level best practices
* Ability to build using modern frameworks and tools

---

## ✨ Features

### 🔐 Authentication System

* Secure user authentication using Supabase
* Session handling with SSR support
* Protected routes and user-based data access
* Auth context management using React Context API

### 🔖 Bookmark Management

* Add new bookmarks
* View saved bookmarks
* Delete bookmarks
* User-specific bookmark storage
* Optimized data handling with custom hooks

### 📊 Dashboard Interface

* Clean dashboard layout
* Bookmark listing UI
* Reusable component architecture
* Responsive design

### ⚡ Production-Oriented Architecture

* Custom hooks for logic separation
* Service-based API layer
* Validation utilities
* Client + server Supabase configuration
* Scalable folder structure

### 🎨 UI & UX

* Responsive UI using Tailwind CSS
* Toast notifications
* Modern minimal design
* Component-driven development

---

## 🧠 Tech Stack

### Frontend

* **Next.js 16** (App Router)
* **React 19**
* **Tailwind CSS**
* **Heroicons**
* **React Hot Toast**

### Backend / Database

* **Supabase**

  * Authentication
  * Database storage
  * Server-side rendering support

### Architecture & Tools

* Context API for global state
* Custom React Hooks
* Service layer architecture
* ESLint configuration
* Input validation utilities

---

## 📂 Project Structure

```
smart-bookmark-app
│
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── dashboard/
│   │   ├── layout.js
│   │   └── page.js
│   │
│   ├── components/           # Reusable UI components
│   │   ├── Navbar.js
│   │   └── BookmarkCard.js
│   │
│   ├── context/              # Global state management
│   │   └── AuthContext.js
│   │
│   ├── hooks/                # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useBookmarks.js
│   │   └── useUser.js
│   │
│   ├── services/             # Business logic layer
│   │   └── bookmarkService.js
│   │
│   ├── lib/                  # Supabase configuration
│   │   ├── supabase.js
│   │   └── supabaseServer.js
│   │
│   └── utils/                # Helper utilities
│       └── validators.js
```

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```
git clone <repository-url>
cd smart-bookmark-app
```

### 2. Install Dependencies

```
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### 4. Run Development Server

```
npm run dev
```

App runs at:

```
http://localhost:3000
```

---

## 🔄 Available Scripts

```
npm run dev      → Start development server
npm run build    → Production build
npm run start    → Start production server
npm run lint     → Run ESLint
```

---

## 🧩 Key Implementation Highlights

* Clean separation of UI, business logic, and data layer
* Server-side authentication handling
* Reusable hooks for data operations
* Production-level folder structure
* SSR-ready Supabase configuration
* Scalable architecture for future features

---

## 🚀 Possible Future Improvements

* Bookmark tagging & categories
* Search & filtering
* Bookmark preview metadata
* Pagination & performance optimization
* AI-based link recommendations
* Shareable bookmarks
* Dark mode support

---

## 👨‍💻 Developer

**Rahul Kumar**
Full Stack Developer | DSA Enthusiast

* LinkedIn: rahulxnit
* GitHub: rahulxgit

---

## 📜 License

This project was created solely for **technical evaluation and learning purposes** as part of the Abstrabit screening process.

---

⭐ If you are reviewing this project as part of the hiring process, thank you for your time and consideration.
