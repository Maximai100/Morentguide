import axios from 'axios';
import type { Apartment, Booking, BookingPageData } from '../types';
import { demoApartments, demoBookings } from './demo-data';

// Переключаемся на реальный Directus API
const DIRECTUS_URL = 'https://1.cycloscope.online';
const DIRECTUS_TOKEN = import.meta.env.VITE_DIRECTUS_TOKEN;
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

export const api = axios.create({
  baseURL: DIRECTUS_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    ...(DIRECTUS_TOKEN && { 'Authorization': `Bearer ${DIRECTUS_TOKEN}` }),
  },
});

// Добавляем перехватчик для добавления токена к запросам файлов
api.interceptors.request.use((config) => {
  if (config.url?.includes('/files') && DIRECTUS_TOKEN) {
    config.headers.Authorization = `Bearer ${DIRECTUS_TOKEN}`;
  }
  return config;
});

export const apartmentApi = {
  getAll: async (): Promise<Apartment[]> => {
    const res = await api.get('/items/apartments');
    return res.data.data || [];
  },
  getById: async (id: string): Promise<Apartment> => {
    const res = await api.get(`/items/apartments/${id}`);
    return res.data.data;
  },
  create: async (apartment: Omit<Apartment, 'id'>): Promise<Apartment> => {
    const res = await api.post('/items/apartments', apartment);
    return res.data.data;
  },
  update: async (id: string, apartment: Partial<Apartment>): Promise<Apartment> => {
    const res = await api.patch(`/items/apartments/${id}`, apartment);
    return res.data.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/items/apartments/${id}`);
  },
};

export const bookingApi = {
  getAll: async (): Promise<Booking[]> => {
    const res = await api.get('/items/bookings?fields=*,apartment_id.*');
    return res.data.data || [];
  },
  getById: async (id: string): Promise<Booking> => {
    const res = await api.get(`/items/bookings/${id}?fields=*,apartment_id.*`);
    return res.data.data;
  },
  getBySlug: async (slug: string): Promise<BookingPageData> => {
    if (DEMO_MODE) {
      // Демо-режим: используем локальные данные
      const booking = demoBookings.find(b => b.slug === slug);
      if (!booking) throw new Error('Booking not found');
      const apartment = demoApartments.find(a => a.id === booking.apartment_id);
      if (!apartment) throw new Error('Apartment not found');
      
      // Добавляем apartment к booking для совместимости
      const bookingWithApartment = { ...booking, apartment };
      return { booking: bookingWithApartment, apartment };
    }
    
    const res = await api.get(`/items/bookings?filter[slug][_eq]=${encodeURIComponent(slug)}&fields=*,apartment_id.*`);
    const booking = res.data.data?.[0];
    if (!booking) throw new Error('Booking not found');
    const apartment = booking.apartment_id;
    if (!apartment) throw new Error('Apartment not found');
    return { booking, apartment };
  },
  create: async (booking: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> => {
    const res = await api.post('/items/bookings', booking);
    return res.data.data;
  },
  update: async (id: string, booking: Partial<Booking>): Promise<Booking> => {
    const res = await api.patch(`/items/bookings/${id}`, booking);
    return res.data.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/items/bookings/${id}`);
  },
  generateSlug: async (): Promise<{ slug: string }> => {
    const newSlug = `booking-${Date.now()}`;
    return { slug: newSlug };
  },
}; 