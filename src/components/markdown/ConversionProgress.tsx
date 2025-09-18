import React, { useState } from 'react';
import { useMarkdownStore } from '../../core/state/markdownStore';
import { useTheme } from '../../core/theme/ThemeProvider';
import { themeStyles } from '../../core/theme/styles';
import { settingsService } from '../../core/settings/settingsService';

const ConversionProgress: React.FC = () => {
  const { theme } = useTheme();
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const {
    conversionJobs,
    removeConversionJob,
    clearCompletedJobs
  } = useMarkdownStore();

  const isDebugMode = settingsService.getSetting('enableDebugMode');

  const toggleLogExpansion = (jobId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(jobId)) {
      newExpanded.delete(jobId);
    } else {
      newExpanded.add(jobId);
    }
    setExpandedLogs(newExpanded);
  };

  const activeJobs = conversionJobs.filter(job => job.status === 'converting');
  const completedJobs = conversionJobs.filter(job => job.status === 'completed');
  const failedJobs = conversionJobs.filter(job => job.status === 'failed');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'converting': return '⚡';
      case 'completed': return '✅';
      case 'failed': return '❌';
      default: return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400';
      case 'converting': return 'text-blue-400';
      case 'completed': return 'text-green-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatDuration = (startTime: Date, endTime?: Date) => {
    const end = endTime || new Date();
    const duration = end.getTime() - startTime.getTime();
    const seconds = Math.floor(duration / 1000);

    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  if (conversionJobs.length === 0) {
    return (
      <div className={`${themeStyles.card[theme]} rounded-lg p-6`}>
        <h3 className="text-lg font-semibold mb-4">Conversion Status</h3>
        <div className="text-center py-6">
          <div className="text-4xl mb-2">📊</div>
          <p className={`${themeStyles.text.secondary[theme]}`}>
            No conversions in progress
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${themeStyles.card[theme]} rounded-lg p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Conversion Status</h3>
        {completedJobs.length > 0 && (
          <button
            onClick={clearCompletedJobs}
            className="text-sm text-gray-400 hover:text-gray-300 underline"
          >
            Clear Completed
          </button>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{activeJobs.length}</div>
          <div className="text-sm text-gray-400">Converting</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{completedJobs.length}</div>
          <div className="text-sm text-gray-400">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">{failedJobs.length}</div>
          <div className="text-sm text-gray-400">Failed</div>
        </div>
      </div>

      {/* Job List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {conversionJobs.map((job) => (
          <div key={job.id} className={`p-3 ${themeStyles.card[theme]} rounded-lg border border-gray-600`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <span className="text-xl">{getStatusIcon(job.status)}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {job.inputPath.split('/').pop() || job.inputPath.split('\\').pop()}
                  </p>
                  <p className={`text-sm ${themeStyles.text.secondary[theme]} truncate`}>
                    {job.outputPath}
                  </p>
                  {job.error && (
                    <p className="text-sm text-red-400 mt-1">{job.error}</p>
                  )}
                  {/* Debug mode: Show logs toggle */}
                  {isDebugMode && job.debugLogs && job.debugLogs.length > 0 && (
                    <button
                      onClick={() => toggleLogExpansion(job.id)}
                      className="text-xs text-blue-400 hover:text-blue-300 mt-1 underline"
                    >
                      {expandedLogs.has(job.id) ? 'Hide Debug Logs' : 'Show Debug Logs'} ({job.debugLogs.length})
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className={`text-sm font-medium ${getStatusColor(job.status)}`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatDuration(job.createdAt, job.completedAt)}
                  </div>
                </div>
                {job.status === 'converting' && (
                  <div className="w-16 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                )}
                <button
                  onClick={() => removeConversionJob(job.id)}
                  className="text-gray-400 hover:text-gray-300 p-1 rounded-full hover:bg-gray-600/50 transition-colors"
                  title="Remove job"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Expanded Debug Logs */}
            {isDebugMode && job.debugLogs && expandedLogs.has(job.id) && (
              <div className="mt-3 pt-3 border-t border-gray-600">
                <h5 className="text-xs font-semibold text-gray-300 mb-2">Debug Logs:</h5>
                <div className="bg-gray-900 rounded p-3 max-h-40 overflow-y-auto">
                  <div className="space-y-1">
                    {job.debugLogs.map((log, index) => (
                      <div key={index} className="text-xs font-mono text-gray-300">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversionProgress;