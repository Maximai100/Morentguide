import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { BookingPageData } from '../types';
import { bookingApi } from '../utils/api';
import { formatDate } from '../utils/helpers';

const BookingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<BookingPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      if (!slug) {
        setError('Некорректная ссылка');
        setLoading(false);
        return;
      }

      try {
        const bookingData = await bookingApi.getBySlug(slug);
        setData(bookingData);
      } catch (err) {
        setError('Бронирование не найдено');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-morent-navy mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-4">
            Упс! Что-то пошло не так
          </h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const { booking, apartment } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок с приветствием */}
      <header className="bg-morent-navy text-white">
        <div className="container-morent py-12">
          <h1 className="text-4xl font-heading font-bold mb-4">
            Добро пожаловать, {booking.guest_name}!
          </h1>
          <p className="text-xl text-blue-100">
            {apartment.title}
          </p>
          <p className="text-lg text-blue-200">
            Корпус {apartment.building_number}, апартамент {apartment.apartment_number}
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">
              Заезд: {formatDate(booking.checkin_date)}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              Выезд: {formatDate(booking.checkout_date)}
            </span>
          </div>
        </div>
      </header>

      <main className="container-morent py-8 space-y-8">
        {/* Галерея фотографий */}
        {apartment.photos && Array.isArray(apartment.photos) && apartment.photos.length > 0 && (
          <section className="card p-6">
            <h2 className="text-2xl font-heading font-semibold mb-4">
              Ваши апартаменты
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {apartment.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`${apartment.title} - фото ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </section>
        )}

        {/* Информация о заселении */}
        <section className="card p-6">
          <h2 className="text-2xl font-heading font-semibold mb-4">
            Информация о заселении
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Адрес</h3>
              <p className="text-gray-700">
                {apartment.base_address}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                Корпус {apartment.building_number}, апартамент {apartment.apartment_number}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Коды доступа</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Код от подъезда:</span> {apartment.code_building}</p>
                <p><span className="font-medium">Код от замка:</span> {apartment.code_lock}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Wi-Fi</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Сеть:</span> {apartment.wifi_name}</p>
                <p><span className="font-medium">Пароль:</span> {apartment.wifi_password}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Видео-инструкции */}
        {(apartment.video_entrance || apartment.video_lock) && (
          <section className="card p-6">
            <h2 className="text-2xl font-heading font-semibold mb-4">
              Видео-инструкции
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {apartment.video_entrance && apartment.video_entrance !== null && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Как найти подъезд</h3>
                  <video 
                    controls 
                    className="w-full rounded-lg"
                    src={apartment.video_entrance}
                  />
                </div>
              )}
              {apartment.video_lock && apartment.video_lock !== null && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Как открыть замок</h3>
                  <video 
                    controls 
                    className="w-full rounded-lg"
                    src={apartment.video_lock}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {/* Карта */}
        {apartment.map_embed_code && (
          <section className="card p-6">
            <h2 className="text-2xl font-heading font-semibold mb-4">
              Расположение
            </h2>
            <div 
              className="w-full h-96 rounded-lg overflow-hidden"
              dangerouslySetInnerHTML={{ __html: apartment.map_embed_code }}
            />
          </section>
        )}

        {/* FAQ */}
        <section className="card p-6">
          <h2 className="text-2xl font-heading font-semibold mb-6">
            Часто задаваемые вопросы
          </h2>
          <div className="space-y-6">
            {apartment.faq_checkin && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-morent-navy">
                  О заселении
                </h3>
                <p className="text-gray-700 whitespace-pre-line">{apartment.faq_checkin}</p>
              </div>
            )}
            {apartment.faq_apartment && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-morent-navy">
                  Об апартаментах
                </h3>
                <p className="text-gray-700 whitespace-pre-line">{apartment.faq_apartment}</p>
              </div>
            )}
            {apartment.faq_area && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-morent-navy">
                  О районе
                </h3>
                <p className="text-gray-700 whitespace-pre-line">{apartment.faq_area}</p>
              </div>
            )}
          </div>
        </section>

        {/* Контакты менеджера */}
        <section className="card p-6">
          <h2 className="text-2xl font-heading font-semibold mb-4">
            Ваш менеджер
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-morent-navy">
              {apartment.manager_name}
            </h3>
            <div className="mt-2 space-y-1">
              <p>
                <span className="font-medium">Телефон:</span>{' '}
                <a href={`tel:${apartment.manager_phone}`} className="text-morent-navy hover:underline">
                  {apartment.manager_phone}
                </a>
              </p>
              <p>
                <span className="font-medium">Email:</span>{' '}
                <a href={`mailto:${apartment.manager_email}`} className="text-morent-navy hover:underline">
                  {apartment.manager_email}
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Футер */}
      <footer className="bg-morent-navy text-white py-8">
        <div className="container-morent text-center">
          <h3 className="text-2xl font-heading font-bold mb-2">MORENT</h3>
          <p className="text-blue-100">Ваш дом у моря в любой момент</p>
        </div>
      </footer>
    </div>
  );
};

export default BookingPage;