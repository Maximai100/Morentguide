import type { Apartment, Booking, BookingPageData } from '../types';
import { demoApartments, demoBookings } from './demo-data';

// Полностью отключаем API для избежания Mixed Content ошибок
console.log('API отключен - используем только демо-данные');

// API для работы с апартаментами (только демо-данные)
export const apartmentApi = {
  getAll: async (): Promise<Apartment[]> => {
    console.log('Загружаем демо-апартаменты...');
    return demoApartments;
  },
  
  getById: async (id: string): Promise<Apartment> => {
    const apartment = demoApartments.find(apt => apt.id === id);
    if (!apartment) {
      throw new Error('Apartment not found');
    }
    return apartment;
  },
  
  create: async (apartment: Omit<Apartment, 'id'>): Promise<Apartment> => {
    console.log('Демо-режим: создание апартамента', apartment);
    const newApartment: Apartment = {
      ...apartment,
      id: `demo-${Date.now()}`
    };
    return newApartment;
  },
  
  update: async (id: string, apartment: Partial<Apartment>): Promise<Apartment> => {
    console.log('Демо-режим: обновление апартамента', id, apartment);
    const existing = demoApartments.find(apt => apt.id === id);
    if (!existing) {
      throw new Error('Apartment not found');
    }
    return { ...existing, ...apartment };
  },
  
  delete: async (id: string): Promise<void> => {
    console.log('Демо-режим: удаление апартамента', id);
    // В демо-режиме просто логируем
  },
};

// API для работы с бронированиями (только демо-данные)
export const bookingApi = {
  getAll: async (): Promise<Booking[]> => {
    console.log('Загружаем демо-бронирования...');
    return demoBookings;
  },
  
  getById: async (id: string): Promise<Booking> => {
    const booking = demoBookings.find(book => book.id === id);
    if (!booking) {
      throw new Error('Booking not found');
    }
    return booking;
  },
  
  getBySlug: async (slug: string): Promise<BookingPageData> => {
    const booking = demoBookings.find(book => book.slug === slug);
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    const apartment = demoApartments.find(apt => apt.id === booking.apartment_id);
    if (!apartment) {
      throw new Error('Apartment not found');
    }
    
    return {
      booking,
      apartment
    };
  },
  
  create: async (booking: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> => {
    console.log('Демо-режим: создание бронирования', booking);
    const newBooking: Booking = {
      ...booking,
      id: `demo-booking-${Date.now()}`,
      slug: `demo-booking-${Date.now()}`,
      created_at: new Date().toISOString(),
      date_created: new Date().toISOString()
    };
    return newBooking;
  },
  
  update: async (id: string, booking: Partial<Booking>): Promise<Booking> => {
    console.log('Демо-режим: обновление бронирования', id, booking);
    const existing = demoBookings.find(book => book.id === id);
    if (!existing) {
      throw new Error('Booking not found');
    }
    return { ...existing, ...booking };
  },
  
  delete: async (id: string): Promise<void> => {
    console.log('Демо-режим: удаление бронирования', id);
    // В демо-режиме просто логируем
  },
  
  generateSlug: async (): Promise<{ slug: string }> => {
    const newSlug = `demo-slug-${Date.now()}`;
    console.log('Демо-режим: генерируем slug', newSlug);
    return { slug: newSlug };
  },
};