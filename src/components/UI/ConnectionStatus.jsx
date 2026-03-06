import { memo } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Connection status indicator component
 * @param {Object} props - Component props
 * @param {boolean} props.isConnected - Connection status
 * @param {string} props.className - Additional CSS classes
 */
const ConnectionStatus = memo(({ isConnected, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {isConnected ? (
        <>
          <Wifi size={16} className="text-green-500" />
          <span className="text-xs text-green-500 font-medium">Connected</span>
        </>
      ) : (
        <>
          <WifiOff size={16} className="text-red-500" />
          <span className="text-xs text-red-500 font-medium">Disconnected</span>
        </>
      )}
    </div>
  );
});

ConnectionStatus.displayName = 'ConnectionStatus';

ConnectionStatus.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  className: PropTypes.string
};

export default ConnectionStatus;
