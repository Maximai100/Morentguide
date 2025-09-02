import { useEffect } from 'react';
import { initializeTheme } from '../utils/theme';

export const useTheme = () => {
  useEffect(() => {
    initializeTheme();
  }, []);
};
