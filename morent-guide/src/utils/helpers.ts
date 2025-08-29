// Вспомогательные функции для приложения

// Валидация email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Валидация телефона
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[0-9\s-()]{10,}$/;
  return phoneRegex.test(phone);
};

// Валидация обязательных полей
export const validateRequired = (value: string | null | undefined): boolean => {
  return value !== null && value !== undefined && value.trim().length > 0;
};

// Валидация дат
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// Проверка что дата в будущем
export const isFutureDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  return date > now;
};

// Проверка что checkout_date > checkin_date
export const isValidDateRange = (checkin: string, checkout: string): boolean => {
  const checkinDate = new Date(checkin);
  const checkoutDate = new Date(checkout);
  return checkoutDate > checkinDate;
};

// Форматирование даты для отображения
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Форматирование даты для input
export const formatDateForInput = (dateString: string): string => {
  return new Date(dateString).toISOString().split('T')[0];
};

// Генерация уникального ID
export const generateId = (): string => {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Копирование в буфер обмена
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

// Показ уведомления
export const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info'): void => {
  // Создаем элемент уведомления
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full`;
  
  // Настраиваем стили в зависимости от типа
  switch (type) {
    case 'success':
      notification.className += ' bg-green-500 text-white';
      break;
    case 'error':
      notification.className += ' bg-red-500 text-white';
      break;
    case 'info':
      notification.className += ' bg-blue-500 text-white';
      break;
  }
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Анимация появления
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);
  
  // Автоматическое удаление через 3 секунды
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
};

import type { Apartment, Booking } from '../types';

// Валидация формы апартамента
export const validateApartment = (data: Partial<Apartment>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!validateRequired(data.title)) {
    errors.push('Название апартамента обязательно');
  }
  
  if (!validateRequired(data.apartment_number)) {
    errors.push('Номер апартамента обязателен');
  }
  
  if (!validateRequired(data.building_number)) {
    errors.push('Номер корпуса обязателен');
  }
  
  if (!validateRequired(data.base_address)) {
    errors.push('Адрес обязателен');
  }
  
  if (!validateRequired(data.wifi_name)) {
    errors.push('Название Wi-Fi обязательно');
  }
  
  if (!validateRequired(data.wifi_password)) {
    errors.push('Пароль Wi-Fi обязателен');
  }
  
  if (!validateRequired(data.code_building)) {
    errors.push('Код подъезда обязателен');
  }
  
  if (!validateRequired(data.code_lock)) {
    errors.push('Код замка обязателен');
  }
  
  if (!validateRequired(data.manager_name)) {
    errors.push('Имя менеджера обязательно');
  }
  
  if (!validateRequired(data.manager_phone)) {
    errors.push('Телефон менеджера обязателен');
  } else if (!isValidPhone(data.manager_phone)) {
    errors.push('Неверный формат телефона');
  }
  
  if (!validateRequired(data.manager_email)) {
    errors.push('Email менеджера обязателен');
  } else if (!isValidEmail(data.manager_email)) {
    errors.push('Неверный формат email');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Валидация формы бронирования
export const validateBooking = (data: Partial<Booking>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!validateRequired(data.guest_name)) {
    errors.push('Имя гостя обязательно');
  }
  
  if (!validateRequired(data.checkin_date)) {
    errors.push('Дата заезда обязательна');
  } else if (!isValidDate(data.checkin_date)) {
    errors.push('Неверный формат даты заезда');
  }
  
  if (!validateRequired(data.checkout_date)) {
    errors.push('Дата выезда обязательна');
  } else if (!isValidDate(data.checkout_date)) {
    errors.push('Неверный формат даты выезда');
  }
  
  if (data.checkin_date && data.checkout_date && !isValidDateRange(data.checkin_date, data.checkout_date)) {
    errors.push('Дата выезда должна быть позже даты заезда');
  }
  
  if (!validateRequired(data.apartment_id)) {
    errors.push('Апартамент обязателен');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};