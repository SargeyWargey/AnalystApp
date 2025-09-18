import React, { useState } from 'react';
import { useMarkdownStore } from '../../core/state/markdownStore';
import { useTheme } from '../../core/theme/ThemeProvider';
import { themeStyles } from '../../core/theme/styles';

const DestinationManager: React.FC = () => {
  const { theme } = useTheme();
  const {
    destinationFolders,
    selectedDestinationId,
    addDestinationFolder,
    removeDestinationFolder,
    setSelectedDestination
  } = useMarkdownStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newFolderPath, setNewFolderPath] = useState('');
  const [newFolderName, setNewFolderName] = useState('');

  const handleAddFolder = () => {
    if (newFolderPath.trim() && newFolderName.trim()) {
      addDestinationFolder({
        path: newFolderPath.trim(),
        name: newFolderName.trim(),
        isDefault: destinationFolders.length === 0
      });
      setNewFolderPath('');
      setNewFolderName('');
      setShowAddForm(false);
    }
  };

  const handleBrowseFolder = async () => {
    try {
      const result = await (window as any).electronAPI.selectFolder();
      if (result && !result.canceled && result.filePaths.length > 0) {
        const folderPath = result.filePaths[0];
        setNewFolderPath(folderPath);
        if (!newFolderName) {
          const folderName = folderPath.split('/').pop() || folderPath.split('\\').pop() || 'New Folder';
          setNewFolderName(folderName);
        }
      }
    } catch (error) {
      console.error('Failed to select folder:', error);
      // Fallback to prompt if Electron API is not available
      const folderPath = prompt('Enter folder path:');
      if (folderPath) {
        setNewFolderPath(folderPath);
        if (!newFolderName) {
          const folderName = folderPath.split('/').pop() || folderPath.split('\\').pop() || 'New Folder';
          setNewFolderName(folderName);
        }
      }
    }
  };

  const selectedFolder = destinationFolders.find(f => f.id === selectedDestinationId);

  return (
    <div className="space-y-6">
      {/* Current Destination */}
      <div className={`${themeStyles.card[theme]} rounded-lg p-6`}>
        <h3 className="text-lg font-semibold mb-4">Output Destination</h3>

        {selectedFolder ? (
          <div className="space-y-3">
            <div className={`p-3 ${themeStyles.card[theme]} rounded-lg border-2 border-purple-500/30`}>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📁</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{selectedFolder.name}</p>
                  <p className={`text-sm ${themeStyles.text.secondary[theme]} truncate`}>
                    {selectedFolder.path}
                  </p>
                </div>
                {selectedFolder.isDefault && (
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-4xl mb-2">📂</div>
            <p className={`${themeStyles.text.secondary[theme]} mb-4`}>
              No destination folder selected
            </p>
          </div>
        )}
      </div>

      {/* Available Destinations */}
      {destinationFolders.length > 0 && (
        <div className={`${themeStyles.card[theme]} rounded-lg p-6`}>
          <h4 className="text-lg font-semibold mb-4">Available Destinations</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {destinationFolders.map((folder) => (
              <div
                key={folder.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  folder.id === selectedDestinationId
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onClick={() => setSelectedDestination(folder.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <span className="text-xl">📁</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{folder.name}</p>
                      <p className={`text-sm ${themeStyles.text.secondary[theme]} truncate`}>
                        {folder.path}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {folder.isDefault && (
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDestinationFolder(folder.id);
                      }}
                      className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-red-500/10 transition-colors"
                      title="Remove folder"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Destination */}
      <div className={`${themeStyles.card[theme]} rounded-lg p-6`}>
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-3 border-2 border-dashed border-purple-500/30 hover:border-purple-500/50 rounded-lg text-purple-300 hover:text-purple-200 transition-colors"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Destination Folder</span>
            </div>
          </button>
        ) : (
          <div className="space-y-4">
            <h4 className="font-semibold">Add New Destination</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Folder Name</label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  className={`w-full px-3 py-2 rounded-lg border ${themeStyles.input[theme]}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Folder Path</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newFolderPath}
                    onChange={(e) => setNewFolderPath(e.target.value)}
                    placeholder="Enter or browse for folder path"
                    className={`flex-1 px-3 py-2 rounded-lg border ${themeStyles.input[theme]}`}
                  />
                  <button
                    onClick={handleBrowseFolder}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Browse
                  </button>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleAddFolder}
                disabled={!newFolderPath.trim() || !newFolderName.trim()}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add Folder
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewFolderPath('');
                  setNewFolderName('');
                }}
                className="px-4 py-2 border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationManager;