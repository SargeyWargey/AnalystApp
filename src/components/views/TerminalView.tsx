import React from 'react';
import { useTheme } from '../../core/theme/ThemeProvider';
import { themeStyles } from '../../core/theme/styles';

const TerminalView: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Integrated Terminal</h1>
        <div className={`${themeStyles.card[theme]} rounded-lg p-6`}>
          <p className={`${themeStyles.text.secondary[theme]} mb-4`}>
            File explorer with integrated terminal for efficient development workflow.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">File Explorer Features:</h3>
              <ul className={`text-sm ${themeStyles.text.secondary[theme]} space-y-1`}>
                <li>• Interactive folder tree navigation</li>
                <li>• File and directory listings</li>
                <li>• Context menu operations</li>
                <li>• Quick file preview</li>
                <li>• Search functionality</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Terminal Features:</h3>
              <ul className={`text-sm ${themeStyles.text.secondary[theme]} space-y-1`}>
                <li>• Cross-platform shell support</li>
                <li>• Multiple terminal sessions</li>
                <li>• Directory-contextual launching</li>
                <li>• Claude Code integration</li>
                <li>• Session management with tabs</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <p className="text-sm text-purple-200">
              🚧 This feature will be implemented in Phase 4
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalView;