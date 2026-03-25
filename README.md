# 🎬 StreamVault

A Netflix-inspired movie streaming platform built with **Next.js**, featuring secure authentication, real-time data storage, smooth animations, and optimized API handling for a seamless user experience.

---

## 🚀 Overview

**StreamVault** is a modern movie streaming web application inspired by Netflix. It enables users to explore trending movies, view detailed information, and save their favorite content. The platform is designed with performance, scalability, and user experience in mind, enhanced with fluid animations using Framer Motion.

---

## ✨ Features

* 🔐 **User Authentication** (Firebase Auth)
* 🎥 **Browse Movies & TV Shows**
* ⭐ **Save / Like Movies**
* ⚡ **Efficient Data Fetching with RTK Query**
* 🔄 **Real-time Database (Firestore)**
* 🎨 **Responsive UI (Next.js + Tailwind/CSS)**
* 🎞️ **Smooth Animations (Framer Motion)**
* 🔍 **Dynamic Routing & Pages**

---

## 🛠️ Tech Stack

| Category         | Technology     |
| ---------------- | -------------- |
| Frontend         | Next.js        |
| State Management | Redux Toolkit  |
| Data Fetching    | RTK Query      |
| Authentication   | Firebase Auth  |
| Database         | Firestore      |
| Animations       | Framer Motion  |
| Styling          | CSS / Tailwind |

---

## 📂 Project Structure

```
streamvault/ │── app/ # Next.js app router pages │── components/ # Reusable UI components │── context/ # React context (auth, global state) │── lib/ # Utility functions/helpers │── services/ # RTK Query API services │── store/ # Redux store configuration │── public/ # Static assets │── firebase.js # Firebase configuration │── .env.local # Environment variables │── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/streamvault.git
cd streamvault
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup environment variables

Create a `.env.local` file and add:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_key
```

---

### 4️⃣ Run the development server

```bash
npm run dev
```

Open:
👉 http://localhost:3000

---

## 📌 Future Improvements

* 🎬 Video streaming functionality
* 🔎 Advanced search & filters
* 📱 PWA support
* 🎯 Recommendation system
* 🌐 Multi-language support

## 💡 Author

Developed by **[Sohum]**
🚀 Passionate about building scalable and interactive web applications

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
