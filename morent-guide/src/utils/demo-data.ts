import type { Apartment, Booking } from '../types';

export const demoApartments: Apartment[] = [
  {
    id: 'demo-1',
    title: 'Апартаменты Морент',
    apartment_number: '101',
    building_number: '13',
    base_address: 'Нагорный тупик 13',
    description: 'Уютные апартаменты в центре города с видом на море',
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
    photos: 'demo-photo-1',
    video_entrance: 'demo-video-1',
    video_lock: 'demo-video-lock-1',
    map_embed_code: '<iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A123456789&amp;source=constructor" width="100%" height="400" frameborder="0"></iframe>',
    created_at: new Date().toISOString(),
    date_created: new Date().toISOString()
  },
  {
    id: 'demo-2',
    title: 'Апартаменты Морент Премиум',
    apartment_number: '202',
    building_number: '13',
    base_address: 'Нагорный тупик 13',
    description: 'Просторные апартаменты с панорамным видом',
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
    photos: 'demo-photo-2',
    video_entrance: 'demo-video-2',
    video_lock: 'demo-video-lock-2',
    map_embed_code: '<iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A123456789&amp;source=constructor" width="100%" height="400" frameborder="0"></iframe>',
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
    lock_code: '1234',
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
    lock_code: '5678',
    created_at: new Date().toISOString(),
    date_created: new Date().toISOString()
  }
]; 