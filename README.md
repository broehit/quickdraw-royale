# 🎨 Quickdraw Royale ⚡

[![GitHub Repository](https://img.shields.io/badge/GitHub-broehit%2Fquickdraw--royale-181717?style=for-the-badge&logo=github)](https://github.com/broehit/quickdraw-royale)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express)](https://expressjs.com/)

**Quickdraw Royale** is a fast-paced, real-time multiplayer Pictionary & drawing game built with React 19, TypeScript, Socket.io, and Express. Players join lobbies, receive random drawing prompts, draw collaboratively or competitively on an interactive canvas, and guess each other's drawings in a live real-time chat feed.

🔗 **Repository Link**: [https://github.com/broehit/quickdraw-royale](https://github.com/broehit/quickdraw-royale)

---

## ✨ Features

- ⚡ **Real-Time Multiplayer Canvas**: Low-latency stroke-by-stroke synchronization powered by Socket.io.
- 🎨 **Enhanced Creative Toolkit**:
  - Vibrant neon color palette swatches & custom HTML color picker.
  - Brush size controls with live visual size indicator.
  - Pen, Eraser, Undo, Clear Canvas, and High-DPI canvas rendering.
  - Export & Download drawings directly as PNG files.
- 🏆 **Interactive Game Arena**:
  - Dynamic secret prompt generator with clue reveals.
  - Turn countdown timer with progress ring.
  - Live guess feed with automated guess correctness verification and instant visual celebrations.
- 🔮 **Modern Glassmorphic UI**: High-end dark theme featuring fluid gradients, glassmorphism, responsive controls, and smooth micro-animations.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Routing**: React Router DOM v7
- **Styling**: Vanilla CSS (Custom Design System, Glassmorphism, Google Fonts `Outfit` & `Inter`)
- **Real-Time**: Socket.io Client

### Backend (Server)
- **Runtime**: Node.js
- **Server Framework**: Express
- **Real-Time Engine**: Socket.io
- **Language**: TypeScript

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+) and `npm` installed.

### 1. Clone the Repository

```bash
git clone https://github.com/broehit/quickdraw-royale.git
cd quickdraw-royale
```

### 2. Start Backend Server

```bash
cd apps/server
npm install
npm run dev
```
The server will run on `http://localhost:5000`.

### 3. Start Frontend Client

In a new terminal window:

```bash
cd apps/server/client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📂 Project Structure

```text
quickdraw-royale/
├── apps/
│   └── server/
│       ├── client/              # React + Vite Frontend Application
│       │   ├── public/          # Static Assets
│       │   └── src/
│       │       ├── components/  # React UI Components (Canvas, Controls)
│       │       ├── pages/       # Route Views (Home, Lobby, Game)
│       │       ├── App.tsx      # Main Layout & Navigation
│       │       └── index.css    # Global Modern Design System & CSS Variables
│       └── src/                 # Express & Socket.io Backend API
│           ├── config/          # DB & Server Config
│           ├── controllers/     # API Controllers
│           ├── routes/          # Auth & API Routes
│           └── index.ts         # Main Entrypoint & Socket Event Handlers
├── package.json
└── README.md
```

---

## 📄 License

This project is open source and available under the [ISC License](LICENSE).
