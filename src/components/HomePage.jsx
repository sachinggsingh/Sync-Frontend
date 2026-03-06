import { useState, useEffect } from "react";
import { Users, PlusCircle } from "lucide-react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";

function HomePage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill username from Clerk user data
  useEffect(() => {
    if (user) {
      const displayName = user.fullName || user.username || user.firstName || "";
      setUsername(displayName);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    const trimmedRoomId = roomId.trim();

    if (!trimmedRoomId || !trimmedUsername) {
      toast.error("Please fill all the details");
      return;
    }

    setIsSubmitting(true);

    try {
      navigate("/room", {
        state: {
          roomId: trimmedRoomId,
          username: trimmedUsername,
        },
      });
      toast.success("Joined Successfully");
    } catch (error) {
      toast.error("Failed to join room");
      console.error("Navigation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoom = (e) => {
    e.preventDefault();
    try {
      const id = uuid();
      setRoomId(id);
      toast.success("Room Created Successfully");
    } catch (error) {
      toast.error("Failed to create room");
      console.error("Room creation error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-bl from-gray-900 to-gray-600 p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
          <div className="bg-gray-700 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center">
                  <Users className="mr-2" />
                  Join Room
                </h2>
                <p className="text-gray-300 mt-1">
                  Connect with others in real-time
                </p>
              </div>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-gray-300 text-sm">
                Your Name
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="roomId" className="text-gray-300 text-sm">
                Room ID
              </label>
              <input
                id="roomId"
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID or create new"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Joining..." : "Join Room"}
              </button>

              <button
                type="button"
                onClick={handleRoom}
                className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 border border-gray-600"
              >
                <PlusCircle size={18} />
                Create New Room
              </button>
            </div>
          </form>

          <div className="px-6 py-3 bg-gray-700 text-center">
            <p className="text-sm text-gray-400">
              By joining, you agree to our{" "}
              <a href="#" className="text-blue-400 hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-400 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
