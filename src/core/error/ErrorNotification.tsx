import React, { useState, useEffect } from 'react';
import { AppError, errorHandler } from './errorHandler';

interface ErrorNotificationProps {
  error: AppError;
  onDismiss: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  error,
  onDismiss,
  autoClose = true,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300); // Wait for animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onDismiss]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  if (!isVisible) {
    return null;
  }

  const userMessage = errorHandler.getUserFriendlyMessage(error);

  return (
    <div className={`fixed top-4 right-4 max-w-md bg-red-50 dark:bg-red-900/90 border border-red-200 dark:border-red-800 rounded-lg shadow-lg z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
    }`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="text-red-400 text-xl">⚠️</div>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              Error Occurred
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {userMessage}
            </p>
            {error.details && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="mt-2 text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
              >
                {showDetails ? 'Hide details' : 'Show details'}
              </button>
            )}
            {showDetails && error.details && (
              <div className="mt-2 p-2 bg-red-100 dark:bg-red-800/50 rounded text-xs text-red-800 dark:text-red-200 font-mono overflow-auto max-h-32">
                <div className="font-bold mb-1">Error Code: {error.code}</div>
                <div className="mb-1">Time: {error.timestamp.toLocaleString()}</div>
                {error.details && (
                  <div className="whitespace-pre-wrap">{error.details}</div>
                )}
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleClose}
              className="inline-flex text-red-400 hover:text-red-600 dark:hover:text-red-200 transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ErrorNotificationManagerProps {
  className?: string;
}

export const ErrorNotificationManager: React.FC<ErrorNotificationManagerProps> = ({
  className = ""
}) => {
  const [errors, setErrors] = useState<AppError[]>([]);

  useEffect(() => {
    // Listen for new errors
    const checkForErrors = () => {
      const errorLog = errorHandler.getErrorLog();
      const newErrors = errorLog.slice(0, 3); // Show max 3 notifications
      setErrors(newErrors);
    };

    // Check immediately
    checkForErrors();

    // Set up periodic check for new errors
    const interval = setInterval(checkForErrors, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = (errorToRemove: AppError) => {
    setErrors(prev => prev.filter(error => error !== errorToRemove));
  };

  return (
    <div className={`fixed top-0 right-0 z-50 ${className}`}>
      {errors.map((error, index) => (
        <div key={`${error.timestamp.getTime()}-${index}`} style={{ marginTop: `${index * 80}px` }}>
          <ErrorNotification
            error={error}
            onDismiss={() => handleDismiss(error)}
          />
        </div>
      ))}
    </div>
  );
};

export default ErrorNotification;