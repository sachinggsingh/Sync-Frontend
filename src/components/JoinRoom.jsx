import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import socketManager from "../socket";
import Sidebar from "./SideBar/SideBar"
import LanguageSelector from "./UI/LanguageSelector";
import RunButton from "./UI/RunButton";
import EditorPanel from "./EditorPannel/EditorPannel";
import Chat from "./Chat";
import VideoGrid from "./VideoCall/VideoGrid";
import { Video } from "lucide-react";

const DEBOUNCE_DELAY = 100;

const JoinRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId, username } = location.state || {};

  // if someone navigated here manually or the state was lost, bounce to home
  useEffect(() => {
    if (!roomId || !username) {
      navigate('/');
    }
  }, [roomId, username, navigate]);

  const editorContainerRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const typingEffectRef = useRef(null);

  const [code, setCode] = useState("// Start coding...");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [outputHeight, setOutputHeight] = useState(30);
  const [sidebarWidth, setSidebarWidth] = useState(20);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isResizingOutput, setIsResizingOutput] = useState(false);
  const [users, setUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState([]);
  // no auth token needed in simplified version

  // Video Call State
  const [isCallActive, setIsCallActive] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, _setRemoteStreams] = useState([]); // setter unused for now
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Socket event handlers
  const handleUserJoined = useCallback(
    ({ clients, username: joinedUsername, socketId }) => {
      setUsers(clients);
      if (joinedUsername !== username) {
        toast.success(`${joinedUsername} joined the room`);
        // Sync our current code to the new joiner
        socketManager.syncCode(socketId, code);
      }
    },
    [username, code]
  );

  const handleUserLeft = useCallback(({ socketId, username }) => {
    setUsers((prev) => prev.filter((user) => user.socketId !== socketId));
    toast.error(`${username} left the room`);
  }, []);

  const handleUserDisconnected = useCallback(({ socketId, username }) => {
    setUsers((prev) => prev.filter((user) => user.socketId !== socketId));
    toast.error(`${username} disconnected`);
  }, []);

  const handleCodeSync = useCallback(({ code: syncedCode }) => {
    setCode(syncedCode);
  }, []);

  const handleCodeChange = useCallback(
    ({ code: newCode, sender }) => {
      if (sender === username) {
        // Ignore echoes of our own changes
        return;
      }
      
      // Clear any pending debounce timer when receiving remote changes
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // For remote changes, update immediately without typing effect
      setCode(newCode);
    },
    [username]
  );

  // Store handlers in refs to avoid re-registering listeners
  const handlersRef = useRef({
    handleUserJoined,
    handleUserLeft,
    handleUserDisconnected,
    handleCodeSync,
    handleCodeChange
  });

  // Update refs when handlers change
  useEffect(() => {
    handlersRef.current = {
      handleUserJoined,
      handleUserLeft,
      handleUserDisconnected,
      handleCodeSync,
      handleCodeChange
    };
  }, [handleUserJoined, handleUserLeft, handleUserDisconnected, handleCodeSync, handleCodeChange]);


  // manage the socket connection itself
  useEffect(() => {
    if (!roomId || !username) {
      navigate('/');
      return;
    }

    let isInitialConnection = true;

    const setupSocket = async () => {
      try {
        console.log('connecting to socket');
        // make sure we don't have an old connection still in progress
        socketManager.disconnect();
        const socket = socketManager.connect();
        if (!socket) {
          console.log('connect() returned null, another connect is pending');
          return;
        }

        socket.on('connect', () => {
          if (!isInitialConnection) {
            toast.success('Reconnected to server');
            socketManager.joinRoom(roomId, username);
          } else {
            isInitialConnection = false;
          }
          setIsConnected(true);
        });

        socket.on('disconnect', (reason) => {
          console.log('Disconnected. Reason:', reason);
          setIsConnected(false);
        });

socket.on('connect_error', (err) => {
          const msg = err && err.message ? err.message : '';
          console.error('connect_error', msg);
          toast.error('Connection error. Retrying...');
        });

        // event listeners
        socketManager.onUserJoined((data) => handlersRef.current.handleUserJoined(data));
        socketManager.onUserLeft((data) => handlersRef.current.handleUserLeft(data));
        socketManager.onUserDisconnected((data) => handlersRef.current.handleUserDisconnected(data));
        socketManager.onCodeSync((data) => handlersRef.current.handleCodeSync(data));
        socketManager.onCodeChange((data) => handlersRef.current.handleCodeChange(data));
        socketManager.onError((data) => {
          toast.error(data.message || 'An error occurred');
        });

        socketManager.onMessage((messageData) => {
          setMessage((prev) => {
            const exists = prev.some(
              (msg) =>
                msg.sender === messageData.sender &&
                msg.message === messageData.message &&
                msg.time === messageData.time
            );
            return exists ? prev : [...prev, messageData];
          });
        });

        socketManager.onCodeOutput(({ output, sender }) => {
          setOutput(output);
          if (sender !== username) {
            toast.success(`${sender} executed code`);
          }
        });


        socketManager.joinRoom(roomId, username);
      } catch (error) {
        console.error('auth error before connect', error);
        toast.error('Authentication error: please sign in again');
        navigate('/sign-in');
      }
    };

    setupSocket();

    return () => {
      socketManager.leaveRoom(roomId, username);
      socketManager.removeAllListeners();
      socketManager.disconnect();
      setIsConnected(false);
      setUsers([]);
      setMessage([]);
    };
  }, [roomId, username, navigate]);

  const handleMessage = (content) => {
    if (isConnected && roomId) {
      // Create message object
      const messageData = {
        message: content,
        sender: username,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
      };

      // Update local state first
      setMessage((prev) => [...prev, messageData]);

      // Send to server
      socketManager.emitMessage(roomId, content, username);
    }
  };

  // Handle local code changes with debouncing
  const handleLocalCodeChange = useCallback(
    (value) => {
      // Update local state immediately
      setCode(value);

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce the emission of changes
      debounceTimerRef.current = setTimeout(() => {
        if (isConnected && roomId) {
          // emitCodeChange takes roomId, code, sender
          socketManager.emitCodeChange(roomId, value, username);
        }
      }, DEBOUNCE_DELAY);
    },
    [roomId, isConnected, username]
  );

  // Handle code execution
  const handleRun = async () => {
    if (!code.trim()) {
      toast.error("Please write some code before running");
      return;
    }

    setIsRunning(true);
    setOutput("");

    try {
      const language = selectedLanguage;
      const res = await fetch(import.meta.env.VITE_PISTON_API || 'https://emkc.org/api/v2/piston/execute', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          version: "*",
          files: [
            {
              content: code,
            },
          ],
          stdin: "",
          compile_timeout: 10000,
          run_timeout: 10000,
          compile_memory_limit: -1,
          run_memory_limit: -1,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      let executionOutput = "";
      let hasError = false;

      if (data.run?.output) {
        executionOutput = data.run.output;
        hasError = data.run?.code !== 0;
      } else if (data.compile?.output) {
        executionOutput = data.compile.output;
        hasError = true; // Compilation output usually means error
      } else if (data.message) {
        executionOutput = data.message;
        hasError = true;
      } else {
        executionOutput = "No output";
        hasError = false;
      }

      // Set output locally
      setOutput(executionOutput);

      // Emit output to other users in the room
      if (isConnected && roomId) {
        socketManager.emitCodeOutput(roomId, executionOutput, username);
      }

      // Show appropriate toast
      if (hasError) {
        toast.error("Code execution failed");
      } else {
        toast.success("Code executed successfully");
      }
    } catch (error) {
      console.error("Execution error:", error);
      const errorOutput = `Error: ${error.message}`;
      setOutput(errorOutput);
      
      // Emit error output to other users
      if (isConnected && roomId) {
        socketManager.emitCodeOutput(roomId, errorOutput, username);
      }
      
      toast.error("Failed to execute code");
    } finally {
      setIsRunning(false);
    }
  };

  // Handle resizing
  const handleMouseMove = useCallback(
    (e) => {
      if (isResizingSidebar) {
        const newSidebarWidth = (e.clientX / window.innerWidth) * 100;
        if (newSidebarWidth > 10 && newSidebarWidth < 40) {
          setSidebarWidth(newSidebarWidth);
        }
      }

      if (isResizingOutput) {
        const editorHeight = editorContainerRef.current?.offsetHeight || 0;
        const fromBottom = window.innerHeight - e.clientY;
        const newOutputHeight = (fromBottom / editorHeight) * 100;
        if (newOutputHeight > 10 && newOutputHeight < 70) {
          setOutputHeight(newOutputHeight);
        }
      }
    },
    [isResizingSidebar, isResizingOutput]
  );

  const startSidebarResize = () => setIsResizingSidebar(true);
  const startOutputResize = () => setIsResizingOutput(true);
  const stopResize = useCallback(() => {
    setIsResizingSidebar(false);
    setIsResizingOutput(false);
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResize);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopResize);
    };
  }, [handleMouseMove, stopResize]);

  const handleLeaveRoom = useCallback(() => {
    if (isConnected) {
      socketManager.leaveRoom(roomId, username);
      socketManager.disconnect();
      setIsConnected(false);
      setUsers([]);
    }
    navigate("/");
  }, [roomId, username, navigate, isConnected]);

  // Video Call Handlers
  const handleToggleCall = useCallback(async () => {
    if (isCallActive) {
      // Leave call
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      setLocalStream(null);
      setIsCallActive(false);
      // TODO: Signal leave to server
    } else {
      // Join call
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true, 
          video: true 
        });
        setLocalStream(stream);
        setIsCallActive(true);
        // TODO: Signal join to server
      } catch (err) {
        console.error("Error accessing media devices:", err);
        toast.error("Could not access camera/microphone");
      }
    }
  }, [isCallActive, localStream]);

  const handleToggleMute = useCallback(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  }, [localStream, isMuted]);

  const handleToggleVideo = useCallback(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  }, [localStream, isVideoOff]);

  return (
    <div className="flex h-screen overflow-hidden text-white bg-gray-900">
      <Sidebar
        roomId={roomId}
        users={users}
        onLeave={handleLeaveRoom}
        startSidebarResize={startSidebarResize}
        sidebarWidth={sidebarWidth}
        isConnected={isConnected}
      />

      <div className="flex flex-col flex-1">
        <div className="p-4 bg-gray-800 gap-4 border-b border-gray-700 flex  items-center">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onChange={(e) => {
              const newLanguage = e.target.value;
              setSelectedLanguage(newLanguage);
              
              let templateCode = `console.log("Hello, World!");`;
              if (newLanguage === "java") {
                templateCode = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`;
              } else if (newLanguage === "go") {
                templateCode = `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`;
              } else if (newLanguage === "typescript") {
                templateCode = `interface User {
  name: string;
  id: number;
}

const user: User = {
  name: "World",
  id: 1,
};

console.log("Hello, " + user.name + "!");`;
              } else {
                templateCode = 'console.log("Hello, World!");';
              }
              setCode(`// ${newLanguage} code example\n${templateCode}`);
            }}
          />
          <RunButton isRunning={isRunning} onRun={handleRun} />
          <Chat
            messages={message}
            onSendMessage={handleMessage}
            userName={username}
          />
          <button
            onClick={handleToggleCall}
            className={`p-2 rounded-lg transition-colors ${
              isCallActive 
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
            title={isCallActive ? "Leave Call" : "Join Call"}
          >
            <Video size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
             
             {/* Editor Area */}
            <div
              className={`relative flex-1 h-[calc(100vh-4rem)] transition-all duration-300 ${
                isCallActive ? "w-2/3" : "w-full"
              }`}
              ref={editorContainerRef}
            >
              <EditorPanel
                ref={typingEffectRef}
                code={code}
                selectedLanguage={selectedLanguage}
                onCodeChange={handleLocalCodeChange}
                output={output}
                outputHeight={outputHeight}
                onOutputResize={startOutputResize}
                isRunning={isRunning}
              />
            </div>

            {/* Video Grid Area */}
            {isCallActive && (
                <div className="w-1/3 border-l border-gray-700 bg-gray-900 transition-all duration-300">
                    <VideoGrid 
                        localStream={localStream}
                        remoteStreams={remoteStreams}
                        localUser={username}
                        isMuted={isMuted}
                        isVideoOff={isVideoOff}
                        onToggleMute={handleToggleMute}
                        onToggleVideo={handleToggleVideo}
                        onLeave={handleToggleCall}
                    />
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
