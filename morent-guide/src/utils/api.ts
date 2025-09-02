import axios from 'axios';
import type { Apartment, Booking, BookingPageData } from '../types';
import { demoApartments, demoBookings } from './demo-data';
import { API_ENDPOINTS } from '../constants';

// Используем переменные окружения вместо хардкода
const DIRECTUS_URL = import.meta.env.VITE_DIRECTUS_URL || 'https://1.cycloscope.online';
const DIRECTUS_TOKEN = import.meta.env.VITE_DIRECTUS_TOKEN;
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

export const api = axios.create({
  baseURL: DIRECTUS_URL,
  timeout: 15000, // Увеличиваем timeout
  headers: {
    'Content-Type': 'application/json',
    ...(DIRECTUS_TOKEN && { 'Authorization': `Bearer ${DIRECTUS_TOKEN}` }),
  },
});

// Добавляем перехватчик для добавления токена к запросам файлов
api.interceptors.request.use((config) => {
  if (config.url?.includes(API_ENDPOINTS.FILES) && DIRECTUS_TOKEN) {
    config.headers.Authorization = `Bearer ${DIRECTUS_TOKEN}`;
  }
  return config;
});

// Добавляем перехватчик для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apartmentApi = {
  getAll: async (): Promise<Apartment[]> => {
    if (DEMO_MODE) {
      return demoApartments;
    }
    try {
      const res = await api.get(API_ENDPOINTS.APARTMENTS);
      return res.data.data || [];
    } catch (error) {
      console.error('Failed to fetch apartments:', error);
      throw error;
    }
  },
  getById: async (id: string): Promise<Apartment> => {
    if (DEMO_MODE) {
      const apartment = demoApartments.find(a => a.id === id);
      if (!apartment) throw new Error('Апартамент не найден');
      return apartment;
    }
    try {
      const res = await api.get(`${API_ENDPOINTS.APARTMENTS}/${id}`);
      return res.data.data;
    } catch (error) {
      console.error('Failed to fetch apartment:', error);
      throw error;
    }
  },
  create: async (apartment: Omit<Apartment, 'id'>): Promise<Apartment> => {
    if (DEMO_MODE) {
      const newApartment = { ...apartment, id: `demo-${Date.now()}` };
      demoApartments.push(newApartment as Apartment);
      return newApartment as Apartment;
    }
    try {
      const res = await api.post(API_ENDPOINTS.APARTMENTS, apartment);
      return res.data.data;
    } catch (error) {
      console.error('Failed to create apartment:', error);
      throw error;
    }
  },
  update: async (id: string, apartment: Partial<Apartment>): Promise<Apartment> => {
    if (DEMO_MODE) {
      const index = demoApartments.findIndex(a => a.id === id);
      if (index === -1) throw new Error('Апартамент не найден');
      demoApartments[index] = { ...demoApartments[index], ...apartment };
      return demoApartments[index];
    }
    try {
      const res = await api.patch(`${API_ENDPOINTS.APARTMENTS}/${id}`, apartment);
      return res.data.data;
    } catch (error) {
      console.error('Failed to update apartment:', error);
      throw error;
    }
  },
  delete: async (id: string): Promise<void> => {
    if (DEMO_MODE) {
      const index = demoApartments.findIndex(a => a.id === id);
      if (index === -1) throw new Error('Апартамент не найден');
      demoApartments.splice(index, 1);
      return;
    }
    try {
      await api.delete(`${API_ENDPOINTS.APARTMENTS}/${id}`);
    } catch (error) {
      console.error('Failed to delete apartment:', error);
      throw error;
    }
  },
};

export const bookingApi = {
  getAll: async (): Promise<Booking[]> => {
    if (DEMO_MODE) {
      return demoBookings;
    }
    try {
      const res = await api.get(`${API_ENDPOINTS.BOOKINGS}?fields=*,apartment_id.*`);
      return res.data.data || [];
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      throw error;
    }
  },
  getById: async (id: string): Promise<Booking> => {
    if (DEMO_MODE) {
      const booking = demoBookings.find(b => b.id === id);
      if (!booking) throw new Error('Бронирование не найдено');
      return booking;
    }
    try {
      const res = await api.get(`${API_ENDPOINTS.BOOKINGS}/${id}?fields=*,apartment_id.*`);
      return res.data.data;
    } catch (error) {
      console.error('Failed to fetch booking:', error);
      throw error;
    }
  },
  getBySlug: async (slug: string): Promise<BookingPageData> => {
    if (DEMO_MODE) {
      const booking = demoBookings.find(b => b.slug === slug);
      if (!booking) throw new Error('Бронирование не найдено');
      const apartment = demoApartments.find(a => a.id === booking.apartment_id);
      if (!apartment) throw new Error('Апартамент не найден');
      
      const bookingWithApartment = { ...booking, apartment };
      return { booking: bookingWithApartment, apartment };
    }
    
    try {
      const res = await api.get(`${API_ENDPOINTS.BOOKINGS}?filter[slug][_eq]=${encodeURIComponent(slug)}&fields=*,apartment_id.*`);
      const booking = res.data.data?.[0];
      if (!booking) throw new Error('Бронирование не найдено');
      const apartment = booking.apartment_id;
      if (!apartment) throw new Error('Апартамент не найден');
      return { booking, apartment };
    } catch (error) {
      console.error('Failed to fetch booking by slug:', error);
      throw error;
    }
  },
  create: async (booking: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> => {
    if (DEMO_MODE) {
      const newBooking = { 
        ...booking, 
        id: `demo-booking-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      demoBookings.push(newBooking as Booking);
      return newBooking as Booking;
    }
    try {
      const res = await api.post(API_ENDPOINTS.BOOKINGS, booking);
      return res.data.data;
    } catch (error) {
      console.error('Failed to create booking:', error);
      throw error;
    }
  },
  update: async (id: string, booking: Partial<Booking>): Promise<Booking> => {
    if (DEMO_MODE) {
      const index = demoBookings.findIndex(b => b.id === id);
      if (index === -1) throw new Error('Бронирование не найдено');
      demoBookings[index] = { ...demoBookings[index], ...booking };
      return demoBookings[index];
    }
    try {
      const res = await api.patch(`${API_ENDPOINTS.BOOKINGS}/${id}`, booking);
      return res.data.data;
    } catch (error) {
      console.error('Failed to update booking:', error);
      throw error;
    }
  },
  delete: async (id: string): Promise<void> => {
    if (DEMO_MODE) {
      const index = demoBookings.findIndex(b => b.id === id);
      if (index === -1) throw new Error('Бронирование не найдено');
      demoBookings.splice(index, 1);
      return;
    }
    try {
      await api.delete(`${API_ENDPOINTS.BOOKINGS}/${id}`);
    } catch (error) {
      console.error('Failed to delete booking:', error);
      throw error;
    }
  },
  generateSlug: async (): Promise<{ slug: string }> => {
    // Генерируем уникальный slug с проверкой
    const generateUniqueSlug = async (): Promise<string> => {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const slug = `booking-${timestamp}-${random}`;
      
      if (DEMO_MODE) {
        // В демо-режиме просто возвращаем slug
        return slug;
      }
      
      try {
        // Проверяем уникальность slug
        const res = await api.get(`${API_ENDPOINTS.BOOKINGS}?filter[slug][_eq]=${slug}`);
        if (res.data.data?.length > 0) {
          // Если slug уже существует, генерируем новый
          return generateUniqueSlug();
        }
        return slug;
      } catch (error) {
        console.error('Failed to check slug uniqueness:', error);
        return slug; // Возвращаем slug даже при ошибке проверки
      }
    };
    
    const slug = await generateUniqueSlug();
    return { slug };
  },
}; 