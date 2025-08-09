import type { Apartment, Booking } from '../types';

export const demoApartments: Apartment[] = [
  {
    id: 'demo-1',
    title: 'Апартаменты Морент',
    apartment_number: '101',
    building_number: 'А',
    base_address: 'Нагорный тупик 13',
    description: 'Уютные апартаменты в центре города с видом на море',
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500',
      'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=500'
    ],
    video_entrance: 'demo-video-1',
    video_lock: 'demo-video-lock-1',
    wifi_name: 'WiFi_Morent',
    wifi_password: '123Morent',
    code_building: '#2020',
    code_lock: '#101',
    manager_name: 'Менеджер Морент',
    manager_phone: '88007005501',
    manager_email: 'morent@mail.ru',
    faq_checkin: 'Инструкция по заселению',
    faq_apartment: 'Информация об апартаментах',
    faq_area: 'Информация о районе',
    map_embed_code: '<iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A123456789&amp;source=constructor" width="100%" height="400" frameborder="0"></iframe>'
  },
  {
    id: 'demo-2',
    title: 'Апартаменты Морент Премиум',
    apartment_number: '202',
    building_number: 'Б',
    base_address: 'Нагорный тупик 13',
    description: 'Просторные апартаменты с панорамным видом',
    photos: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500'
    ],
    video_entrance: 'demo-video-2',
    video_lock: 'demo-video-lock-2',
    wifi_name: 'WiFi_Morent',
    wifi_password: '123Morent',
    code_building: '#2020',
    code_lock: '#202',
    manager_name: 'Менеджер Морент',
    manager_phone: '88007005501',
    manager_email: 'morent@mail.ru',
    faq_checkin: 'Инструкция по заселению',
    faq_apartment: 'Информация об апартаментах',
    faq_area: 'Информация о районе',
    map_embed_code: '<iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A123456789&amp;source=constructor" width="100%" height="400" frameborder="0"></iframe>'
  }
];

export const demoBookings: Booking[] = [
  {
    id: 'demo-booking-1',
    guest_name: 'Иван Иванов',
    checkin_date: '2024-08-10',
    checkout_date: '2024-08-15',
    apartment_id: 'demo-1',
    slug: 'demo-booking-1'
  },
  {
    id: 'demo-booking-2',
    guest_name: 'Мария Петрова',
    checkin_date: '2024-08-20',
    checkout_date: '2024-08-25',
    apartment_id: 'demo-2',
    slug: 'demo-booking-2'
  }
]; 