// Утилита для тестирования подключения к Directus API
// Запускать только после создания коллекций в Directus

import { apartmentApi, bookingApi } from './api';

export const testDirectusConnection = async () => {
  console.log('🔄 Тестирование подключения к Directus...');
  
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
    
    console.log('🎉 Все тесты пройдены успешно!');
    return true;
    
  } catch (error) {
    console.error('❌ Ошибка подключения к API:', error);
    return false;
  }
};

// Функция для тестирования через консоль браузера
export const runApiTest = () => {
  testDirectusConnection().then(success => {
    if (success) {
      console.log('✅ API работает корректно');
    } else {
      console.log('❌ Проблемы с API - проверьте настройки Directus');
    }
  });
};

// Экспорт для использования в консоли браузера
if (typeof window !== 'undefined') {
  (window as any).testDirectusAPI = runApiTest;
}