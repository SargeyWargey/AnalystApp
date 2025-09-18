import React, { useState, useRef, useCallback, useEffect } from 'react';

interface Column {
  id: string;
  content: React.ReactNode;
  minWidth: number;
  defaultWidth: number;
}

interface ResizableColumnsProps {
  columns: Column[];
}

const ResizableColumns: React.FC<ResizableColumnsProps> = ({ columns }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnWidths, setColumnWidths] = useState<number[]>(() =>
    columns.map(col => col.defaultWidth)
  );
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartWidths, setDragStartWidths] = useState<number[]>([]);

  // Adjust widths to fit container on mount and resize
  useEffect(() => {
    const adjustWidths = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const currentTotal = columnWidths.reduce((sum, width) => sum + width, 0);
      const separatorWidth = (columns.length - 1) * 4; // 4px for each separator
      const availableWidth = containerWidth - separatorWidth;

      if (currentTotal !== availableWidth) {
        const ratio = availableWidth / currentTotal;
        const newWidths = columnWidths.map((width, index) => {
          const newWidth = width * ratio;
          return Math.max(newWidth, columns[index].minWidth);
        });
        setColumnWidths(newWidths);
      }
    };

    adjustWidths();
    window.addEventListener('resize', adjustWidths);
    return () => window.removeEventListener('resize', adjustWidths);
  }, [columns, columnWidths]);

  const handleMouseDown = useCallback((e: React.MouseEvent, separatorIndex: number) => {
    e.preventDefault();
    setIsDragging(separatorIndex);
    setDragStartX(e.clientX);
    setDragStartWidths([...columnWidths]);
  }, [columnWidths]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging === null || !containerRef.current) return;

    const deltaX = e.clientX - dragStartX;
    const newWidths = [...dragStartWidths];

    // Adjust the width of the column being resized and the next column
    const leftIndex = isDragging;
    const rightIndex = isDragging + 1;

    const leftColumn = columns[leftIndex];
    const rightColumn = columns[rightIndex];

    const newLeftWidth = Math.max(
      leftColumn.minWidth,
      dragStartWidths[leftIndex] + deltaX
    );
    const newRightWidth = Math.max(
      rightColumn.minWidth,
      dragStartWidths[rightIndex] - deltaX
    );

    // Only update if both columns can maintain their minimum widths
    const leftDelta = newLeftWidth - dragStartWidths[leftIndex];
    const rightDelta = dragStartWidths[rightIndex] - newRightWidth;

    if (leftDelta === -rightDelta) {
      newWidths[leftIndex] = newLeftWidth;
      newWidths[rightIndex] = newRightWidth;
      setColumnWidths(newWidths);
    }
  }, [isDragging, dragStartX, dragStartWidths, columns]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
    setDragStartX(0);
    setDragStartWidths([]);
  }, []);

  useEffect(() => {
    if (isDragging !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div ref={containerRef} className="flex h-full w-full">
      {columns.map((column, index) => (
        <React.Fragment key={column.id}>
          <div
            className="flex flex-col min-h-0"
            style={{ width: `${columnWidths[index]}px` }}
          >
            {column.content}
          </div>

          {index < columns.length - 1 && (
            <div
              className="w-1 cursor-col-resize flex-shrink-0 border-white/10 hover:bg-purple-500/30 transition-colors"
              onMouseDown={(e) => handleMouseDown(e, index)}
            >
              <div className="w-full h-full bg-white/10 hover:bg-white/20 transition-colors" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ResizableColumns;