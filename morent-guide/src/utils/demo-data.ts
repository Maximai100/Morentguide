import type { Apartment, Booking } from '../types';

export const demoApartments: Apartment[] = [
  {
    id: 'demo-1',
    title: 'Демо апартамент 1',
    apartment_number: '101',
    building_number: '1',
    base_address: 'ул. Демо, 1',
    description: 'Это демо апартамент для тестирования',
    price_per_night: 5000,
    max_guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    area: 60,
    floor: 1,
    has_wifi: true,
    has_parking: true,
    has_kitchen: true,
    has_balcony: true,
    created_at: new Date().toISOString(),
    date_created: new Date().toISOString()
  },
  {
    id: 'demo-2',
    title: 'Демо апартамент 2',
    apartment_number: '202',
    building_number: '2',
    base_address: 'ул. Демо, 2',
    description: 'Второй демо апартамент',
    price_per_night: 7000,
    max_guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    area: 80,
    floor: 2,
    has_wifi: true,
    has_parking: true,
    has_kitchen: true,
    has_balcony: false,
    created_at: new Date().toISOString(),
    date_created: new Date().toISOString()
  }
];

export const demoBookings: Booking[] = [
  {
    id: 'demo-booking-1',
    guest_name: 'Иван Иванов',
    checkin_date: '2024-08-10',
    checkout_date: '2024-08-15',
    apartment_id: 'demo-1',
    slug: 'demo-booking-1',
    created_at: new Date().toISOString(),
    date_created: new Date().toISOString()
  },
  {
    id: 'demo-booking-2',
    guest_name: 'Мария Петрова',
    checkin_date: '2024-08-20',
    checkout_date: '2024-08-25',
    apartment_id: 'demo-2',
    slug: 'demo-booking-2',
    created_at: new Date().toISOString(),
    date_created: new Date().toISOString()
  }
]; 