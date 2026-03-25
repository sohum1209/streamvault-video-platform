# 🎬 StreamVault

A Netflix-inspired movie streaming platform built with **Next.js**, featuring Firebase authentication, Firestore database integration, smooth animations using Framer Motion, and optimized API handling with Redux Toolkit Query.

---

## 🚀 Overview

**StreamVault** is a modern movie streaming web application that allows users to browse trending content, view details, and save their favorite movies. The app is designed with a scalable architecture, efficient state management, and a smooth user experience.

---

## ✨ Features

* 🔐 Firebase Authentication (Login/Signup)
* 🎥 Browse Popular & Trending Movies
* ⭐ Save / Like Movies
* ⚡ Optimized API Fetching with RTK Query
* 🔄 Firestore for user data storage
* 🎞️ Smooth animations with Framer Motion
* 🎨 Fully responsive UI
* 🔍 Dynamic routing with Next.js App Router

---

## 🛠️ Tech Stack

| Category         | Technology           |
| ---------------- | -------------------- |
| Frontend         | Next.js (App Router) |
| State Management | Redux Toolkit        |
| Data Fetching    | RTK Query            |
| Backend Services | Firebase             |
| Database         | Firestore            |
| Animations       | Framer Motion        |
| Styling          | Tailwind CSS / CSS   |

---

## 📂 Project Structure

```
streamvault/
│── app/              # Next.js app router pages
│── components/       # Reusable UI components
│── context/          # React context (auth, global state)
│── lib/              # Utility functions/helpers
│── services/         # RTK Query API services
│── store/            # Redux store configuration
│── public/           # Static assets
│── firebase.js       # Firebase configuration
│── .env.local        # Environment variables
│── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/streamvault.git
cd streamvault
```

---

### 2️⃣ Install dependencies

```bash
npm install
```

---

### 3️⃣ Setup environment variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_key
```

---

### 4️⃣ Run the app

```bash
npm run dev
```

Open:
👉 http://localhost:3000

---

## 📌 Future Improvements

* 🎬 Video playback support
* 🔎 Advanced search functionality
* 📱 Progressive Web App (PWA)
* 🎯 Recommendation system
* 🌐 Multi-language support

---

## 💡 Key Highlights

* Refactored API layer using **RTK Query**
* Improved performance with **built-in caching**
* Clean and scalable project architecture
* Separation of concerns (services, store, UI)

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
