import React from 'react';
import { useTheme } from '../../core/theme/ThemeProvider';
import { themeStyles } from '../../core/theme/styles';

const MarkdownView: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">MarkDown Converter</h1>
        <div className={`${themeStyles.card[theme]} rounded-lg p-6`}>
          <p className={`${themeStyles.text.secondary[theme]} mb-4`}>
            Convert files to MarkDown format using the MarkItDown library.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Supported File Types:</h3>
              <ul className={`text-sm ${themeStyles.text.secondary[theme]} space-y-1`}>
                <li>• PDF documents</li>
                <li>• Microsoft Office (Word, Excel, PowerPoint)</li>
                <li>• Images (with OCR capabilities)</li>
                <li>• HTML files</li>
                <li>• CSV, JSON, XML</li>
                <li>• ZIP archives</li>
                <li>• Audio files (with transcription)</li>
                <li>• EPub documents</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Features:</h3>
              <ul className={`text-sm ${themeStyles.text.secondary[theme]} space-y-1`}>
                <li>• Drag and drop file import</li>
                <li>• Batch conversion</li>
                <li>• Custom output destinations</li>
                <li>• Progress tracking</li>
                <li>• Conversion history</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <p className="text-sm text-purple-200">
              🚧 This feature will be implemented in Phase 3
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownView;