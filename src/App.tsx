
import Layout from './components/Layout';
import MarkdownView from './components/views/MarkdownView';
import TerminalView from './components/views/TerminalView';
import SettingsView from './components/views/SettingsView';
import { useAppStore } from './core/state/store';

function App() {
  const { currentView } = useAppStore();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'markdown':
        return <MarkdownView />;
      case 'terminal':
        return <TerminalView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <MarkdownView />;
    }
  };

  return (
    <Layout>
      {renderCurrentView()}
    </Layout>
  );
}

export default App;