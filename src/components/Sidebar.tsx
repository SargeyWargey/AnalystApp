import React from 'react';
import { useAppStore, type AppView } from '../core/state/store';
import { useWindowSize } from '../core/hooks/useWindowSize';
import { useTheme } from '../core/theme/ThemeProvider';
import { themeStyles } from '../core/theme/styles';

interface SidebarItem {
  id: AppView;
  name: string;
  icon: React.ReactNode;
}

// Placeholder icons - will be replaced with proper icons later
const FileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
  </svg>
);

const TerminalIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20,19V7H4V19H20M20,3A2,2 0 0,1 22,5V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V5C2,3.89 2.9,3 4,3H20M13,17V15H18V17H13M9.58,13L5.57,9H8.4L11.7,12.3C12.09,12.69 12.09,13.31 11.7,13.7L8.42,17H5.59L9.58,13Z" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
  </svg>
);

const Sidebar: React.FC = () => {
  const { currentView, setCurrentView } = useAppStore();
  const { width } = useWindowSize();
  const { theme } = useTheme();
  const isMobile = width ? width < 768 : false;

  const sidebarItems: SidebarItem[] = [
    {
      id: 'markdown',
      name: 'MarkDown Converter',
      icon: <FileIcon />,
    },
    {
      id: 'terminal',
      name: 'Terminal',
      icon: <TerminalIcon />,
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: <SettingsIcon />,
    },
  ];

  return (
    <div className={`${
      isMobile
        ? 'w-full flex flex-row justify-around py-2'
        : 'w-18 min-w-18 flex flex-col'
    } ${themeStyles.sidebar[theme]}`}>
      {/* Logo/Brand area - desktop only */}
      {!isMobile && (
        <div className="h-18 flex items-center justify-center border-b border-white/10">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-sm font-bold">
            A
          </div>
        </div>
      )}

      {/* Navigation items */}
      <nav className={`${isMobile ? 'flex flex-row justify-around' : 'flex-1 py-4'}`}>
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`${
              isMobile ? 'w-16 h-16' : 'w-full h-18'
            } flex items-center justify-center relative group transition-colors ${
              currentView === item.id
                ? themeStyles.navItem.active[theme]
                : themeStyles.navItem.inactive[theme]
            }`}
            title={item.name}
          >
            <div className="w-12 h-12 flex items-center justify-center">
              {item.icon}
            </div>

            {/* Active indicator */}
            {currentView === item.id && (
              <div className={`absolute ${
                isMobile
                  ? 'bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full'
                  : 'left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full'
              } ${themeStyles.activeIndicator[theme]}`} />
            )}

            {/* Tooltip - desktop only */}
            {!isMobile && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-black/80 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {item.name}
              </div>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;