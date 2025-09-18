import React, { useEffect } from 'react';
import { useMarkdownStore } from '../../core/state/markdownStore';
import { useTheme } from '../../core/theme/ThemeProvider';
import { themeStyles } from '../../core/theme/styles';

const FileDialog: React.FC = () => {
  const { theme } = useTheme();
  const {
    showFileDialog,
    setShowFileDialog,
    addSelectedFile,
    supportedExtensions
  } = useMarkdownStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showFileDialog) {
        setShowFileDialog(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showFileDialog, setShowFileDialog]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        // In a real Electron app, file.path would be available
        // For now, we'll use the file name as a placeholder
        addSelectedFile(file.name);
      });
    }
    setShowFileDialog(false);
  };

  const handleBrowseFiles = async () => {
    // Use Electron's native file dialog to get full file paths with permissions
    if (window.electronAPI) {
      try {
        const result = await window.electronAPI.selectFiles();
        if (!result.canceled && result.filePaths) {
          result.filePaths.forEach((filePath: string) => {
            addSelectedFile(filePath);
          });
        }
      } catch (error) {
        console.error('Failed to open file dialog:', error);
      }
    } else {
      // Fallback for browser development
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = supportedExtensions.join(',');

      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files) {
          Array.from(target.files).forEach(file => {
            addSelectedFile(file.name); // Browser fallback only has filename
          });
        }
      };

      input.click();
    }
    setShowFileDialog(false);
  };

  if (!showFileDialog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`${themeStyles.card[theme]} rounded-lg p-6 max-w-md w-full mx-4`}>
        <div className="text-center space-y-6">
          <div>
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold mb-2">Select Files to Convert</h3>
            <p className={`${themeStyles.text.secondary[theme]} text-sm`}>
              Choose files to convert to Markdown format
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleBrowseFiles}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Files
            </button>

            <div className="text-xs text-gray-400">
              <p className="mb-2">Supported formats:</p>
              <div className="grid grid-cols-2 gap-1 text-left">
                {supportedExtensions.slice(0, 12).map((ext) => (
                  <span key={ext} className="truncate">{ext}</span>
                ))}
                {supportedExtensions.length > 12 && (
                  <span className="col-span-2 text-center mt-1">
                    +{supportedExtensions.length - 12} more formats
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowFileDialog(false)}
            className="w-full border border-gray-600 hover:border-gray-500 text-gray-300 px-6 py-3 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Hidden file input for fallback */}
        <input
          type="file"
          multiple
          accept={supportedExtensions.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          id="file-input"
        />
      </div>
    </div>
  );
};

export default FileDialog;