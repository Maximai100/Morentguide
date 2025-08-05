// Утилита для тестирования демо-режима API
// Работает только с демо-данными без HTTP-запросов

import { apartmentApi, bookingApi } from './api';

export const testDemoConnection = async () => {
  console.log('🔄 Тестирование демо-режима API...');
  
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
    
    console.log('🎉 Все тесты демо-режима пройдены успешно!');
    return true;
    
  } catch (error) {
    console.error('❌ Ошибка в демо-режиме API:', error);
    return false;
  }
};

// Функция для тестирования через консоль браузера
export const runApiTest = () => {
  testDemoConnection().then(success => {
    if (success) {
      console.log('✅ Демо-режим API работает корректно');
    } else {
      console.log('❌ Проблемы с демо-режимом API');
    }
  });
};

// Экспорт для использования в консоли браузера
if (typeof window !== 'undefined') {
  (window as any).testDirectusAPI = runApiTest;
}