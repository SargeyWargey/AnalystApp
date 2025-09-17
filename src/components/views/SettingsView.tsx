import React from 'react';
import { useAppStore } from '../../core/state/store';
import { useTheme } from '../../core/theme/ThemeProvider';
import { themeStyles } from '../../core/theme/styles';

const SettingsView: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <div className={`${themeStyles.card[theme]} rounded-lg p-6`}>
          <div className="space-y-6">
            {/* Theme Settings */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Appearance</h3>
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${themeStyles.text.secondary[theme]}`}>Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as 'dark' | 'light')}
                  className={`${themeStyles.input[theme]} rounded-lg px-3 py-2 focus:outline-none focus:ring-2`}
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
            </div>

            {/* Application Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Application Information</h3>
              <div className={`space-y-2 text-sm ${themeStyles.text.secondary[theme]}`}>
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span>1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Build:</span>
                  <span>Development</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform:</span>
                  <span>Electron + React</span>
                </div>
              </div>
            </div>

            {/* Development Status */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Development Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${themeStyles.text.secondary[theme]}`}>Phase 1: Project Setup</span>
                  <span className="text-green-400 text-sm">✅ Complete</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${themeStyles.text.secondary[theme]}`}>Phase 2: Core Foundation</span>
                  <span className="text-green-400 text-sm">✅ Complete</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${themeStyles.text.secondary[theme]}`}>Phase 3: MarkDown Tool</span>
                  <span className="text-gray-500 text-sm">⏳ Pending</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${themeStyles.text.secondary[theme]}`}>Phase 4: Terminal Tool</span>
                  <span className="text-gray-500 text-sm">⏳ Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;