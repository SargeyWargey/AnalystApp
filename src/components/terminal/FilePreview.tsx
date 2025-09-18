import React, { useState, useEffect } from 'react';
import { useTheme } from '../../core/theme/ThemeProvider';
import { themeStyles } from '../../core/theme/styles';

interface FilePreviewProps {
  filePath: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({ filePath }) => {
  const { theme } = useTheme();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; ext: string } | null>(null);

  useEffect(() => {
    if (!filePath) {
      setContent('');
      setFileInfo(null);
      setError('');
      return;
    }

    const loadFileContent = async () => {
      if (!window.electronAPI) {
        setError('File preview is only available in the Electron app');
        return;
      }

      try {
        setLoading(true);
        setError('');

        // Get file info
        const pathParts = filePath.split(/[/\\]/);
        const fileName = pathParts[pathParts.length - 1];
        const extMatch = fileName.match(/\.([^.]+)$/);
        const extension = extMatch ? extMatch[1].toLowerCase() : '';

        // Check if file is readable (text file)
        const textExtensions = [
          'txt', 'md', 'js', 'ts', 'tsx', 'jsx', 'json', 'css', 'scss', 'html', 'xml',
          'yml', 'yaml', 'py', 'java', 'c', 'cpp', 'h', 'hpp', 'go', 'rs', 'php',
          'rb', 'sh', 'bat', 'ps1', 'sql', 'log', 'ini', 'conf', 'env', 'gitignore',
          'dockerfile', 'makefile', 'cmake', 'toml', 'lock', 'svg'
        ];

        const isTextFile = textExtensions.includes(extension) || !extension;

        if (!isTextFile) {
          const stats = await window.electronAPI.getFileStats(filePath);
          setFileInfo({
            name: fileName,
            size: stats.size,
            ext: extension || 'unknown'
          });
          setContent('');
          return;
        }

        // Read file content
        const fileContent = await window.electronAPI.readFile(filePath);
        const stats = await window.electronAPI.getFileStats(filePath);

        setContent(fileContent);
        setFileInfo({
          name: fileName,
          size: stats.size,
          ext: extension || 'text'
        });
      } catch (err) {
        console.error('Error reading file:', err);
        setError(`Failed to read file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    loadFileContent();
  }, [filePath]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };


  return (
    <div className={`h-full flex flex-col ${themeStyles.card[theme]} rounded-lg`}>
      <div className="p-4 border-b border-white/10">
        <h3 className={`text-lg font-semibold mb-2 ${themeStyles.text.primary[theme]}`}>
          File Preview
        </h3>
        {fileInfo && (
          <div className={`text-sm ${themeStyles.text.muted[theme]} space-y-1`}>
            <div className="truncate">
              <span className="font-medium">Name:</span> {fileInfo.name}
            </div>
            <div>
              <span className="font-medium">Size:</span> {formatFileSize(fileInfo.size)}
            </div>
            <div>
              <span className="font-medium">Type:</span> {fileInfo.ext}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {loading && (
          <div className={`p-4 text-center ${themeStyles.text.muted[theme]}`}>
            Loading file...
          </div>
        )}

        {error && (
          <div className="p-4 text-center text-red-400">
            {error}
          </div>
        )}

        {!filePath && !loading && !error && (
          <div className={`p-4 text-center ${themeStyles.text.muted[theme]}`}>
            Select a file to preview
          </div>
        )}

        {filePath && !loading && !error && !content && fileInfo && (
          <div className={`p-4 text-center ${themeStyles.text.muted[theme]}`}>
            <div className="mb-4">
              <span className="text-4xl">📄</span>
            </div>
            <div>
              Binary file or unsupported format
            </div>
            <div className="text-xs mt-2">
              {fileInfo.ext.toUpperCase()} file • {formatFileSize(fileInfo.size)}
            </div>
          </div>
        )}

        {content && (
          <div className="h-full overflow-auto">
            <pre className={`p-4 text-sm font-mono leading-relaxed ${themeStyles.text.secondary[theme]} whitespace-pre-wrap break-words`}>
              {content}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePreview;