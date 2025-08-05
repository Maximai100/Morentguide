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
        setBooking(data);
      } catch (e) {
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
              Ваши апартаменты: <span className="font-semibold">{booking.apartment_title}</span>
            </p>
            <p className="mb-2">
              Даты проживания: <b>{booking.date_start}</b> — <b>{booking.date_end}</b>
            </p>
            <div className="mt-4 space-y-2">
              <div className="glass-dark p-4 rounded-xl">
                <b>Код доступа:</b> <span className="ml-2 text-xl tracking-widest">{booking.lock_code}</span>
              </div>
              <div className="glass-dark p-4 rounded-xl">
                <b>WiFi:</b> <span className="ml-2">{booking.wifi_name || '—'}</span>
                <b className="ml-4">Пароль:</b> <span className="ml-2">{booking.wifi_password || '—'}</span>
              </div>
            </div>
          </div>
          <div className="notification-info mb-6">
            <b>Внимание:</b> Время заезда и подробная инструкция будут отправлены менеджером.
          </div>
        </section>

        {/* === GALLERY === */}
        <section id="gallery" ref={refs.gallery} className="mb-12 animate-fade-in">
          <div className="card-enhanced p-6">
            <h2 className="text-2xl font-bold mb-4">Галерея апартаментов</h2>
            <div className="flex flex-wrap gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-40 h-32 bg-gray-200 rounded-xl skeleton"></div>
              ))}
            </div>
            <p className="text-gray-500 mt-2">Фото будут доступны в ближайшее время.</p>
          </div>
        </section>

        {/* === FAQ === */}
        <section id="faq" ref={refs.faq} className="mb-12 animate-fade-in">
          <div className="card-enhanced p-6">
            <h2 className="text-2xl font-bold mb-4">Частые вопросы</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Во сколько заезд и выезд?</li>
              <li>Как пользоваться электронным замком?</li>
              <li>Где найти ближайший магазин?</li>
              <li>Куда обращаться по вопросам?</li>
            </ul>
            <p className="text-gray-500 mt-2">Если у вас остались вопросы — свяжитесь с менеджером!</p>
          </div>
        </section>

        {/* === CONTACTS === */}
        <section id="contacts" ref={refs.contacts} className="mb-12 animate-fade-in">
          <div className="card-enhanced p-6">
            <h2 className="text-2xl font-bold mb-4">Контакты менеджера</h2>
            <div className="flex flex-col gap-2">
              <span>
                <b>Телефон:</b>{' '}
                <a href={`tel:${booking.manager_phone}`} className="text-blue-600 underline">
                  {booking.manager_phone}
                </a>
              </span>
              <span>
                <b>WhatsApp:</b>{' '}
                <a
                  href={`https://wa.me/${booking.manager_phone?.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 underline"
                >
                  Написать
                </a>
              </span>
              <span>
                <b>Email:</b>{' '}
                <a href={`mailto:${booking.manager_email}`} className="text-indigo-600 underline">
                  {booking.manager_email}
                </a>
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BookingPage;