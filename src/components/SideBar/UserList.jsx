import { memo } from 'react';
import { User } from 'lucide-react';
import { getUserColor, getUserInitials } from '../../utils/userColors';

const UserList = memo(({ users }) => {
  const userCount = users.length;
  
  return (
    <div className="flex flex-col h-full">
      {/* User count header */}
      <div className="px-4 py-2 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">
            Online Users
          </span>
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
            {userCount}
          </span>
        </div>
      </div>

      {/* User list */}
      <div className="p-4 space-y-2 overflow-auto flex-1">
        {users.length === 0 ? (
          <div className="text-gray-400 text-sm text-center italic py-8">
            <User size={32} className="mx-auto mb-2 opacity-50" />
            No users connected
          </div>
        ) : (
          users.map((user) => {
            const color = getUserColor(user.username);
            const initials = getUserInitials(user.username);
            
            return (
              <div
                key={user.socketId}
                className="flex items-center gap-3 bg-gray-700 px-3 py-2 rounded-lg group hover:bg-gray-600 transition-all duration-200"
              >
                {/* User avatar with initials */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                  style={{ backgroundColor: color }}
                  title={user.username}
                >
                  {initials}
                </div>

                {/* Username */}
                <span className="text-gray-200 font-medium flex-1 truncate">
                  {user.username}
                </span>

                {/* Online indicator */}
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});

UserList.displayName = 'UserList';
export default UserList;

