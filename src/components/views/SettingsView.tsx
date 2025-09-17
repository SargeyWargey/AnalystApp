import React, { useState } from 'react';
import { useTheme } from '../../core/theme/ThemeProvider';
import { themeStyles } from '../../core/theme/styles';
import { useSettings } from '../../core/settings/useSettings';

const SettingsView: React.FC = () => {
  const { theme } = useTheme();
  const { settings, updateSetting, resetSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<'appearance' | 'markdown' | 'terminal' | 'advanced'>('appearance');

  const tabs = [
    { id: 'appearance', label: 'Appearance' },
    { id: 'markdown', label: 'Markdown' },
    { id: 'terminal', label: 'Terminal' },
    { id: 'advanced', label: 'Advanced' },
  ] as const;

  return (
    <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className={`${themeStyles.card[theme]} rounded-lg p-6`}>
          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Appearance</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${themeStyles.text.secondary[theme]}`}>
                    Theme
                  </label>
                  <select
                    value={settings.theme}
                    onChange={(e) => updateSetting('theme', e.target.value as 'light' | 'dark' | 'system')}
                    className={`${themeStyles.input[theme]} rounded-lg px-3 py-2 focus:outline-none focus:ring-2`}
                  >
                    <option value="system">System</option>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${themeStyles.text.secondary[theme]}`}>
                    Font Size
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="24"
                    value={settings.fontSize}
                    onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500">{settings.fontSize}px</div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.sidebarCollapsed}
                      onChange={(e) => updateSetting('sidebarCollapsed', e.target.checked)}
                      className="mr-2"
                    />
                    <span className={`text-sm ${themeStyles.text.secondary[theme]}`}>
                      Start with sidebar collapsed
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Markdown Tab */}
          {activeTab === 'markdown' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Markdown Converter</h3>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${themeStyles.text.secondary[theme]}`}>
                    Default Output Directory
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={settings.defaultOutputDirectory || ''}
                      onChange={(e) => updateSetting('defaultOutputDirectory', e.target.value || undefined)}
                      placeholder="Select a default output directory"
                      className={`${themeStyles.input[theme]} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 flex-1`}
                    />
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Browse
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.preserveFileStructure}
                      onChange={(e) => updateSetting('preserveFileStructure', e.target.checked)}
                      className="mr-2"
                    />
                    <span className={`text-sm ${themeStyles.text.secondary[theme]}`}>
                      Preserve file structure in output
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.showConversionProgress}
                      onChange={(e) => updateSetting('showConversionProgress', e.target.checked)}
                      className="mr-2"
                    />
                    <span className={`text-sm ${themeStyles.text.secondary[theme]}`}>
                      Show conversion progress
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.autoOpenOutput}
                      onChange={(e) => updateSetting('autoOpenOutput', e.target.checked)}
                      className="mr-2"
                    />
                    <span className={`text-sm ${themeStyles.text.secondary[theme]}`}>
                      Auto-open output files after conversion
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Terminal Tab */}
          {activeTab === 'terminal' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Terminal</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${themeStyles.text.secondary[theme]}`}>
                    Font Size
                  </label>
                  <input
                    type="range"
                    min="8"
                    max="32"
                    value={settings.terminalFontSize}
                    onChange={(e) => updateSetting('terminalFontSize', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500">{settings.terminalFontSize}px</div>
                </div>

                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${themeStyles.text.secondary[theme]}`}>
                    Font Family
                  </label>
                  <input
                    type="text"
                    value={settings.terminalFontFamily}
                    onChange={(e) => updateSetting('terminalFontFamily', e.target.value)}
                    className={`${themeStyles.input[theme]} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 w-full`}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${themeStyles.text.secondary[theme]}`}>
                    Max History Lines
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    value={settings.maxTerminalHistory}
                    onChange={(e) => updateSetting('maxTerminalHistory', parseInt(e.target.value))}
                    className={`${themeStyles.input[theme]} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 w-full`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.clearTerminalOnStart}
                      onChange={(e) => updateSetting('clearTerminalOnStart', e.target.checked)}
                      className="mr-2"
                    />
                    <span className={`text-sm ${themeStyles.text.secondary[theme]}`}>
                      Clear terminal on startup
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Advanced</h3>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.enableDebugMode}
                      onChange={(e) => updateSetting('enableDebugMode', e.target.checked)}
                      className="mr-2"
                    />
                    <span className={`text-sm ${themeStyles.text.secondary[theme]}`}>
                      Enable debug mode
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.checkForUpdates}
                      onChange={(e) => updateSetting('checkForUpdates', e.target.checked)}
                      className="mr-2"
                    />
                    <span className={`text-sm ${themeStyles.text.secondary[theme]}`}>
                      Check for updates automatically
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.sendUsageStatistics}
                      onChange={(e) => updateSetting('sendUsageStatistics', e.target.checked)}
                      className="mr-2"
                    />
                    <span className={`text-sm ${themeStyles.text.secondary[theme]}`}>
                      Send anonymous usage statistics
                    </span>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${themeStyles.text.secondary[theme]}`}>
                    Error Log Size Limit
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={settings.maxErrorLogSize}
                    onChange={(e) => updateSetting('maxErrorLogSize', parseInt(e.target.value))}
                    className={`${themeStyles.input[theme]} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 w-32`}
                  />
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium mb-4">Recent Items</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className={`text-sm font-medium ${themeStyles.text.secondary[theme]} mb-2`}>
                        Recent Files ({settings.recentFiles.length})
                      </h5>
                      {settings.recentFiles.length > 0 ? (
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {settings.recentFiles.map((file, index) => (
                            <div key={index} className="text-xs text-gray-500 truncate">
                              {file}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">No recent files</div>
                      )}
                    </div>

                    <div>
                      <h5 className={`text-sm font-medium ${themeStyles.text.secondary[theme]} mb-2`}>
                        Recent Directories ({settings.recentDirectories.length})
                      </h5>
                      {settings.recentDirectories.length > 0 ? (
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {settings.recentDirectories.map((dir, index) => (
                            <div key={index} className="text-xs text-gray-500 truncate">
                              {dir}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">No recent directories</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium mb-4">Actions</h4>
                  <div className="flex gap-4">
                    <button
                      onClick={resetSettings}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Reset to Defaults
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Application Info */}
        <div className={`${themeStyles.card[theme]} rounded-lg p-6 mt-6`}>
          <h3 className="text-lg font-semibold mb-4">Application Information</h3>
          <div className={`grid grid-cols-2 gap-4 text-sm ${themeStyles.text.secondary[theme]}`}>
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
            <div className="flex justify-between">
              <span>Phase:</span>
              <span>5 - Polish & Testing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;