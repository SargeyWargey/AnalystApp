import React, { useEffect } from 'react';
import { useTheme } from '../../core/theme/ThemeProvider';
import { themeStyles } from '../../core/theme/styles';

interface Shortcut {
  category: string;
  shortcuts: {
    keys: string;
    description: string;
  }[];
}

const shortcuts: Shortcut[] = [
  {
    category: 'Navigation',
    shortcuts: [
      { keys: 'Ctrl/Cmd + 1', description: 'Switch to Markdown Converter' },
      { keys: 'Ctrl/Cmd + 2', description: 'Switch to Terminal' },
      { keys: 'Ctrl/Cmd + 3', description: 'Switch to Settings' },
      { keys: 'Ctrl/Cmd + ,', description: 'Open Preferences (macOS)' },
    ]
  },
  {
    category: 'File Operations',
    shortcuts: [
      { keys: 'Ctrl/Cmd + I', description: 'Import File for Conversion' },
      { keys: 'Ctrl/Cmd + Shift + O', description: 'Select Output Directory' },
      { keys: 'Ctrl/Cmd + Enter', description: 'Start Conversion' },
      { keys: 'Ctrl/Cmd + Shift + R', description: 'Open Output Folder' },
    ]
  },
  {
    category: 'Terminal',
    shortcuts: [
      { keys: 'Ctrl/Cmd + T', description: 'New Terminal' },
      { keys: 'Ctrl/Cmd + W', description: 'Close Current Terminal' },
      { keys: 'Ctrl/Cmd + K', description: 'Clear Terminal' },
      { keys: 'Ctrl/Cmd + R', description: 'Reset Terminal' },
    ]
  },
  {
    category: 'View',
    shortcuts: [
      { keys: 'Ctrl/Cmd + +', description: 'Zoom In' },
      { keys: 'Ctrl/Cmd + -', description: 'Zoom Out' },
      { keys: 'Ctrl/Cmd + 0', description: 'Reset Zoom' },
      { keys: 'F11', description: 'Toggle Fullscreen' },
      { keys: 'F12', description: 'Toggle Developer Tools' },
    ]
  },
  {
    category: 'Editing',
    shortcuts: [
      { keys: 'Ctrl/Cmd + Z', description: 'Undo' },
      { keys: 'Ctrl/Cmd + Y', description: 'Redo' },
      { keys: 'Ctrl/Cmd + X', description: 'Cut' },
      { keys: 'Ctrl/Cmd + C', description: 'Copy' },
      { keys: 'Ctrl/Cmd + V', description: 'Paste' },
      { keys: 'Ctrl/Cmd + A', description: 'Select All' },
    ]
  },
  {
    category: 'Help',
    shortcuts: [
      { keys: 'Ctrl/Cmd + /', description: 'Show Keyboard Shortcuts' },
      { keys: 'F1', description: 'Open Documentation' },
    ]
  }
];

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className={`${themeStyles.card[theme]} rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto m-4 w-full`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shortcuts.map((category) => (
            <div key={category.category} className="space-y-3">
              <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className={`text-sm ${themeStyles.text.secondary[theme]}`}>
                      {shortcut.description}
                    </span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className={`text-sm ${themeStyles.text.secondary[theme]} text-center`}>
            Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Esc</kbd> to close this dialog
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;