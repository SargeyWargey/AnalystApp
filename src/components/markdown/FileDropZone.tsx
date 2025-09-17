import React, { useCallback, useRef } from 'react';
import { useMarkdownStore } from '../../core/state/markdownStore';
import { useTheme } from '../../core/theme/ThemeProvider';
import { themeStyles } from '../../core/theme/styles';

interface FileDropZoneProps {
  children: React.ReactNode;
  className?: string;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ children, className = '' }) => {
  const { theme } = useTheme();
  const {
    dragActive,
    setDragActive,
    addSelectedFile,
    supportedExtensions
  } = useMarkdownStore();

  const dragCounter = useRef(0);

  const isFileSupported = (file: File): boolean => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    return supportedExtensions.includes(extension);
  };

  const handleFiles = useCallback((files: FileList) => {
    Array.from(files).forEach(file => {
      if (isFileSupported(file)) {
        // In a real Electron app, we would use the file path
        // For now, use the file name as a placeholder
        addSelectedFile(file.name);
      }
    });
  }, [addSelectedFile, supportedExtensions]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, [setDragActive]);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragActive(false);
    }
  }, [setDragActive]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    dragCounter.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles, setDragActive]);

  return (
    <div
      className={`${className} ${dragActive ? 'drag-active' : ''}`}
      onDrag={handleDrag}
      onDragStart={handleDrag}
      onDragEnd={handleDrag}
      onDragOver={handleDrag}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDrop={handleDrop}
    >
      {children}
      {dragActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`${themeStyles.card[theme]} border-2 border-dashed border-purple-400 rounded-lg p-8 max-w-md mx-4`}>
            <div className="text-center">
              <div className="text-4xl mb-4">📁</div>
              <h3 className="text-xl font-semibold mb-2">Drop Files Here</h3>
              <p className={`${themeStyles.text.secondary[theme]} text-sm`}>
                Drop your files to convert them to Markdown
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileDropZone;