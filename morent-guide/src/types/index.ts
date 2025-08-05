// Основные типы для приложения Morent Guide

export interface Apartment {
  id: string;
  title: string;
  apartment_number: string;    // Номер апартамента
  building_number: string;     // Номер корпуса
  base_address: string;        // Базовый адрес комплекса
  full_address?: string;       // Полный адрес (auto-generated)
  description: string;
  photos: string[] | string | null;  // Может быть массивом, строкой или null в Directus
  video_entrance?: string | null;
  video_lock?: string | null;
  wifi_name: string;
  wifi_password: string;
  code_building: string;
  code_lock: string;
  faq_checkin: string;
  faq_apartment: string;
  faq_area: string;
  map_embed_code: string;
  manager_name: string;
  manager_phone: string;
  manager_email: string;
}

export interface Booking {
  id: string;
  guest_name: string;
  checkin_date: string;
  checkout_date: string;
  apartment_id: string;
  apartment?: Apartment;
  slug: string;
  created_at?: string;        // если создано вручную
  date_created?: string;      // если создано автоматически Directus
}

export interface BookingPageData {
  booking: Booking;
  apartment: Apartment;
}