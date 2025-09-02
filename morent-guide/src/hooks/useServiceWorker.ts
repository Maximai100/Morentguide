import { useEffect } from 'react';

export const useServiceWorker = (scriptUrl: string = '/sw.js') => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(scriptUrl)
        .then(registration => {
          console.log('Service Worker зарегистрирован:', registration);
        })
        .catch(error => {
          console.error('Ошибка регистрации Service Worker:', error);
        });
    }
  }, [scriptUrl]);
};
