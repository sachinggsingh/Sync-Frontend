import toast from 'react-hot-toast';

class SocketManager {
  constructor() {
    this.socket = null;
    this.BACKEND_URL = import.meta.env.VITE_GO_BACKEND_URL || 'ws://localhost:8080/ws';
    this.isConnecting = false;
    this.listeners = new Map();
  }

  connect(authToken = null) {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return this;
    }

    if (this.isConnecting) {
      return null;
    }

    this.isConnecting = true;

    try {
      console.log('Connecting to WebSocket:', this.BACKEND_URL);
      this.socket = new WebSocket(this.BACKEND_URL);

      this.socket.onopen = () => {
        console.log('Connected to socket server');
        this.isConnecting = false;
        this.emitEvent('connect');
      };

      this.socket.onclose = (event) => {
        console.log('Disconnected:', event.reason);
        this.isConnecting = false;
        this.emitEvent('disconnect', event.reason);
        this.socket = null;
      };

      this.socket.onerror = (error) => {
        console.error('Socket error:', error);
        this.isConnecting = false;
        this.emitEvent('connect_error', error);
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleIncomingMessage(data);
        } catch (err) {
          console.error('Error parsing message:', err);
        }
      };

      return this;
    } catch (error) {
      console.error('Socket connection error:', error);
      this.isConnecting = false;
      return null;
    }
  }

  handleIncomingMessage(data) {
    console.log('[Socket] Received:', data);
    const { type, payload, ...rest } = data;
    // If type matches a listener, invoke it
    // We treat the top-level keys as the data payload for compatibility with existing frontend logic
    // or we might need to adjust.
    // Existing frontend expects: on('code-change', ({ code, sender }) => ...)
    // Go sends: { type: "code-change", sender: "...", payload: ... }
    // If we put data in payload, we should extract it.
    // If we put it at top level (like sender), it's available in `rest`.

    if (this.listeners.has(type)) {
      const handlers = this.listeners.get(type);

      // Construct the object expected by frontend handlers
      // Our Go server sends:
      // Type, RoomID, UserID, Sender, Target, Payload (RawMessage)

      // For 'code-change', we expect { code, sender }
      // The Go server sends structure. We need to parse Payload if it exists, or use top level fields.
      // Let's assume Payload contains the specific data like 'code', 'message' text, etc.
      // OR, we can try to merge everything.

      let eventData = { ...rest, sender: data.sender };
      if (payload) {
        // Payload is json.RawMessage, which comes as a sub-object in JSON
        // We merge it into eventData
        eventData = { ...eventData, ...payload };
      }

      handlers.forEach(callback => callback(eventData));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  // Event Listener Management
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
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
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('Socket not connected, cannot emit:', event);
      return;
    }

    // Wrap in standard signal message format
    const message = {
      type: event,
      ...data
    };

    // For specific events, we might want to structure generic payload
    // Go expects: Type, RoomID, UserID, Target, Payload
    // Front end sends: { roomId, code, sender, username } for code-change
    // We can map these to the Go structure.

    // Mapping:
    // data.roomId -> RoomID
    // data.username -> UserID (or Sender?)

    const formattedMessage = {
      type: event,
      roomId: data.roomId,
      userId: data.username || data.sender, // Use username as userId
      ...data
    };

    this.socket.send(JSON.stringify(formattedMessage));
  }

  // Helper method for internal events
  emitEvent(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => cb(data));
    }
  }

  // Compatibility methods for existing code
  removeAllListeners() {
    this.listeners.clear();
  }

  // Room events
  joinRoom(roomId, username) {
    this.emit('join', { roomId, username });
  }

  leaveRoom(roomId, username) {
    this.emit('leave', { roomId, username });
  }

  // Code sync events
  emitCodeChange(roomId, code, sender, username) {
    this.emit('code-change', { roomId, code, sender, username });
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
    this.on('receive-message', callback); // Go broadcasts 'receive-message'?? 
    // Wait, in Go I implemented "send-message" handler to broadcast "send-message".
    // Frontend expects "receive-message".
    // I should probably update Go to broadcast "receive-message" OR update frontend to listen to "send-message".
    // Let's update frontend to listen to "send-message" as it's cleaner echo, OR map it here.
    // Go code: broadcasts whatever Type came in. So if I emit "send-message", Go broadcasts "send-message".
    // Frontend `JoinRoom.jsx` listens to `socketManager.onMessage` which calls `on('receive-message')`.
    // So I should map it here or change event name.

    // Let's alias receive-message to send-message for compatibility if server echoes same type
    this.on('send-message', callback);
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