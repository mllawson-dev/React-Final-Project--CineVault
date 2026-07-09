import { createContext, useContext, useState, useEffect } from 'react';
import { getTheme, saveTheme } from '../services/storage';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getTheme);

  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light');
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
