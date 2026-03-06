import { memo } from 'react';
import { Loader2 } from 'lucide-react';
import Resizer from "../Layout/Resizer";

const OutputPanel = memo(({ output, isRunning, outputHeight, onResize }) => {
  const hasError = output?.toLowerCase().includes('error');

  return (
    <div
      className="absolute bottom-0 left-0 right-0 bg-gray-800 text-white overflow-hidden flex flex-col border-t border-gray-700"
      style={{ height: `${outputHeight}%` }}
    >
      <Resizer direction="vertical" onMouseDown={onResize} />
      <div
        className="h-1 w-full cursor-ns-resize bg-blue-500 opacity-0 hover:opacity-100 transition-opacity"
        onMouseDown={onResize}
      />

      <div className="flex justify-between items-center px-4 py-2 bg-gray-700">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          Output
          {isRunning && (
            <Loader2 className="animate-spin" size={14} />
          )}
        </h3>
        <div className="flex items-center gap-2">
          {isRunning && (
            <span className="text-xs text-blue-400">Running...</span>
          )}
          {!isRunning && output && (
            <span className={`text-xs ${hasError ? 'text-red-400' : 'text-green-400'}`}>
              {hasError ? 'Failed' : 'Success'}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto bg-gray-800">
        {output ? (
          <pre className={`text-sm whitespace-pre-wrap font-mono ${
            hasError ? 'text-red-300' : 'text-gray-300'
          }`}>
            {output}
          </pre>
        ) : (
          <div className="text-gray-400 text-sm italic">
            Run your code to see the output here
          </div>
        )}
      </div>
    </div>
  );
});

OutputPanel.displayName = 'OutputPanel';
export default OutputPanel;
