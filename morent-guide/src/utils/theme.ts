// Утилиты для управления темой

export type Theme = 'light' | 'dark' | 'auto';

const THEME_STORAGE_KEY = 'morent-theme';

// Получение текущей темы
export const getCurrentTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  
  const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
  if (saved && ['light', 'dark', 'auto'].includes(saved)) {
    return saved;
  }
  
  // Проверяем системные настройки
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'auto';
  }
  
  return 'light';
};

// Применение темы
export const applyTheme = (theme: Theme): void => {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  const isDark = theme === 'dark' || 
    (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  if (isDark) {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
  }
  
  localStorage.setItem(THEME_STORAGE_KEY, theme);
};

// Инициализация темы
export const initializeTheme = (): void => {
  const theme = getCurrentTheme();
  applyTheme(theme);
  
  // Слушаем изменения системной темы
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      const currentTheme = getCurrentTheme();
      if (currentTheme === 'auto') {
        applyTheme('auto');
      }
    });
  }
};

// Переключение темы
export const toggleTheme = (): Theme => {
  const current = getCurrentTheme();
  let newTheme: Theme;
  
  switch (current) {
    case 'light':
      newTheme = 'dark';
      break;
    case 'dark':
      newTheme = 'auto';
      break;
    case 'auto':
      newTheme = 'light';
      break;
    default:
      newTheme = 'light';
  }
  
  applyTheme(newTheme);
  return newTheme;
};
