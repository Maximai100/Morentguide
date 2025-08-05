import axios from 'axios';
import type { Apartment, Booking, BookingPageData } from '../types';

// Directus API Configuration
const DIRECTUS_URL = import.meta.env.VITE_DIRECTUS_URL || 'http://89.169.45.238:8055';
const API_BASE_URL = `${DIRECTUS_URL}/items`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем токен авторизации если есть
const token = import.meta.env.VITE_DIRECTUS_TOKEN;
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// API для работы с апартаментами (Directus)
export const apartmentApi = {
  getAll: (): Promise<Apartment[]> => 
    api.get('/apartments').then(response => response.data.data || []),
  
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
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
      throw new Error(`API Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }
  },
  
  update: (id: string, apartment: Partial<Apartment>): Promise<Apartment> => 
    api.patch(`/apartments/${id}`, apartment).then(response => response.data.data),
  
  delete: (id: string): Promise<void> => 
    api.delete(`/apartments/${id}`).then(() => {}),
};

// API для работы с бронированиями (Directus)
export const bookingApi = {
  getAll: (): Promise<Booking[]> => 
    api.get('/bookings?fields=*,apartment_id.*').then(response => response.data.data || []),
  
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