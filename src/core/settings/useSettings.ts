import { useState, useEffect, useCallback } from 'react';
import { AppSettings, settingsService } from './settingsService';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(settingsService.getSettings());

  // Update local state when settings change
  useEffect(() => {

    // Listen for settings changes (if we add an event system later)
    // For now, we'll poll occasionally or update manually
    const interval = setInterval(() => {
      const currentSettings = settingsService.getSettings();
      setSettings(prev => {
        // Only update if settings actually changed
        if (JSON.stringify(prev) !== JSON.stringify(currentSettings)) {
          return currentSettings;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateSetting = useCallback(async <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    await settingsService.updateSetting(key, value);
    setSettings(settingsService.getSettings());
  }, []);

  const updateSettings = useCallback(async (updates: Partial<AppSettings>) => {
    await settingsService.updateSettings(updates);
    setSettings(settingsService.getSettings());
  }, []);

  const resetSettings = useCallback(async () => {
    await settingsService.resetSettings();
    setSettings(settingsService.getSettings());
  }, []);

  const addRecentFile = useCallback(async (filePath: string) => {
    await settingsService.addRecentFile(filePath);
    setSettings(settingsService.getSettings());
  }, []);

  const addRecentDirectory = useCallback(async (dirPath: string) => {
    await settingsService.addRecentDirectory(dirPath);
    setSettings(settingsService.getSettings());
  }, []);

  const removeRecentFile = useCallback(async (filePath: string) => {
    await settingsService.removeRecentFile(filePath);
    setSettings(settingsService.getSettings());
  }, []);

  const removeRecentDirectory = useCallback(async (dirPath: string) => {
    await settingsService.removeRecentDirectory(dirPath);
    setSettings(settingsService.getSettings());
  }, []);

  return {
    settings,
    updateSetting,
    updateSettings,
    resetSettings,
    addRecentFile,
    addRecentDirectory,
    removeRecentFile,
    removeRecentDirectory,
  };
}

export function useSetting<K extends keyof AppSettings>(key: K): [AppSettings[K], (value: AppSettings[K]) => Promise<void>] {
  const { settings, updateSetting } = useSettings();

  const setValue = useCallback(async (value: AppSettings[K]) => {
    await updateSetting(key, value);
  }, [key, updateSetting]);

  return [settings[key], setValue];
}