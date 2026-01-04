import React, { createContext, ReactNode, useContext, useState } from 'react';

type FontSize = 'small' | 'medium' | 'large';

const FONT_MAP = {
  small: 14,
  medium: 18,
  large: 22,
};

/* =====================
   COLORS
===================== */

const PRIMARY_BLUE = '#2979FF';

const lightColors = {
  background: '#f2f2f2',
  card: '#ffffff',

  text: '#111111',
  textSecondary: '#3A3A3C', // ✅ added
  muted: '#777777',

  border: '#E5E5EA', // ✅ added
  icon: '#8E8E93',

  primary: PRIMARY_BLUE,
};

const darkColors = {
  background: '#121212',
  card: '#1e1e1e',

  text: '#ffffff',
  textSecondary: '#D1D1D6', // ✅ LIGHT GRAY (readable)
  muted: '#aaaaaa',

  border: '#2C2C2E', // ✅ subtle divider
  icon: '#C7C7CC',

  primary: PRIMARY_BLUE,
};

/* =====================
   TYPES
===================== */

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  font: number;
  colors: typeof lightColors;
}

interface ThemeProviderProps {
  children: ReactNode;
  initialDarkMode?: boolean;
}

/* =====================
   CONTEXT
===================== */

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialDarkMode = false,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode);
  const [fontSize, setFontSize] = useState<FontSize>('medium');

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        fontSize,
        setFontSize,
        font: FONT_MAP[fontSize],
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

/* =====================
   HOOK
===================== */

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
