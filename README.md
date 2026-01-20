# 📺 Prime Play – Video Sharing Platform (Frontend)

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-0EA5E9?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

Prime Play is a modern YouTube-style video sharing platform that allows users to upload, watch, interact with, and organize videos — built with a powerful and optimized Next.js frontend.

### ✨ Tagline
_A fast, scalable, and feature-rich video platform with real-time notifications built on a modern MERN web stack._

---

## 🚀 Features

- 🎥 **Seamless Video Uploading** – Supports modern formats with smooth Cloudinary integration  
- 👍 **Interactive Engagement** – Users can like and comment on content  
- 📌 **Channel Subscriptions** – Follow your favorite creators effortlessly 
- 🔔 **Real-Time Notification System** – Instant notifications for subscriptions, uploads, and user interactions powered by Socket.IO
- 🔐 **Secure Login System** – JWT-based verified access  
- 🕒 **Personal Viewing History** – Automatically tracks previously watched videos
- 🎥 **Creator Video Manager** – Manage and review all videos authored by the user
- 🎶 **Custom Playlist Support** – Create and organize playlists with ease
- 🔎 **Advanced Search Functionality** – Quickly find videos across the platform
- ⚡ **Responsive Design** – Smooth, optimized UI across all devices

### 📊 User Dashboard

- 🎥 **My Videos** – View, edit, and manage uploaded content  
- 👍 **Liked Videos** – Quick access to all liked videos  
- 🎶 **My Playlists** – Create, update, and organize playlists  
- 🕒 **Watch History** – Track previously watched content  
- 👥 **My Subscribers** – View and manage channel subscribers  
- 🔔 **My Subscriptions** – Manage followed creators  
- ✏️ **Edit Profile** – Update personal and channel details 

---

## 🔔 Real-Time Notification System

Prime Play includes a production-grade real-time notification system designed for scalability and performance.

### Key Highlights
- 📡 **Socket.IO Integration** – Pushes notifications instantly without page refresh
- ⚡ **Optimized Fetch Strategy**
  - Fetches latest 3 notifications by default
  - Uses `limit + 1` strategy to detect more notifications
- 👀 **View All Notifications** – Load full notification history on demand
- ✅ **Read Management**
  - Mark individual notifications as read
  - Mark all notifications as read
- 🗑️ **Notification Cleanup** – Delete individual notifications
- 🧠 **Client-side Optimization**
  - Prevents duplicate notifications
  - Enforces UI limits during real-time updates

This system ensures users never miss important updates while keeping the UI fast and clutter-free.

---

## 🚀 Live Demo

[Visit Prime Play](https://primeplay-app.vercel.app)

---

## 🛠 Tech Stack (Frontend)

- **Next.js 14+** – App Router  
- **TypeScript**  
- **Tailwind CSS**  
- **Redux Toolkit**  
- **React Hook Form**  
- **Zod (Validation)**  

### Backend & External Services
- Node.js, Express  
- MongoDB + Mongoose  
- Socket.IO
- Cloudinary  
- JWT Authentication  

---

## 🔗 Backend Repository

You can find the backend source code here:  
👉 **[Prime Play Backend Repository](https://github.com/thebeliever1812/prime-play-backend)**

---

## 📂 Folder Structure

```
prime-play-frontend/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── schemas/
│   ├── utils/
│   ├── manifest.json
│
├── .env
├── package.json
├── next.config.ts
├── tsconfig.json
├── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/thebeliever1812/prime-play-frontend.git
cd prime-play-frontend
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Create .env File
```bash
NEXT_PUBLIC_BACKEND_BASE_URL=""
```

### 4️⃣ Start Development Server
```bash
npm run dev
```

---

## 🌐 Deployment

Frontend is deployed on **Vercel**.  
Ensure the required environment variables are added in Vercel Project Settings.

---

## 👤 Author

**Basir Ahmad**  
📧 Email: **basirahmadmalik@gmail.com**  
🌐 Portfolio: **https://basir-ahmad-portfolio.vercel.app**
