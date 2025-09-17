import React, { useState } from 'react';
import FileExplorer from '../terminal/FileExplorer';
import Terminal from '../terminal/Terminal';

const TerminalView: React.FC = () => {
  const [selectedDirectory, setSelectedDirectory] = useState<string>('');

  const handleDirectorySelect = (path: string) => {
    setSelectedDirectory(path);
  };

  return (
    <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
      <div className="h-full max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Integrated Terminal</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* File Explorer - Left Half */}
          <div className="min-h-0">
            <FileExplorer
              onDirectorySelect={handleDirectorySelect}
              selectedDirectory={selectedDirectory}
            />
          </div>

          {/* Terminal - Right Half */}
          <div className="min-h-0">
            <Terminal
              workingDirectory={selectedDirectory}
              onTerminalReady={(terminalId) => {
                console.log('Terminal ready:', terminalId);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalView;