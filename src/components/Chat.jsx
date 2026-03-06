import { useState, useRef, useEffect } from "react";
import { MessageCircle } from "lucide-react";

const Chat = ({ messages, onSendMessage, userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        title={isOpen ? "Close chat" : "Open chat"}
      >
        <MessageCircle size={16} />
        <span>Chat</span>
        {messages.length > 0 && !isOpen && (
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            {messages.length}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-transparent ">
          <div
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#1f1f1f] shadow-xl rounded-l-2xl flex flex-col"
            style={{
              animation: "slideIn 0.3s ease-out forwards",
            }}
          >
            {/* Keyframes defined directly in JSX */}
            <style>
              {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0%);
              opacity: 1;
            }
          }
        `}
            </style>

            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Room Chat</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto space-y-4 p-4"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#4B5563 transparent",
              }}
            >
              {messages.length === 0 ? (
                <div className="text-center text-gray-500">No messages yet</div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === userName ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-xl ${
                        msg.sender === userName
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-700 text-gray-200"
                      }`}
                    >
                      <div className="font-semibold text-xs mb-1">
                        {msg.sender === userName ? "You" : msg.sender}
                      </div>
                      <div className="break-words">{msg.message}</div>
                      <div className="text-xs mt-1 opacity-75">{msg.time}</div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleMessage}
              className="p-4 border-t border-gray-700"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
