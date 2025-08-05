import axios from 'axios';
import type { Apartment, Booking, BookingPageData } from '../types';

export const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
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
    const res = await api.get(`/items/bookings?filter[slug][_eq]=${slug}&fields=*,apartment_id.*`);
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