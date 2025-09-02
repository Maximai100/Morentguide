import { useEffect } from 'react';
import { initializeNotifications } from '../utils/notifications';

export const useNotifications = () => {
  useEffect(() => {
    initializeNotifications();
  }, []);
};
