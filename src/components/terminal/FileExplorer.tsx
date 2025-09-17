import React, { useState } from 'react';
import { useTheme } from '../../core/theme/ThemeProvider';
import { themeStyles } from '../../core/theme/styles';

interface FileExplorerItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileExplorerItem[];
  expanded?: boolean;
}

interface FileExplorerProps {
  onDirectorySelect: (path: string) => void;
  selectedDirectory?: string;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  onDirectorySelect,
  selectedDirectory,
}) => {
  const { theme } = useTheme();
  const [rootDirectory, setRootDirectory] = useState<string>('');
  const [fileTree, setFileTree] = useState<FileExplorerItem[]>([]);
  const [loading, setLoading] = useState(false);

  const selectRootDirectory = async () => {
    if (!window.electronAPI) {
      console.error('File explorer functionality is only available in the Electron app');
      return;
    }

    try {
      setLoading(true);
      // Use Electron's dialog to select directory
      const result = await window.electronAPI.selectDirectory();
      if (result && !result.canceled && result.filePaths.length > 0) {
        const dirPath = result.filePaths[0];
        setRootDirectory(dirPath);
        await loadDirectory(dirPath);
        onDirectorySelect(dirPath);
      }
    } catch (error) {
      console.error('Error selecting directory:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDirectory = async (dirPath: string) => {
    if (!window.electronAPI) {
      console.error('File explorer functionality is only available in the Electron app');
      return;
    }

    try {
      const items = await window.electronAPI.readDirectory(dirPath);
      const fileTreeItems: FileExplorerItem[] = items.map((item: any) => ({
        name: item.name,
        path: item.path,
        type: item.type,
        expanded: false,
        children: item.type === 'directory' ? [] : undefined,
      }));
      setFileTree(fileTreeItems);
    } catch (error) {
      console.error('Error loading directory:', error);
    }
  };

  const toggleDirectory = async (item: FileExplorerItem, index: number) => {
    if (item.type !== 'directory' || !window.electronAPI) return;

    const newFileTree = [...fileTree];
    const targetItem = newFileTree[index];

    if (!targetItem.expanded) {
      // Load children if not already loaded
      if (!targetItem.children || targetItem.children.length === 0) {
        try {
          const items = await window.electronAPI.readDirectory(targetItem.path);
          targetItem.children = items.map((subItem: any) => ({
            name: subItem.name,
            path: subItem.path,
            type: subItem.type,
            expanded: false,
            children: subItem.type === 'directory' ? [] : undefined,
          }));
        } catch (error) {
          console.error('Error loading subdirectory:', error);
          return;
        }
      }
      targetItem.expanded = true;
    } else {
      targetItem.expanded = false;
    }

    setFileTree(newFileTree);
  };

  const handleDirectoryClick = (path: string) => {
    onDirectorySelect(path);
  };

  const renderFileTreeItem = (item: FileExplorerItem, index: number, depth = 0) => {
    const isSelected = selectedDirectory === item.path;
    const paddingLeft = `${depth * 16 + 8}px`;

    return (
      <div key={item.path}>
        <div
          className={`flex items-center py-1 px-2 text-sm cursor-pointer hover:bg-white/5 ${
            isSelected ? 'bg-purple-500/20 text-purple-300' : themeStyles.text.secondary[theme]
          }`}
          style={{ paddingLeft }}
          onClick={() => {
            if (item.type === 'directory') {
              toggleDirectory(item, index);
              handleDirectoryClick(item.path);
            }
          }}
        >
          {item.type === 'directory' && (
            <span className="mr-1 text-xs">
              {item.expanded ? '📂' : '📁'}
            </span>
          )}
          {item.type === 'file' && (
            <span className="mr-1 text-xs">📄</span>
          )}
          <span className="truncate">{item.name}</span>
        </div>
        {item.expanded && item.children && (
          <div>
            {item.children.map((child, childIndex) =>
              renderFileTreeItem(child, childIndex, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`h-full flex flex-col ${themeStyles.card[theme]} rounded-lg`}>
      <div className="p-4 border-b border-white/10">
        <h3 className={`text-lg font-semibold mb-3 ${themeStyles.text.primary[theme]}`}>
          File Explorer
        </h3>
        <button
          onClick={selectRootDirectory}
          disabled={loading}
          className={`w-full px-3 py-2 text-sm rounded-md transition-colors ${
            loading
              ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
              : 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300'
          }`}
        >
          {loading ? 'Loading...' : rootDirectory ? 'Change Directory' : 'Select Directory'}
        </button>
        {rootDirectory && (
          <div className={`mt-2 text-xs ${themeStyles.text.muted[theme]} truncate`}>
            {rootDirectory}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {fileTree.length > 0 ? (
          <div className="p-2">
            {fileTree.map((item, index) => renderFileTreeItem(item, index))}
          </div>
        ) : (
          <div className={`p-4 text-center ${themeStyles.text.muted[theme]}`}>
            {window.electronAPI ? (
              rootDirectory ? 'No files found' : 'Select a directory to explore'
            ) : (
              <>
                <p>File explorer is only available in the Electron app</p>
                <p className="text-xs mt-2">Run `npm run electron:dev` to start the full application</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;