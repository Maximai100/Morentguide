// Утилиты для push-уведомлений

export interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

// Проверка поддержки уведомлений
export const isNotificationSupported = (): boolean => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

// Запрос разрешения на уведомления
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!isNotificationSupported()) {
    console.warn('Уведомления не поддерживаются');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    console.warn('Разрешение на уведомления отклонено');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Ошибка при запросе разрешения:', error);
    return false;
  }
};

// Регистрация Service Worker для push-уведомлений
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker не поддерживается');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker зарегистрирован:', registration);
    return registration;
  } catch (error) {
    console.error('Ошибка регистрации Service Worker:', error);
    return null;
  }
};

// Подписка на push-уведомления
export const subscribeToPushNotifications = async (): Promise<PushSubscription | null> => {
  const registration = await registerServiceWorker();
  if (!registration) return null;

  const permission = await requestNotificationPermission();
  if (!permission) return null;

  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY || '')
    });

    console.log('Подписка на push-уведомления создана:', subscription);
    return subscription;
  } catch (error) {
    console.error('Ошибка подписки на push-уведомления:', error);
    return null;
  }
};

// Отправка локального уведомления
export const sendLocalNotification = async (data: NotificationData): Promise<void> => {
  if (!isNotificationSupported()) return;

  const permission = await requestNotificationPermission();
  if (!permission) return;

  const registration = await navigator.serviceWorker.ready;
  
  await registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/icon-72x72.png',
    tag: data.tag,
    data: data.data,
    // actions: data.actions, // Не поддерживается в некоторых браузерах
    // vibrate: [100, 50, 100], // Не поддерживается в некоторых браузерах
    requireInteraction: false,
    silent: false
  });
};

// Уведомления о заселении
export const sendCheckinReminder = async (guestName: string, checkinDate: string, apartmentTitle: string): Promise<void> => {
  const checkinDateObj = new Date(checkinDate);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  let title = '';
  let body = '';

  if (checkinDateObj.toDateString() === today.toDateString()) {
    title = '🎉 Добро пожаловать!';
    body = `Сегодня ваш заезд в ${apartmentTitle}. Желаем приятного отдыха!`;
  } else if (checkinDateObj.toDateString() === tomorrow.toDateString()) {
    title = '📅 Напоминание о заезде';
    body = `Завтра, ${guestName}, ваш заезд в ${apartmentTitle}. Все готово к вашему приезду!`;
  } else {
    return; // Не отправляем уведомления для других дат
  }

  await sendLocalNotification({
    title,
    body,
    tag: `checkin-${guestName}`,
    data: {
      type: 'checkin',
      guestName,
      checkinDate,
      apartmentTitle
    },
    actions: [
      {
        action: 'view',
        title: 'Открыть инструкции'
      }
    ]
  });
};

// Уведомления о важных обновлениях
export const sendImportantUpdate = async (title: string, message: string): Promise<void> => {
  await sendLocalNotification({
    title: `🔔 ${title}`,
    body: message,
    tag: 'important-update',
    data: {
      type: 'update',
      timestamp: Date.now()
    }
  });
};

// Конвертация VAPID ключа
const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

// Инициализация системы уведомлений
export const initializeNotifications = async (): Promise<void> => {
  if (!isNotificationSupported()) {
    console.log('Уведомления не поддерживаются в этом браузере');
    return;
  }

  const permission = await requestNotificationPermission();
  if (permission) {
    console.log('Разрешение на уведомления получено');
    await registerServiceWorker();
  }
};
