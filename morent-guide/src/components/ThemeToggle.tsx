import React, { useState, useEffect } from 'react';
import { getCurrentTheme, toggleTheme, type Theme } from '../utils/theme';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setTheme(getCurrentTheme());
  }, []);

  const handleToggle = () => {
    const newTheme = toggleTheme();
    setTheme(newTheme);
  };

  const getIcon = () => {
    switch (theme) {
      case 'dark':
        return '🌙';
      case 'auto':
        return '🔄';
      case 'light':
      default:
        return '☀️';
    }
  };

  const getTooltip = () => {
    switch (theme) {
      case 'dark':
        return 'Темная тема';
      case 'auto':
        return 'Автоматическая тема';
      case 'light':
      default:
        return 'Светлая тема';
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-4 right-4 z-50 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center text-xl hover:scale-110 transition-transform duration-200"
      title={getTooltip()}
      aria-label={getTooltip()}
    >
      {getIcon()}
    </button>
  );
};

export default ThemeToggle;
