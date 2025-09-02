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
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl hover:shadow-2xl group"
      title={getTooltip()}
      aria-label={getTooltip()}
    >
      <span className="group-hover:rotate-12 transition-transform duration-300">
        {getIcon()}
      </span>
    </button>
  );
};

export default ThemeToggle;
