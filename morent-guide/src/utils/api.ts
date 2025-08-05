import axios from 'axios';
import type { Apartment, Booking, BookingPageData } from '../types';
import { demoApartments, demoBookings } from './demo-data';

// Временно отключаем API для избежания Mixed Content ошибок
const USE_DEMO_DATA = true; // Принудительно используем демо-данные

// Directus API Configuration - используем HTTPS
const DIRECTUS_URL = import.meta.env.VITE_DIRECTUS_URL || 'https://89.169.45.238:8055';
const API_BASE_URL = `${DIRECTUS_URL}/items`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 секунд таймаут
});

// Добавляем токен авторизации если есть
const token = import.meta.env.VITE_DIRECTUS_TOKEN;
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Функция для проверки доступности API
const checkApiHealth = async (): Promise<boolean> => {
  // Принудительно возвращаем false для использования демо-данных
  if (USE_DEMO_DATA) {
    console.log('Используем демо-данные (API отключен)');
    return false;
  }
  
  try {
    await api.get('/apartments?limit=1');
    return true;
  } catch (error) {
    console.warn('API недоступен:', error);
    return false;
  }
};

// API для работы с апартаментами (Directus)
export const apartmentApi = {
  getAll: async (): Promise<Apartment[]> => {
    console.log('Загружаем апартаменты...');
    
    if (USE_DEMO_DATA) {
      console.log('Возвращаем демо-данные апартаментов');
      return demoApartments;
    }
    
    try {
      const isApiAvailable = await checkApiHealth();
      if (!isApiAvailable) {
        console.warn('API недоступен, возвращаем демо-данные');
        return demoApartments;
      }
      const response = await api.get('/apartments');
      return response.data.data || [];
    } catch (error) {
      console.error('Ошибка при загрузке апартаментов:', error);
      return demoApartments;
    }
  },
  
  getById: (id: string): Promise<Apartment> => 
    api.get(`/apartments/${id}`).then(response => response.data.data),
  
  create: async (apartment: Omit<Apartment, 'id'>): Promise<Apartment> => {
    console.log('Creating apartment:', apartment);
    console.log('API URL:', `${API_BASE_URL}/apartments`);
    
    // Отправляем только обязательные поля для тестирования
    const minimalData = {
      title: apartment.title,
      apartment_number: apartment.apartment_number,
      building_number: apartment.building_number,
      base_address: apartment.base_address
    };
    
    console.log('Minimal apartment data:', minimalData);
    
    try {
      const response = await api.post('/apartments', minimalData);
      console.log('API Response:', response);
      return response.data.data;
    } catch (error) {
      console.error('API Error:', error);
      console.error('Error response:', error instanceof Error && 'response' in error ? (error as any).response?.data : 'No response data');
      console.error('Error status:', error instanceof Error && 'response' in error ? (error as any).response?.status : 'No status');
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      throw new Error(`API Error: ${error instanceof Error && 'response' in error ? (error as any).response?.status : 'Unknown'} - ${error instanceof Error && 'response' in error ? (error as any).response?.data?.message || error.message : String(error)}`);
    }
  },
  
  update: (id: string, apartment: Partial<Apartment>): Promise<Apartment> => 
    api.patch(`/apartments/${id}`, apartment).then(response => response.data.data),
  
  delete: (id: string): Promise<void> => 
    api.delete(`/apartments/${id}`).then(() => {}),
};

// API для работы с бронированиями (Directus)
export const bookingApi = {
  getAll: async (): Promise<Booking[]> => {
    console.log('Загружаем бронирования...');
    
    if (USE_DEMO_DATA) {
      console.log('Возвращаем демо-данные бронирований');
      return demoBookings;
    }
    
    try {
      const isApiAvailable = await checkApiHealth();
      if (!isApiAvailable) {
        console.warn('API недоступен, возвращаем демо-данные бронирований');
        return demoBookings;
      }
      const response = await api.get('/bookings?fields=*,apartment_id.*');
      return response.data.data || [];
    } catch (error) {
      console.error('Ошибка при загрузке бронирований:', error);
      return demoBookings;
    }
  },
  
  getById: (id: string): Promise<Booking> => 
    api.get(`/bookings/${id}?fields=*,apartment_id.*`).then(response => response.data.data),
  
  getBySlug: async (slug: string): Promise<BookingPageData> => {
    // Получаем бронирование по slug с данными апартамента
    const response = await api.get(`/bookings?filter[slug][_eq]=${slug}&fields=*,apartment_id.*`);
    const booking = response.data.data?.[0];
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    return {
      booking,
      apartment: booking.apartment_id
    };
  },
  
  create: async (booking: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> => {
    console.log('API: Creating booking:', booking);
    console.log('API URL:', `${API_BASE_URL}/bookings`);
    
    try {
      const response = await api.post('/bookings', booking);
      console.log('API: Booking created successfully:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('API: Error creating booking:', error);
      console.error('API: Error response:', error.response?.data);
      console.error('API: Error status:', error.response?.status);
      throw new Error(`API Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }
  },
  
  update: (id: string, booking: Partial<Booking>): Promise<Booking> => 
    api.patch(`/bookings/${id}`, booking).then(response => response.data.data),
  
  delete: (id: string): Promise<void> => 
    api.delete(`/bookings/${id}`).then(() => {}),
  
  generateSlug: async (): Promise<{ slug: string }> => {
    // Генерируем новый slug
    const { generateSlug } = await import('./helpers');
    const newSlug = generateSlug();
    return { slug: newSlug };
  },
};