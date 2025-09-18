import React from 'react';
import { useMarkdownStore } from '../../core/state/markdownStore';
// Use mock service for browser development, real service for Electron
import { markdownConverter } from '../../core/services/markdownConverterMock';
import { useTheme } from '../../core/theme/ThemeProvider';
import { themeStyles } from '../../core/theme/styles';
import { settingsService } from '../../core/settings/settingsService';

const ConversionControls: React.FC = () => {
  const { theme } = useTheme();
  const {
    selectedFiles,
    destinationFolders,
    selectedDestinationId,
    isConverting,
    setIsConverting,
    addConversionJob,
    updateConversionJob,
    addDebugLog,
    clearSelectedFiles
  } = useMarkdownStore();

  const selectedDestination = destinationFolders.find(f => f.id === selectedDestinationId);
  const canConvert = selectedFiles.length > 0 && selectedDestination && !isConverting;

  const handleConvert = async () => {
    if (!canConvert) return;

    setIsConverting(true);

    // Check if debug mode is enabled
    const isDebugMode = settingsService.getSetting('enableDebugMode');

    try {
      // Process each file
      for (const inputPath of selectedFiles) {
        const outputPath = markdownConverter.generateOutputPath(inputPath, selectedDestination.path);

        // Create conversion job and get the actual job ID
        const jobData = {
          inputPath,
          outputPath,
          status: 'converting' as const,
          progress: 0,
          debugLogs: isDebugMode ? [] : undefined
        };

        const jobId = addConversionJob(jobData);

        // Debug logging function
        const debugLog = (message: string) => {
          if (isDebugMode) {
            addDebugLog(jobId, message);
          }
        };

        debugLog('Starting conversion process');
        debugLog(`File: ${inputPath.split('/').pop() || inputPath.split('\\').pop()}`);
        debugLog(`Destination: ${selectedDestination.path}`);

        try {
          // Update progress
          updateConversionJob(jobId, { progress: 25 });
          debugLog('Initializing converter');

          // Perform conversion with debug callback
          const result = await markdownConverter.convertFile(inputPath, outputPath, debugLog);

          updateConversionJob(jobId, { progress: 90 });

          if (result.success) {
            debugLog('Conversion process completed successfully');
            updateConversionJob(jobId, {
              status: 'completed',
              progress: 100,
              completedAt: new Date()
            });
          } else {
            debugLog(`Conversion failed with error: ${result.error}`);
            updateConversionJob(jobId, {
              status: 'failed',
              error: result.error,
              completedAt: new Date()
            });
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
          debugLog(`Exception during conversion: ${errorMsg}`);
          updateConversionJob(jobId, {
            status: 'failed',
            error: errorMsg,
            completedAt: new Date()
          });
        }
      }

      // Clear selected files after starting conversion
      clearSelectedFiles();
    } finally {
      setIsConverting(false);
    }
  };

  const getButtonText = () => {
    if (isConverting) return 'Converting...';
    if (selectedFiles.length === 0) return 'Select Files to Convert';
    if (!selectedDestination) return 'Select Destination Folder';
    return `Convert ${selectedFiles.length} File${selectedFiles.length === 1 ? '' : 's'}`;
  };

  const getButtonIcon = () => {
    if (isConverting) return '⚡';
    if (!canConvert) return '⚠️';
    return '🚀';
  };

  return (
    <div className={`${themeStyles.card[theme]} rounded-lg p-6`}>
      <h3 className="text-lg font-semibold mb-4">Convert Files</h3>

      {/* Conversion Summary */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className={`${themeStyles.text.secondary[theme]}`}>Files selected:</span>
          <span className="font-medium">{selectedFiles.length}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className={`${themeStyles.text.secondary[theme]}`}>Destination:</span>
          <span className="font-medium truncate ml-2">
            {selectedDestination ? selectedDestination.name : 'None selected'}
          </span>
        </div>
      </div>

      {/* Convert Button */}
      <button
        onClick={handleConvert}
        disabled={!canConvert}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
          canConvert
            ? 'bg-purple-600 hover:bg-purple-700 text-white'
            : 'bg-gray-600 opacity-50 text-gray-300 cursor-not-allowed'
        }`}
      >
        <span className="text-xl">{getButtonIcon()}</span>
        <span>{getButtonText()}</span>
      </button>

      {/* Progress Indicator */}
      {isConverting && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Converting files...</span>
            <span>Processing</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }} />
          </div>
        </div>
      )}

      {/* Validation Messages */}
      {selectedFiles.length === 0 && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-sm text-yellow-300">
            Please select files to convert using the import area above.
          </p>
        </div>
      )}

      {selectedFiles.length > 0 && !selectedDestination && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-300">
            Please select a destination folder for the converted files.
          </p>
        </div>
      )}

      {/* Quick Actions */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-600">
          <button
            onClick={clearSelectedFiles}
            className="text-sm text-gray-400 hover:text-gray-300 underline"
          >
            Clear selected files
          </button>
        </div>
      )}
    </div>
  );
};

export default ConversionControls;