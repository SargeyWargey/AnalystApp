
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import MarkdownView from './components/views/MarkdownView';
import TerminalView from './components/views/TerminalView';
import SettingsView from './components/views/SettingsView';
import { useAppStore } from './core/state/store';
import ErrorBoundary from './core/error/ErrorBoundary';
import { ErrorNotificationManager } from './core/error/ErrorNotification';
import KeyboardShortcuts from './components/common/KeyboardShortcuts';

function App() {
  const { currentView, setCurrentView } = useAppStore();
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Listen for menu events from Electron
  useEffect(() => {
    const handleMenuEvents = (event: any, data: any) => {
      switch (event) {
        case 'navigate-to':
          setCurrentView(data);
          break;
        case 'show-shortcuts':
          setShowShortcuts(true);
          break;
      }
    };

    // Listen for Electron IPC events
    if (window.electronAPI) {
      window.electronAPI.onMenuEvent(handleMenuEvents);
    }

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setShowShortcuts(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '3') {
        e.preventDefault();
        const views = ['markdown', 'terminal', 'settings'];
        setCurrentView(views[parseInt(e.key) - 1] as any);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setCurrentView]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'markdown':
        return (
          <ErrorBoundary>
            <MarkdownView />
          </ErrorBoundary>
        );
      case 'terminal':
        return (
          <ErrorBoundary>
            <TerminalView />
          </ErrorBoundary>
        );
      case 'settings':
        return (
          <ErrorBoundary>
            <SettingsView />
          </ErrorBoundary>
        );
      default:
        return (
          <ErrorBoundary>
            <MarkdownView />
          </ErrorBoundary>
        );
    }
  };

  return (
    <>
      <Layout>
        {renderCurrentView()}
      </Layout>
      <ErrorNotificationManager />
      <KeyboardShortcuts
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </>
  );
}

export default App;