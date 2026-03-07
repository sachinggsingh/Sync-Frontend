import toast from 'react-hot-toast';

import { io } from "socket.io-client";

class SocketManager {
  constructor() {
    this.socket = null;
    this.BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5555';
    this.isConnecting = false;
    this.listeners = new Map();
  }

  connect(authToken = null) {
    if (this.socket && this.socket.connected) {
      return this;
    }

    if (this.isConnecting) {
      return null;
    }

    this.isConnecting = true;

    try {
      console.log('Connecting to Socket.io:', this.BACKEND_URL);
      this.socket = io(this.BACKEND_URL, {
        auth: {
          token: authToken
        },
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        console.log('Connected to socket server');
        this.isConnecting = false;
        this.emitEvent('connect');
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected:', reason);
        this.isConnecting = false;
        this.emitEvent('disconnect', reason);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.isConnecting = false;
        this.emitEvent('connect_error', error);
      });

      // Handle all incoming events generically if needed, 
      // but Socket.io usually handles specific events.
      // We will override the listener logic to use socket.on() directly.

      return this;
    } catch (error) {
      console.error('Socket initialization error:', error);
      this.isConnecting = false;
      return null;
    }
  }


  // Event Listener Management
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
    // Still keep track for re-registration if needed
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
    if (!this.listeners.has(event)) {
      return;
    }
    if (!callback) {
      this.listeners.delete(event);
    } else {
      const handlers = this.listeners.get(event);
      const index = handlers.indexOf(callback);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (!this.socket || !this.socket.connected) {
      console.warn('Socket not connected, cannot emit:', event);
      return;
    }
    this.socket.emit(event, data);
  }

  // Helper method for internal events
  emitEvent(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => cb(data));
    }
  }

  // Compatibility methods for existing code
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
    this.listeners.clear();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Room events
  joinRoom(roomId, username) {
    this.emit('join', { roomId, username });
  }

  leaveRoom(roomId, username) {
    this.emit('leave', { roomId, username });
  }

  // Code sync events
  syncCode(socketId, code) {
    this.emit('sync-code', { socketId, code });
  }

  onCodeSync(callback) {
    this.on('code-sync', callback);
  }

  emitCodeChange(roomId, code, sender) {
    this.emit('code-change', { roomId, code, sender });
  }

  onCodeChange(callback) {
    this.on('code-change', callback);
  }

  // User events
  onUserJoined(callback) {
    this.on('user-joined', callback);
  }

  onUserLeft(callback) {
    this.on('user-left', callback);
  }

  onUserDisconnected(callback) {
    this.on('user-disconnected', callback); // Mapped to user-left in Go for now? Or separate? 
    // Go sends 'user-left' on leave. 
    // We might need to handle 'user-disconnected' similarly if we want that distinction.
  }

  // Message events
  emitMessage(roomId, message, sender) {
    this.emit('send-message', {
      roomId,
      message,
      sender,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    });
  }

  onMessage(callback) {
    // Backend emits 'receive-message'
    this.on('receive-message', callback);
  }

  // Error events
  onError(callback) {
    this.on('error', callback);
  }

  // Code output events
  emitCodeOutput(roomId, output, sender) {
    this.emit('code-output', {
      roomId,
      output,
      sender
    });
  }

  onCodeOutput(callback) {
    this.on('code-output', callback);
  }
}

// Create a singleton instance
const socketManager = new SocketManager();
export default socketManager;