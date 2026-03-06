# 🚀 SyncEditor - Real-Time Collaborative Code Editor

<div align="center">

![SyncEditor Logo](public/android-chrome-192x192.png)

**A modern, real-time collaborative code editor built with React and Socket.IO**

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-black.svg)](https://socket.io/)
[![Vite](https://img.shields.io/badge/Vite-5.4.21-purple.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## ✨ Features

### 🎯 Core Functionality
- **Real-Time Collaboration** - Multiple users can edit code simultaneously with instant synchronization
- **Multi-Language Support** - JavaScript, TypeScript, Python, Java, C++ with syntax highlighting
- **Code Execution** - Run code directly in the browser with instant output
- **Live Chat** - Communicate with collaborators in real-time
- **Room-Based Sessions** - Create or join rooms with unique IDs

### 🎨 User Experience
- **Color-Coded Users** - Each user gets a unique color for easy identification
- **User Avatars** - Initials-based avatars for better visual distinction
- **Online Status** - See who's currently in the room
- **Copy Room ID** - One-click room ID copying
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Dark Theme** - Easy on the eyes for extended coding sessions

### 🔒 Security & Performance
- **Input Validation** - All user inputs are validated and sanitized
- **Rate Limiting** - Protection against abuse and spam
- **Helmet.js Security** - Security headers for production deployment
- **Code Compression** - Optimized data transfer
- **Error Boundaries** - Graceful error handling

### 🛠️ Developer Features
- **Monaco Editor Integration** - VS Code-like editing experience
- **Debounced Updates** - Efficient real-time synchronization
- **Connection Health Monitoring** - Automatic reconnection on network issues
- **Resizable Panels** - Customize your workspace layout

---

## 🎬 Demo

<div align="center">

### Creating and Joining a Room
![Room Creation Demo](docs/images/demo-room-creation.gif)

### Real-Time Collaboration
![Collaboration Demo](docs/images/demo-collaboration.gif)

### Code Execution
![Code Execution Demo](docs/images/demo-execution.gif)

</div>

---

## 📦 Installation

### Prerequisites
- **Node.js** >= 16.x
- **npm** >= 8.x or **yarn** >= 1.22.x

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/synceditor.git
cd synceditor
```

2. **Setup Frontend**
```bash
cd synceditor
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Setup Backend** (in a new terminal)
```bash
cd ../Server
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

4. **Open your browser**
```
Frontend: http://localhost:5173
Backend: http://localhost:5555
```

---

## 🔧 Configuration

### Frontend Environment Variables

Create a `.env` file in the `synceditor` directory:

```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:5555

# Code Execution API (Piston)
VITE_PISTON_API=https://emkc.org/api/v2/piston/execute
```

### Backend Environment Variables

Create a `.env` file in the `Server` directory:

```env
# Server Port
PORT=5555

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Environment
NODE_ENV=development

# Socket.IO Configuration
SOCKET_PING_TIMEOUT=120000
SOCKET_PING_INTERVAL=30000
```

---

## 💻 Usage

### Creating a Room

1. Enter your username
2. Click "Create New Room"
3. Share the generated Room ID with collaborators

### Joining a Room

1. Enter your username
2. Enter the Room ID shared by your collaborator
3. Click "Join Room"

### Using the Editor

- **Change Language**: Use the dropdown menu to switch between languages
- **Run Code**: Click the "Run" button to execute your code
- **Chat**: Click the chat icon to open the messaging panel
- **Resize Panels**: Drag the panel edges to customize your layout
- **Leave Room**: Click "Leave Room" to exit the session

---

## 🏗️ Tech Stack

### Frontend
- **React** 18.3.1 - UI library
- **Vite** - Build tool and dev server
- **Socket.IO Client** - Real-time communication
- **Monaco Editor** - Code editor component
- **CodeMirror** - Alternative editor with language support
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **Helmet** - Security middleware
- **Compression** - Response compression
- **Validator** - Input validation and sanitization
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

### Code Execution
- **Piston API** - Multi-language code execution engine

---

## 📁 Project Structure

```
SyncEditor/
├── synceditor/                 # Frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── JoinRoom.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── SideBar/
│   │   │   ├── EditorPannel/
│   │   │   ├── Layout/
│   │   │   └── UI/
│   │   ├── utils/              # Utility functions
│   │   │   └── userColors.js
│   │   ├── socket.js           # Socket.IO manager
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── Server/                     # Backend application
│   ├── middleware/             # Custom middleware
│   │   ├── rateLimiter.js
│   │   └── validator.js
│   ├── app.js                  # Express server
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🔐 Security Features

- **Input Validation**: All user inputs (username, room ID, messages, code) are validated
- **XSS Protection**: HTML entities are escaped in user-generated content
- **Rate Limiting**: Prevents abuse with configurable limits
- **CORS Configuration**: Restricted to specified origins
- **Security Headers**: Helmet.js for production security
- **Code Size Limits**: Prevents memory exhaustion attacks

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend:
```bash
cd synceditor
npm run build
```

2. Deploy the `dist` folder to your hosting provider

3. Update environment variables in your hosting dashboard

### Backend (Railway/Heroku/AWS)

1. Ensure your `.env` is configured for production
2. Set `NODE_ENV=production`
3. Deploy using your preferred platform
4. Update CORS settings to match your frontend URL

For detailed deployment instructions, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Powerful code editor
- [CodeMirror](https://codemirror.net/) - Versatile text editor
- [Socket.IO](https://socket.io/) - Real-time engine
- [Piston](https://github.com/engineer-man/piston) - Code execution engine
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

## 📧 Support

For support, email your-email@example.com or open an issue on GitHub.

---

## 🗺️ Roadmap

- [ ] Persistent room history
- [ ] File upload/download
- [ ] Video/Voice chat integration
- [ ] Collaborative debugging
- [ ] Custom themes
- [ ] Keyboard shortcuts customization
- [ ] Admin controls for room owners
- [ ] Analytics dashboard

---

<div align="center">

**Made with ❤️ by [Your Name](https://github.com/yourusername)**

⭐ Star this repo if you find it helpful!

</div>
