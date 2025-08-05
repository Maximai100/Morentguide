import { v4 as uuidv4 } from 'uuid';

// Генерация уникального slug для бронирования
export const generateSlug = (): string => {
  return uuidv4().replace(/-/g, '').substring(0, 8);
};

// Форматирование даты для отображения
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Форматирование даты и времени
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Проверка валидности email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Проверка валидности телефона
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

// Форматирование номера телефона
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('7') || cleaned.startsWith('8')) {
    const number = cleaned.startsWith('8') ? '7' + cleaned.slice(1) : cleaned;
    return `+${number.slice(0, 1)} (${number.slice(1, 4)}) ${number.slice(4, 7)}-${number.slice(7, 9)}-${number.slice(9, 11)}`;
  }
  return phone;
};