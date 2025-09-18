import React, { useState, useCallback } from 'react';
import FileExplorer from '../terminal/FileExplorer';
import Terminal from '../terminal/Terminal';
import FilePreview from '../terminal/FilePreview';
import ResizableColumns from '../common/ResizableColumns';

const TerminalView: React.FC = () => {
  const [selectedDirectory, setSelectedDirectory] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<string>('');

  const handleDirectorySelect = (path: string) => {
    setSelectedDirectory(path);
  };

  const handleFileSelect = useCallback((path: string) => {
    setSelectedFile(path);
  }, []);

  return (
    <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
      <div className="h-full max-w-none mx-auto">
        <h1 className="text-3xl font-bold mb-6">Integrated Terminal</h1>

        <div className="h-[calc(100vh-200px)]">
          <ResizableColumns
            columns={[
              {
                id: 'file-explorer',
                content: (
                  <FileExplorer
                    onDirectorySelect={handleDirectorySelect}
                    onFileSelect={handleFileSelect}
                    selectedDirectory={selectedDirectory}
                  />
                ),
                minWidth: 200,
                defaultWidth: 300,
              },
              {
                id: 'file-preview',
                content: (
                  <FilePreview
                    filePath={selectedFile}
                  />
                ),
                minWidth: 200,
                defaultWidth: 400,
              },
              {
                id: 'terminal',
                content: (
                  <Terminal
                    workingDirectory={selectedDirectory}
                    onTerminalReady={(terminalId) => {
                      console.log('Terminal ready:', terminalId);
                    }}
                  />
                ),
                minWidth: 300,
                defaultWidth: 500,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default TerminalView;