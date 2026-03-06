import { Loader2 } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Reusable loading spinner component
 * @param {Object} props - Component props
 * @param {string} props.size - Size of spinner: 'sm', 'md', 'lg'
 * @param {string} props.message - Optional loading message
 * @param {boolean} props.fullScreen - Whether to show full screen overlay
 */
const LoadingSpinner = ({ size = 'md', message = 'Loading...', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${spinnerSize} animate-spin text-blue-500`} />
      {message && (
        <p className="text-sm text-gray-400 animate-pulse">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  message: PropTypes.string,
  fullScreen: PropTypes.bool
};

export default LoadingSpinner;
