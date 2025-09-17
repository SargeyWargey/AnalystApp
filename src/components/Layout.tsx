import React from 'react';
import Sidebar from './Sidebar';
import { useWindowSize } from '../core/hooks/useWindowSize';
import { useTheme } from '../core/theme/ThemeProvider';
import { themeStyles } from '../core/theme/styles';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { width } = useWindowSize();
  const { theme } = useTheme();
  const isMobile = width ? width < 768 : false;

  return (
    <div className={`min-h-screen ${themeStyles.backgroundGradient[theme]} ${themeStyles.text.primary[theme]} flex`}>
      {!isMobile && <Sidebar />}
      <main className="flex-1 flex flex-col min-w-0">
        {children}
      </main>
      {isMobile && (
        <div className={`fixed bottom-0 left-0 right-0 ${themeStyles.sidebar[theme]} border-t`}>
          <Sidebar />
        </div>
      )}
    </div>
  );
};

export default Layout;