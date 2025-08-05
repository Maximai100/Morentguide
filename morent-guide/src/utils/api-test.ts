// Утилита для тестирования API через прокси Vercel
// Тестирует подключение к Directus через /api прокси

import { apartmentApi, bookingApi } from './api';

export const testProxyConnection = async () => {
  console.log('🔄 Тестирование API через прокси Vercel...');
  
  try {
    // Тест 1: Получение списка апартаментов
    console.log('📋 Тест 1: Получение списка апартаментов...');
    const apartments = await apartmentApi.getAll();
    console.log('✅ Апартаменты:', apartments.length, 'записей');
    
    // Тест 2: Получение списка бронирований
    console.log('📋 Тест 2: Получение списка бронирований...');
    const bookings = await bookingApi.getAll();
    console.log('✅ Бронирования:', bookings.length, 'записей');
    
    // Тест 3: Поиск бронирования по slug (если есть)
    if (bookings.length > 0 && bookings[0].slug) {
      console.log('📋 Тест 3: Получение бронирования по slug...');
      const bookingData = await bookingApi.getBySlug(bookings[0].slug);
      console.log('✅ Данные бронирования по slug:', bookingData);
    }
    
    console.log('🎉 Все тесты прокси пройдены успешно!');
    return true;
    
  } catch (error) {
    console.error('❌ Ошибка в прокси API:', error);
    return false;
  }
};

// Функция для тестирования через консоль браузера
export const runApiTest = () => {
  testProxyConnection().then(success => {
    if (success) {
      console.log('✅ Прокси API работает корректно');
    } else {
      console.log('❌ Проблемы с прокси API');
    }
  });
};

// Экспорт для использования в консоли браузера
if (typeof window !== 'undefined') {
  (window as unknown as { testDirectusAPI: typeof runApiTest }).testDirectusAPI = runApiTest;
}