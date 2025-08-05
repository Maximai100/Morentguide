import type { Apartment, Booking, BookingPageData } from '../types';
import axios from 'axios';

// Настройка API с прокси через Vercel
const API_BASE_URL = '/api'; // Прокси через Vercel

console.log('🚀 API НАСТРОЕН НА ПРОКСИ ЧЕРЕЗ VERCEL');
console.log('✅ Базовый URL:', API_BASE_URL);

// Создаем axios instance с базовым URL
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// API для работы с апартаментами
export const apartmentApi = {
  getAll: async (): Promise<Apartment[]> => {
    console.log('📋 Загружаем апартаменты через прокси...');
    try {
      const response = await api.get('/items/apartments');
      console.log('✅ Апартаменты загружены:', response.data.data?.length || 0, 'записей');
      return response.data.data || [];
    } catch (error) {
      console.error('❌ Ошибка загрузки апартаментов:', error);
      throw error;
    }
  },
  
  getById: async (id: string): Promise<Apartment> => {
    try {
      const response = await api.get(`/items/apartments/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('❌ Ошибка загрузки апартамента:', error);
      throw error;
    }
  },
  
  create: async (apartment: Omit<Apartment, 'id'>): Promise<Apartment> => {
    console.log('📋 Создание апартамента через прокси...');
    try {
      const response = await api.post('/items/apartments', apartment);
      console.log('✅ Апартамент создан:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Ошибка создания апартамента:', error);
      throw error;
    }
  },
  
  update: async (id: string, apartment: Partial<Apartment>): Promise<Apartment> => {
    try {
      const response = await api.patch(`/items/apartments/${id}`, apartment);
      return response.data.data;
    } catch (error) {
      console.error('❌ Ошибка обновления апартамента:', error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/items/apartments/${id}`);
      console.log('✅ Апартамент удален:', id);
    } catch (error) {
      console.error('❌ Ошибка удаления апартамента:', error);
      throw error;
    }
  },
};

// API для работы с бронированиями
export const bookingApi = {
  getAll: async (): Promise<Booking[]> => {
    console.log('📋 Загружаем бронирования через прокси...');
    try {
      const response = await api.get('/items/bookings?fields=*,apartment_id.*');
      console.log('✅ Бронирования загружены:', response.data.data?.length || 0, 'записей');
      return response.data.data || [];
    } catch (error) {
      console.error('❌ Ошибка загрузки бронирований:', error);
      throw error;
    }
  },
  
  getById: async (id: string): Promise<Booking> => {
    try {
      const response = await api.get(`/items/bookings/${id}?fields=*,apartment_id.*`);
      return response.data.data;
    } catch (error) {
      console.error('❌ Ошибка загрузки бронирования:', error);
      throw error;
    }
  },
  
  getBySlug: async (slug: string): Promise<BookingPageData> => {
    try {
      const response = await api.get(`/items/bookings?filter[slug][_eq]=${slug}&fields=*,apartment_id.*`);
      const booking = response.data.data?.[0];
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      const apartment = booking.apartment_id;
      if (!apartment) {
        throw new Error('Apartment not found');
      }
      
      return {
        booking,
        apartment
      };
    } catch (error) {
      console.error('❌ Ошибка загрузки бронирования по slug:', error);
      throw error;
    }
  },
  
  create: async (booking: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> => {
    console.log('📋 Создание бронирования через прокси...');
    try {
      const response = await api.post('/items/bookings', booking);
      console.log('✅ Бронирование создано:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Ошибка создания бронирования:', error);
      throw error;
    }
  },
  
  update: async (id: string, booking: Partial<Booking>): Promise<Booking> => {
    try {
      const response = await api.patch(`/items/bookings/${id}`, booking);
      return response.data.data;
    } catch (error) {
      console.error('❌ Ошибка обновления бронирования:', error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/items/bookings/${id}`);
      console.log('✅ Бронирование удалено:', id);
    } catch (error) {
      console.error('❌ Ошибка удаления бронирования:', error);
      throw error;
    }
  },
  
  generateSlug: async (): Promise<{ slug: string }> => {
    const newSlug = `booking-${Date.now()}`;
    console.log('✅ Генерируем slug:', newSlug);
    return { slug: newSlug };
  },
}; 