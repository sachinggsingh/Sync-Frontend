import { memo } from 'react';

const Resizer = memo(({ direction = "vertical", onMouseDown }) => {
  const baseStyle = "bg-gray-700 hover:bg-blue-500 transition-colors duration-200";
  const cursor = direction === "vertical" ? "cursor-row-resize" : "cursor-col-resize";
  const size = direction === "vertical" ? "h-2 w-full" : "w-2 h-full";
  const position = direction === "vertical" ? "" : "absolute right-0 top-0";

  return (
    <div
      className={`${baseStyle} ${cursor} ${size} ${position} opacity-0 hover:opacity-100 transition-opacity duration-200`}
      onMouseDown={onMouseDown}
      role="separator"
      aria-orientation={direction}
      aria-label={`${direction} resizer`}
      title={`Drag to resize ${direction === "vertical" ? "height" : "width"}`}
    />
  );
});

Resizer.displayName = 'Resizer';
export default Resizer;
