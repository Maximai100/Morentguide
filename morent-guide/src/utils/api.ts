import axios from 'axios';
import type { Apartment, Booking, BookingPageData } from '../types';

// Временное решение: демо-режим пока Vercel обновляется
// const DIRECTUS_URL = 'https://1.cycloscope.online';
const DIRECTUS_URL = 'demo'; // раскомментируйте для демо-режима

// Демо-режим для обхода Mixed Content
import { demoApartments, demoBookings } from './demo-data';

export const api = axios.create({
  baseURL: DIRECTUS_URL === 'demo' ? '' : DIRECTUS_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apartmentApi = {
  getAll: async (): Promise<Apartment[]> => {
    if (DIRECTUS_URL === 'demo') {
      return demoApartments;
    }
    const res = await api.get('/items/apartments');
    return res.data.data || [];
  },
  getById: async (id: string): Promise<Apartment> => {
    if (DIRECTUS_URL === 'demo') {
      return demoApartments.find(apt => apt.id === id) || demoApartments[0];
    }
    const res = await api.get(`/items/apartments/${id}`);
    return res.data.data;
  },
  create: async (apartment: Omit<Apartment, 'id'>): Promise<Apartment> => {
    if (DIRECTUS_URL === 'demo') {
      const newApartment = { ...apartment, id: `demo-${Date.now()}` } as Apartment;
      return newApartment;
    }
    const res = await api.post('/items/apartments', apartment);
    return res.data.data;
  },
  update: async (id: string, apartment: Partial<Apartment>): Promise<Apartment> => {
    if (DIRECTUS_URL === 'demo') {
      return { ...demoApartments[0], ...apartment, id } as Apartment;
    }
    const res = await api.patch(`/items/apartments/${id}`, apartment);
    return res.data.data;
  },
  delete: async (id: string): Promise<void> => {
    if (DIRECTUS_URL === 'demo') {
      return; // Ничего не делаем в демо-режиме
    }
    await api.delete(`/items/apartments/${id}`);
  },
};

export const bookingApi = {
  getAll: async (): Promise<Booking[]> => {
    if (DIRECTUS_URL === 'demo') {
      return demoBookings;
    }
    const res = await api.get('/items/bookings?fields=*,apartment_id.*');
    return res.data.data || [];
  },
  getById: async (id: string): Promise<Booking> => {
    if (DIRECTUS_URL === 'demo') {
      return demoBookings.find(booking => booking.id === id) || demoBookings[0];
    }
    const res = await api.get(`/items/bookings/${id}?fields=*,apartment_id.*`);
    return res.data.data;
  },
  getBySlug: async (slug: string): Promise<BookingPageData> => {
    if (DIRECTUS_URL === 'demo') {
      const booking = demoBookings.find(b => b.slug === slug);
      if (!booking) throw new Error('Booking not found');
      const apartment = demoApartments.find(apt => apt.id === booking.apartment_id);
      if (!apartment) throw new Error('Apartment not found');
      return { booking, apartment };
    }
    const res = await api.get(`/items/bookings?filter[slug][_eq]=${slug}&fields=*,apartment_id.*`);
    const booking = res.data.data?.[0];
    if (!booking) throw new Error('Booking not found');
    const apartment = booking.apartment_id;
    if (!apartment) throw new Error('Apartment not found');
    return { booking, apartment };
  },
  create: async (booking: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> => {
    if (DIRECTUS_URL === 'demo') {
      const newBooking = { ...booking, id: `demo-${Date.now()}` } as Booking;
      return newBooking;
    }
    const res = await api.post('/items/bookings', booking);
    return res.data.data;
  },
  update: async (id: string, booking: Partial<Booking>): Promise<Booking> => {
    if (DIRECTUS_URL === 'demo') {
      return { ...demoBookings[0], ...booking, id } as Booking;
    }
    const res = await api.patch(`/items/bookings/${id}`, booking);
    return res.data.data;
  },
  delete: async (id: string): Promise<void> => {
    if (DIRECTUS_URL === 'demo') {
      return; // Ничего не делаем в демо-режиме
    }
    await api.delete(`/items/bookings/${id}`);
  },
  generateSlug: async (): Promise<{ slug: string }> => {
    const newSlug = `booking-${Date.now()}`;
    return { slug: newSlug };
  },
}; 