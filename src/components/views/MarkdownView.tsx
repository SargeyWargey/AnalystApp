import React, { useEffect } from 'react';
import { useMarkdownStore } from '../../core/state/markdownStore';
// Use mock service for browser development, real service for Electron
import { markdownConverter } from '../../core/services/markdownConverterMock';

// Import components
import FileDropZone from '../markdown/FileDropZone';
import FileImportArea from '../markdown/FileImportArea';
import DestinationManager from '../markdown/DestinationManager';
import ConversionControls from '../markdown/ConversionControls';
import ConversionProgress from '../markdown/ConversionProgress';
import FileDialog from '../markdown/FileDialog';

const MarkdownView: React.FC = () => {
  const { setSupportedExtensions } = useMarkdownStore();

  // Load supported extensions on component mount
  useEffect(() => {
    const loadSupportedExtensions = async () => {
      try {
        const result = await markdownConverter.getSupportedExtensions();
        if (result.success && result.extensions) {
          setSupportedExtensions(result.extensions);
        }
      } catch (error) {
        console.error('Failed to load supported extensions:', error);
      }
    };

    loadSupportedExtensions();
  }, [setSupportedExtensions]);

  return (
    <FileDropZone className="flex-1">
      <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">MarkDown Converter</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - File Import */}
            <div className="lg:col-span-2 space-y-6">
              <FileImportArea />
              <ConversionProgress />
            </div>

            {/* Right Column - Destination & Controls */}
            <div className="space-y-6">
              <DestinationManager />
              <ConversionControls />
            </div>
          </div>
        </div>
      </div>

      {/* File Dialog Modal */}
      <FileDialog />
    </FileDropZone>
  );
};

export default MarkdownView;