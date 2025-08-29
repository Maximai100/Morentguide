// Утилита для тестирования API через прокси Vercel
// Тестирует подключение к Directus через /api прокси

import { api } from './api';

export const testDirectusAPI = async () => {
  console.log('🧪 Тестирование Directus API...');
  
  try {
    // Тест 1: Проверка подключения к апартаментам
    console.log('1. Тестируем подключение к апартаментам...');
    const apartmentsResponse = await api.get('/items/apartments');
    console.log('✅ Апартаменты доступны:', apartmentsResponse.data.data?.length || 0, 'записей');
    
    // Тест 2: Проверка подключения к бронированиям
    console.log('2. Тестируем подключение к бронированиям...');
    const bookingsResponse = await api.get('/items/bookings');
    console.log('✅ Бронирования доступны:', bookingsResponse.data.data?.length || 0, 'записей');
    
    // Тест 3: Проверка прав на файлы
    console.log('3. Тестируем права на файлы...');
    const filesResponse = await api.get('/files');
    console.log('✅ Файлы доступны:', filesResponse.data.data?.length || 0, 'файлов');
    
    console.log('🎉 Все тесты прошли успешно! API работает корректно.');
    return true;
  } catch (error) {
    console.error('❌ Ошибка при тестировании API:', error);
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status: number; data: unknown } };
      console.error('Статус:', axiosError.response?.status);
      console.error('Данные:', axiosError.response?.data);
    }
    
    return false;
  }
};

// Автоматический тест при загрузке в development режиме
if (import.meta.env.DEV) {
  testDirectusAPI().then(success => {
    if (success) {
      console.log('🚀 API готов к работе!');
    } else {
      console.log('⚠️ Проверьте настройки токена в .env файле');
    }
  });
}