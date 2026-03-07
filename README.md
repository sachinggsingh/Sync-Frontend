# 🚀 SyncEditor - Frontend

<div align="center">

![SyncEditor Logo](public/android-chrome-192x192.png)

### **Empower your coding with real-time collaboration.**

The frontend engine of SyncEditor, built with React, Vite, and Monaco Editor. Experience seamless character-by-character sync and instant code execution.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4.21-purple?style=flat-square&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

[Features](#-key-features) • [Deployment](#-deployment) • [Setup](#-quick-start) • [Backend Service](https://github.com/sachinggsingh/Sync-Backend)

</div>

---

## ✨ Key Features

| 🎯 Core Experience | 🎨 Next-Gen UI | 🛠️ Pro Tools |
| :--- | :--- | :--- |
| **Real-Time Pairing**<br>Instant character-by-character sync. | **User Presence**<br>Color-coded cursors and avatars. | **Multi-Language**<br>JS, TS, Python, C++, and more. |
| **Cloud Execution**<br>Run code directly in-browser. | **Responsive Layout**<br>Flawless on any device. | **Monaco Engine**<br>The power of VS Code in your web browser. |
| **Secure Rooms**<br>Isolated, ID-based coding sessions. | **Dark Mode**<br>Premium aesthetics for long sessions. | **Live Chat**<br>Contextual communication while you code. |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **SyncEditor Server**: This project requires the [SyncEditor Backend](https://github.com/sachinggsingh/Sync-Backend) to be running.

### 1-Minute Setup

```bash
# 1. Clone the project
git clone https://github.com/sachinggsingh/SyncEditor.git
cd synceditor

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Launch Development Tool
npm run dev
```

The app will be live at `http://localhost:5173` 🚀

---

## 🔧 Workflow Configuration

| Service | Setting | Recommended Value |
| :--- | :--- | :--- |
| **Backend API** | `VITE_BACKEND_URL` | `http://localhost:5555` |
| **Execution API** | `VITE_PISTON_API` | `https://emkc.org/api/v2/piston/execute` |

---

## 🏗️ The Tech Stack

- **Framework**: [React 18](https://reactjs.org/) & [Vite](https://vitejs.dev/) for lightning-fast HMR.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a sleek, responsive look.
- **Editor Core**: [Monaco Editor](https://microsoft.github.io/monaco-editor/) (the engine behind VS Code).
- **Icons**: [Lucide React](https://lucide.dev/) for consistent, beautiful iconography.

---

## 🤝 Contributing

We value your input! Whether it's a bug report, feature request, or a PR, follow these steps:

1. **Fork** the repository.
2. **Branch** out (`git checkout -b feat/YourFeature`).
3. **Commit** your brilliance.
4. **Push** and **Open a PR**.

---

<div align="center">

**Crafted with ❤️ for developers by developers**

[GitHub](https://github.com/sachinggsingh)

⭐ **If you find this project useful, please give it a star!**

</div>
