import { memo } from 'react';
import { Play, Loader2 } from 'lucide-react';

const RunButton = memo(({ isRunning, onRun }) => (
  <button
    onClick={onRun}
    disabled={isRunning}
    className={`
      flex items-center px-4 py-2 text-white text-sm font-medium rounded-lg
      transition-all duration-200 transform active:scale-95
      ${isRunning
        ? 'bg-green-600 cursor-not-allowed opacity-80'
        : 'bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-green-500/20'
      }
    `}
    title={isRunning ? 'Code is running...' : 'Run code'}
  >
    {isRunning ? (
      <Loader2 size={16} className="mr-2 animate-spin" />
    ) : (
      <Play size={16} className="mr-2" />
    )}
    {isRunning ? 'Running...' : 'Run Code'}
  </button>
));

RunButton.displayName = 'RunButton';
export default RunButton;
