import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { bookingApi } from '../utils/api';
import type { Booking } from '../types';
import PhotoGallery from '../components/PhotoGallery';

const BookingPage: React.FC = () => {
  const { slug } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('overview');

  // Ссылки на секции для плавного скролла
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
      } catch (err) {
        setError('Бронирование не найдено');
        console.error('Failed to load booking:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  // Слушаем скролл, чтобы подсвечивать активную кнопку
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 animate-fade-in">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded mb-8 w-64"></div>
              <div className="h-64 bg-gray-200 rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="card-enhanced p-8 text-center animate-fade-in">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Ошибка</h2>
          <p className="text-lg">{error}</p>
          <a 
            href="/admin" 
            className="inline-block mt-4 px-6 py-2 bg-[#0e2a3b] text-white rounded-lg hover:bg-[#0a1f2b] transition-colors"
          >
            Перейти в админ-панель
          </a>
        </div>
      </div>
    );
  }

  if (!booking || !booking.apartment) return null;

  const { apartment } = booking;

  // Main page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 animate-fade-in">
      {/* Навигация */}
      <nav className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md py-4 mb-8">
        <div className="container mx-auto flex justify-center gap-6">
          {(['overview', 'gallery', 'faq', 'contacts'] as const).map((key) => (
            <button
              key={key}
              className={`tab-enhanced px-4 py-2 rounded-lg font-medium transition ${
                activeSection === key ? 'bg-gradient-morent text-white' : ''
              }`}
              onClick={() => scrollToSection(key)}
            >
              {key === 'overview' && 'Обзор'}
              {key === 'gallery' && 'Фото'}
              {key === 'faq' && 'FAQ'}
              {key === 'contacts' && 'Контакты'}
            </button>
          ))}
        </div>
      </nav>

      <div className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Приветствие */}
          <section ref={refs.overview} className="mb-12">
            <div className="card-enhanced p-8 text-center">
              <h1 className="text-3xl font-heading font-bold mb-4">
                Добро пожаловать, {booking.guest_name}! 🏠
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Ваши апартаменты готовы к заселению
              </p>
              <div className="bg-gradient-morent text-white p-4 rounded-lg">
                <p className="font-semibold">
                  Заезд: {new Date(booking.checkin_date).toLocaleDateString('ru-RU')}
                </p>
                <p className="font-semibold">
                  Выезд: {new Date(booking.checkout_date).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>
          </section>

          {/* Информация об апартаментах */}
          <section className="mb-12">
            <div className="card-enhanced p-8">
              <h2 className="text-2xl font-heading font-bold mb-6">
                {apartment.title}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Основная информация</h3>
                  <div className="space-y-3">
                    <p><strong>Адрес:</strong> {apartment.base_address}</p>
                    <p><strong>Корпус:</strong> {apartment.building_number}</p>
                    <p><strong>Номер:</strong> {apartment.apartment_number}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Доступ</h3>
                  <div className="space-y-3">
                    <p><strong>Код подъезда:</strong> {apartment.code_building}</p>
                    <p><strong>Код замка:</strong> {apartment.code_lock}</p>
                    <p><strong>Wi-Fi:</strong> {apartment.wifi_name}</p>
                    <p><strong>Пароль Wi-Fi:</strong> {apartment.wifi_password}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Галерея фотографий */}
          <section ref={refs.gallery} className="mb-12">
            <div className="card-enhanced p-8">
              <h2 className="text-2xl font-heading font-bold mb-6">Фотографии апартаментов</h2>
              {apartment.photos && apartment.photos.length > 0 ? (
                <PhotoGallery photos={Array.isArray(apartment.photos) ? apartment.photos : [apartment.photos]} />
              ) : (
                <p className="text-gray-500 text-center py-8">Фотографии не загружены</p>
              )}
            </div>
          </section>

          {/* Видео инструкции */}
          {(apartment.video_entrance || apartment.video_lock) && (
            <section className="mb-12">
              <div className="card-enhanced p-8">
                <h2 className="text-2xl font-heading font-bold mb-6">Видео инструкции</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {apartment.video_entrance && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Как найти подъезд</h3>
                      <video 
                        controls 
                        className="w-full rounded-lg"
                        src={apartment.video_entrance}
                      >
                        Ваш браузер не поддерживает видео
                      </video>
                    </div>
                  )}
                  {apartment.video_lock && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Как открыть замок</h3>
                      <video 
                        controls 
                        className="w-full rounded-lg"
                        src={apartment.video_lock}
                      >
                        Ваш браузер не поддерживает видео
                      </video>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* FAQ */}
          <section ref={refs.faq} className="mb-12">
            <div className="card-enhanced p-8">
              <h2 className="text-2xl font-heading font-bold mb-6">Часто задаваемые вопросы</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Заселение</h3>
                  <div className="prose max-w-none">
                    {apartment.faq_checkin}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Апартаменты</h3>
                  <div className="prose max-w-none">
                    {apartment.faq_apartment}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">О районе</h3>
                  <div className="prose max-w-none">
                    {apartment.faq_area}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Контакты */}
          <section ref={refs.contacts} className="mb-12">
            <div className="card-enhanced p-8">
              <h2 className="text-2xl font-heading font-bold mb-6">Контакты менеджера</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">{apartment.manager_name}</h3>
                  <div className="space-y-3">
                    <p>
                      <strong>Телефон:</strong>{' '}
                      <a 
                        href={`tel:${apartment.manager_phone}`}
                        className="text-[#0e2a3b] hover:underline"
                      >
                        {apartment.manager_phone}
                      </a>
                    </p>
                    <p>
                      <strong>Email:</strong>{' '}
                      <a 
                        href={`mailto:${apartment.manager_email}`}
                        className="text-[#0e2a3b] hover:underline"
                      >
                        {apartment.manager_email}
                      </a>
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Описание</h3>
                  <p className="text-gray-600">{apartment.description}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Карта */}
          {apartment.map_embed_code && (
            <section className="mb-12">
              <div className="card-enhanced p-8">
                <h2 className="text-2xl font-heading font-bold mb-6">Расположение</h2>
                <div 
                  className="w-full h-96 rounded-lg overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: apartment.map_embed_code }}
                />
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;