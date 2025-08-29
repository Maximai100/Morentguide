import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { bookingApi } from '../utils/api';
import { showNotification } from '../utils/helpers';
import Navigation from '../components/Navigation';
import type { BookingPageData } from '../types';

const BookingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [bookingData, setBookingData] = useState<BookingPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');

  useEffect(() => {
    if (slug) {
      loadBookingData(slug);
    }
  }, [slug]);

  const loadBookingData = async (bookingSlug: string) => {
    try {
      setLoading(true);
      const data = await bookingApi.getBySlug(bookingSlug);
      setBookingData(data);
      setError(null);
    } catch (err) {
      console.error('Ошибка загрузки данных бронирования:', err);
      setError('Не удалось загрузить информацию о бронировании');
      showNotification('Ошибка загрузки данных', 'error');
      } finally {
        setLoading(false);
      }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Skeleton для заголовка */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
            
            {/* Skeleton для контента */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !bookingData || !bookingData.booking || !bookingData.apartment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            😕 Ошибка загрузки
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {error || 'Бронирование не найдено'}
          </p>
          <a 
            href="/admin" 
            className="inline-block bg-[#0e2a3b] text-white px-6 py-3 rounded-lg hover:bg-[#0a1f2b] transition-colors"
          >
            Перейти в админ-панель
          </a>
        </div>
      </div>
    );
  }

  const { booking, apartment } = bookingData;

  const sections = [
    { id: 'overview', title: 'Обзор', icon: '🏠' },
    { id: 'photos', title: 'Фото', icon: '📸' },
    { id: 'instructions', title: 'Инструкции', icon: '📋' },
    { id: 'faq', title: 'FAQ', icon: '❓' },
    { id: 'contacts', title: 'Контакты', icon: '📞' },
    { id: 'navigation', title: 'Навигация', icon: '🗺️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Заголовок */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">
              Добро пожаловать, {booking.guest_name}! 🎉
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Ваши апартаменты: <span className="font-semibold">{apartment.title}</span>
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Даты пребывания: <span className="font-semibold">{booking.checkin_date} - {booking.checkout_date}</span>
            </p>
              </div>

          {/* Мобильная навигация */}
          <div className="lg:hidden mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
              <div className="flex overflow-x-auto space-x-2 pb-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-[#0e2a3b] text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="mr-1">{section.icon}</span>
                    {section.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Основной контент */}
            <div className="lg:col-span-2 space-y-6">
              {/* Обзор */}
              {activeSection === 'overview' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-heading font-semibold mb-4 text-gray-900 dark:text-white">
                    🏠 Обзор апартаментов
                  </h2>
                  <div className="space-y-4">
              <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Описание</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {apartment.description || 'Описание апартаментов будет добавлено позже.'}
                      </p>
              </div>
              <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Адрес</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {apartment.base_address}, корпус {apartment.building_number}, апартамент {apartment.apartment_number}
                      </p>
              </div>
            </div>
          </div>
              )}

              {/* Фото */}
              {activeSection === 'photos' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-heading font-semibold mb-4 text-gray-900 dark:text-white">
                    📸 Фотографии
                  </h2>
                                     {apartment.photos && Array.isArray(apartment.photos) && apartment.photos.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {apartment.photos.map((photo: string, index: number) => (
                         <div key={index} className="aspect-w-16 aspect-h-9">
                           <img
                             src={photo}
                             alt={`Фото апартамента ${index + 1}`}
                             className="w-full h-48 object-cover rounded-lg"
                           />
                         </div>
                       ))}
                     </div>
                   ) : (
                     <p className="text-gray-500 dark:text-gray-400">Фотографии будут добавлены позже.</p>
                   )}
                </div>
              )}

              {/* Инструкции */}
              {activeSection === 'instructions' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-heading font-semibold mb-4 text-gray-900 dark:text-white">
                    📋 Инструкции по заселению
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Доступ к апартаментам</h3>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                        <p><strong>Код подъезда:</strong> {apartment.code_building || 'Не указан'}</p>
                        <p><strong>Код замка:</strong> {apartment.code_lock || 'Не указан'}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Wi-Fi</h3>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                        <p><strong>Название сети:</strong> {apartment.wifi_name || 'Не указано'}</p>
                        <p><strong>Пароль:</strong> {apartment.wifi_password || 'Не указан'}</p>
                      </div>
                    </div>
                                         {(apartment as Apartment & { video_instructions: string }).video_instructions && (
                       <div>
                         <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Видео-инструкция</h3>
                         <div className="aspect-w-16 aspect-h-9">
                           <iframe
                             src={(apartment as Apartment & { video_instructions: string }).video_instructions}
                             title="Видео-инструкция"
                             className="w-full h-64 rounded-lg"
                             frameBorder="0"
                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                             allowFullScreen
                           ></iframe>
                         </div>
                       </div>
            )}
          </div>
                </div>
              )}

              {/* FAQ */}
              {activeSection === 'faq' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-heading font-semibold mb-4 text-gray-900 dark:text-white">
                    ❓ Часто задаваемые вопросы
                  </h2>
            <div className="space-y-4">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Во сколько можно заехать?</h3>
                      <p className="text-gray-700 dark:text-gray-300">Заезд возможен с 14:00. При необходимости раннего заезда свяжитесь с менеджером.</p>
                    </div>
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Во сколько нужно выехать?</h3>
                      <p className="text-gray-700 dark:text-gray-300">Выезд до 12:00. При необходимости позднего выезда свяжитесь с менеджером.</p>
                    </div>
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Что делать с ключами при выезде?</h3>
                      <p className="text-gray-700 dark:text-gray-300">Оставьте ключи в апартаментах и закройте дверь.</p>
              </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Что делать в случае проблем?</h3>
                      <p className="text-gray-700 dark:text-gray-300">Свяжитесь с менеджером по указанным контактам.</p>
              </div>
            </div>
          </div>
              )}

              {/* Контакты */}
              {activeSection === 'contacts' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-heading font-semibold mb-4 text-gray-900 dark:text-white">
                    📞 Контакты менеджера
                  </h2>
            <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{apartment.manager_name}</h3>
                      <div className="space-y-2">
                        <p><strong>Телефон:</strong> <a href={`tel:${apartment.manager_phone}`} className="text-[#0e2a3b] hover:underline">{apartment.manager_phone}</a></p>
                        <p><strong>Email:</strong> <a href={`mailto:${apartment.manager_email}`} className="text-[#0e2a3b] hover:underline">{apartment.manager_email}</a></p>
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Полезные советы</h3>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• Сохраните контакты менеджера в телефон</li>
                        <li>• Сделайте скриншот с инструкциями</li>
                        <li>• При возникновении вопросов не стесняйтесь звонить</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Навигация */}
              {activeSection === 'navigation' && (
                <Navigation apartment={apartment} />
              )}
            </div>

            {/* Боковая панель (только для десктопа) */}
            <div className="hidden lg:block space-y-6">
              {/* Навигация */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-heading font-semibold mb-4 text-gray-900 dark:text-white">
                  Навигация
                </h3>
                <div className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeSection === section.id
                          ? 'bg-[#0e2a3b] text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="mr-2">{section.icon}</span>
                      {section.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Быстрые действия */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-heading font-semibold mb-4 text-gray-900 dark:text-white">
                  Быстрые действия
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveSection('navigation')}
                    className="w-full bg-[#0e2a3b] text-white py-2 px-4 rounded-lg hover:bg-[#0a1f2b] transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>🗺️</span>
                    <span>Построить маршрут</span>
                  </button>
                  <a
                    href={`tel:${apartment.manager_phone}`}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>📞</span>
                    <span>Позвонить менеджеру</span>
                  </a>
                  <a
                    href={`mailto:${apartment.manager_email}`}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>✉️</span>
                    <span>Написать email</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;