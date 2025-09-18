import React from 'react';
import { useMarkdownStore } from '../../core/state/markdownStore';
import { useTheme } from '../../core/theme/ThemeProvider';
import { themeStyles } from '../../core/theme/styles';

const FileImportArea: React.FC = () => {
  const { theme } = useTheme();
  const {
    selectedFiles,
    removeSelectedFile,
    addSelectedFile,
    supportedExtensions
  } = useMarkdownStore();

  const handleFileSelect = async () => {
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
  };

  // Utility function for future use when file sizes are available
  // const formatFileSize = (bytes: number): string => {
  //   if (bytes === 0) return '0 Bytes';
  //   const k = 1024;
  //   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  //   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  // };

  const getFileIcon = (fileName: string): string => {
    const extension = '.' + fileName.split('.').pop()?.toLowerCase();

    if (['.pdf'].includes(extension)) return '📄';
    if (['.docx', '.doc'].includes(extension)) return '📝';
    if (['.pptx', '.ppt'].includes(extension)) return '📊';
    if (['.xlsx', '.xls', '.csv'].includes(extension)) return '📈';
    if (['.jpg', '.jpeg', '.png', '.bmp', '.gif'].includes(extension)) return '🖼️';
    if (['.mp3', '.wav', '.m4a', '.flac'].includes(extension)) return '🎵';
    if (['.html', '.htm'].includes(extension)) return '🌐';
    if (['.zip'].includes(extension)) return '📦';
    if (['.epub'].includes(extension)) return '📚';
    return '📄';
  };

  return (
    <div className="space-y-6">
      {/* Import Area */}
      <div className={`${themeStyles.card[theme]} rounded-lg p-6 border-2 border-dashed border-purple-500/30 hover:border-purple-500/50 transition-colors`}>
        <div className="text-center space-y-4">
          <div className="text-6xl">📁</div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Import Files</h3>
            <p className={`${themeStyles.text.secondary[theme]} mb-4`}>
              Drag and drop files here or click to browse
            </p>
            <button
              onClick={handleFileSelect}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Browse Files
            </button>
          </div>
          <div className="text-xs text-gray-500">
            <p>Supported formats:</p>
            <p className="mt-1">
              {supportedExtensions.slice(0, 8).join(', ')}
              {supportedExtensions.length > 8 && ` +${supportedExtensions.length - 8} more`}
            </p>
          </div>
        </div>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className={`${themeStyles.card[theme]} rounded-lg p-6`}>
          <h4 className="text-lg font-semibold mb-4">Selected Files ({selectedFiles.length})</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div key={index} className={`flex items-center justify-between p-3 ${themeStyles.card[theme]} rounded-lg border border-purple-500/20`}>
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <span className="text-2xl">{getFileIcon(file)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.split('/').pop() || file.split('\\').pop()}</p>
                    <p className={`text-sm ${themeStyles.text.secondary[theme]} truncate`}>{file}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeSelectedFile(file)}
                  className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-red-500/10 transition-colors"
                  title="Remove file"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileImportArea;