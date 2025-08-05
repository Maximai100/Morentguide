// ... существующий код ...
// === ЗАМЕНИТЕ ВЕСЬ ФАЙЛ НА СОДЕРЖИМОЕ НИЖЕ ================================

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { bookingApi } from '../utils/api';
import type { Booking } from '../types';

const BookingPage: React.FC = () => {
  const { slug } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('overview');

  /* ссылки на секции для плавного скролла */
  const refs = {
    overview: useRef<HTMLElement | null>(null),
    gallery: useRef<HTMLElement | null>(null),
    faq: useRef<HTMLElement | null>(null),
    contacts: useRef<HTMLElement | null>(null),
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await bookingApi.getBySlug(slug as string);
        setBooking(data.booking);
      } catch {
        setError('Бронирование не найдено');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  /* слушаем скролл, чтобы подсвечивать активную кнопку */
  useEffect(() => {
    const handleScroll = () => {
      const offset = 120; // высота навбара
      for (const key of Object.keys(refs) as Array<keyof typeof refs>) {
        const node = refs[key].current;
        if (!node) continue;
        const top = node.getBoundingClientRect().top;
        if (top <= offset && top + node.offsetHeight - offset > 0) {
          setActiveSection(key);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (key: keyof typeof refs) => {
    refs[key].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* === LOADING / ERROR STATES === */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 animate-fade-in">
        {/* Skeleton Loading */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="skeleton-title w-64 h-12 mb-8"></div>
            {/* …остальные skeleton-блоки… */}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="card-enhanced p-8 text-center animate-fade-in">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Ошибка</h2>
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  /* === MAIN PAGE === */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 animate-fade-in">
      {/* Навигация */}
      <nav className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md py-4 mb-8">
        <div className="container mx-auto flex justify-center gap-6">
          {(['overview', 'gallery', 'faq', 'contacts'] as const).map((key) => (
            <button
              key={key}
              className={`tab-enhanced px-4 py-2 rounded-lg font-medium transition ${activeSection === key ? 'bg-gradient-morent text-white' : ''}`}
              onClick={() => scrollToSection(key)}
            >
              {key === 'overview' && 'Инструкция'}
              {key === 'gallery' && 'Галерея'}
              {key === 'faq' && 'FAQ'}
              {key === 'contacts' && 'Контакты'}
            </button>
          ))}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* === OVERVIEW === */}
        <section id="overview" ref={refs.overview} className="mb-12 animate-fade-in">
          <div className="card-enhanced p-8 mb-6">
            <h1 className="text-3xl font-bold mb-4">Добро пожаловать, {booking.guest_name}!</h1>
            <p className="text-lg mb-2">
              Ваши апартаменты: <span className="font-semibold">{booking.apartment?.title || 'Апартаменты'}</span>
            </p>
            <p className="mb-2">
              Даты проживания: <b>{booking.checkin_date}</b> — <b>{booking.checkout_date}</b>
            </p>
            <div className="mt-4 space-y-2">
              <div className="glass-dark p-4 rounded-xl">
                <b>Код доступа:</b> <span className="ml-2 text-xl tracking-widest">{booking.apartment?.code_lock || 'Не указан'}</span>
              </div>
              <div className="glass-dark p-4 rounded-xl">
                <b>Wi-Fi:</b> <span className="ml-2">{booking.apartment?.wifi_name || 'Не указано'}</span>
                <br />
                <b>Пароль:</b> <span className="ml-2">{booking.apartment?.wifi_password || 'Не указан'}</span>
              </div>
            </div>
          </div>

          {/* Инструкции */}
          <div className="card-enhanced p-8">
            <h2 className="text-2xl font-bold mb-6">Инструкции</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Заселение</h3>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: booking.apartment?.faq_checkin || 'Инструкции не указаны' }} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Апартаменты</h3>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: booking.apartment?.faq_apartment || 'Инструкции не указаны' }} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Район</h3>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: booking.apartment?.faq_area || 'Инструкции не указаны' }} />
              </div>
            </div>
          </div>
        </section>

        {/* === GALLERY === */}
        <section id="gallery" ref={refs.gallery} className="mb-12 animate-fade-in">
          <div className="card-enhanced p-8">
            <h2 className="text-2xl font-bold mb-6">Галерея</h2>
            {booking.apartment?.photos && Array.isArray(booking.apartment.photos) && booking.apartment.photos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {booking.apartment.photos.map((photo, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <img src={photo} alt={`Фото ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Фотографии не загружены</p>
            )}
          </div>
        </section>

        {/* === FAQ === */}
        <section id="faq" ref={refs.faq} className="mb-12 animate-fade-in">
          <div className="card-enhanced p-8">
            <h2 className="text-2xl font-bold mb-6">Часто задаваемые вопросы</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">Как добраться до апартаментов?</h3>
                <p className="text-gray-600">Подробная информация указана в разделе "Инструкции" выше.</p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">Что делать при проблемах?</h3>
                <p className="text-gray-600">Свяжитесь с менеджером по контактам ниже.</p>
              </div>
            </div>
          </div>
        </section>

        {/* === CONTACTS === */}
        <section id="contacts" ref={refs.contacts} className="mb-12 animate-fade-in">
          <div className="card-enhanced p-8">
            <h2 className="text-2xl font-bold mb-6">Контакты</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-morent rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">📞</span>
                </div>
                <div>
                  <p className="font-semibold">Телефон менеджера</p>
                  <a href={`tel:${booking.apartment?.manager_phone || ''}`} className="text-blue-600 hover:underline">
                    {booking.apartment?.manager_phone || 'Не указан'}
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-morent rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">📧</span>
                </div>
                <div>
                  <p className="font-semibold">Email менеджера</p>
                  <a href={`mailto:${booking.apartment?.manager_email || ''}`} className="text-blue-600 hover:underline">
                    {booking.apartment?.manager_email || 'Не указан'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BookingPage;