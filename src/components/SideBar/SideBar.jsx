import { memo } from 'react';
import { LogOut, Copy, Check } from "lucide-react";
import UserList from "./UserList";
import Resizer from "../Layout/Resizer";
import { useState } from 'react';
import toast from 'react-hot-toast';
import ConnectionStatus from '../UI/ConnectionStatus';
import PropTypes from 'prop-types';

const Sidebar = memo(({ roomId, users, onLeave, startSidebarResize, sidebarWidth, isConnected = true }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setIsCopied(true);
      toast.success('Room ID copied to clipboard');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy Room ID');
      console.error('Copy error:', error);
    }
  };

  return (
    <div
      className="bg-gray-800 shadow-lg flex flex-col justify-between border-r border-gray-700 transition-all duration-300 relative"
      style={{ width: `${sidebarWidth}%` }}
    >
      <Resizer direction="horizontal" onMouseDown={startSidebarResize} />
      <div>
        <div className="p-4 border-b border-gray-700">
          {/* Connection Status */}
          <div className="mb-3 pb-3 border-b border-gray-700">
            <ConnectionStatus isConnected={isConnected} />
          </div>

          <div className="flex items-center justify-between gap-2 mb-4">
            <h1 className="text-lg font-bold text-blue-400">Room ID</h1>
            <button
              onClick={handleCopyRoomId}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title="Copy Room ID"
              aria-label="Copy Room ID to clipboard"
            >
              {isCopied ? (
                <Check size={16} className="text-green-400" />
              ) : (
                <Copy size={16} className="text-gray-400 hover:text-white" />
              )}
            </button>
          </div>
          <div className="bg-gray-700 p-2 rounded-md">
            <code className="text-sm text-gray-300 break-all">{roomId}</code>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <h2 className="text-sm text-gray-400">Connected Users</h2>
            <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-blue-400">
              {users.length} online
            </span>
          </div>
        </div>
        <UserList users={users} />
      </div>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onLeave}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
          aria-label="Leave the room"
        >
          <LogOut className="mr-2" size={16} />
          Leave Room
        </button>
      </div>

      <div
        className="absolute top-0 right-0 h-full w-1 cursor-ew-resize bg-blue-500 opacity-0 hover:opacity-100"
        onMouseDown={startSidebarResize}
      ></div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

Sidebar.propTypes = {
  roomId: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({
    socketId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
  })).isRequired,
  onLeave: PropTypes.func.isRequired,
  startSidebarResize: PropTypes.func.isRequired,
  sidebarWidth: PropTypes.number.isRequired,
  isConnected: PropTypes.bool
};

export default Sidebar;

