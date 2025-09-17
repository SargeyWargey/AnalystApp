// Theme-aware utility classes
export const themeStyles = {
  // Background gradients
  backgroundGradient: {
    dark: 'bg-gradient-to-br from-[#2D1B4E] to-[#1A0E2E]',
    light: 'bg-gradient-to-br from-gray-50 to-gray-100',
  },

  // Text colors
  text: {
    primary: {
      dark: 'text-white',
      light: 'text-gray-900',
    },
    secondary: {
      dark: 'text-gray-300',
      light: 'text-gray-600',
    },
    muted: {
      dark: 'text-gray-400',
      light: 'text-gray-500',
    },
  },

  // Card/panel backgrounds
  card: {
    dark: 'bg-white/5 backdrop-blur-sm border border-white/10',
    light: 'bg-white/80 backdrop-blur-sm border border-gray-200',
  },

  // Sidebar
  sidebar: {
    dark: 'bg-black/20 backdrop-blur-sm border-r border-white/10',
    light: 'bg-white/40 backdrop-blur-sm border-r border-gray-200',
  },

  // Navigation items
  navItem: {
    active: {
      dark: 'bg-purple-500/20 text-purple-300',
      light: 'bg-purple-100 text-purple-700',
    },
    inactive: {
      dark: 'text-gray-400 hover:text-white hover:bg-white/5',
      light: 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50',
    },
  },

  // Active indicators
  activeIndicator: {
    dark: 'bg-purple-400',
    light: 'bg-purple-600',
  },

  // Form elements
  input: {
    dark: 'bg-white/10 border border-white/20 text-white focus:ring-purple-500',
    light: 'bg-white border border-gray-300 text-gray-900 focus:ring-purple-500',
  },
};

export const getThemeClass = (
  category: keyof typeof themeStyles,
  subcategory: string,
  theme: 'dark' | 'light'
): string => {
  const styleCategory = themeStyles[category] as any;
  const styleSubcategory = styleCategory[subcategory];

  if (typeof styleSubcategory === 'object') {
    return styleSubcategory[theme] || '';
  }

  return styleSubcategory || '';
};