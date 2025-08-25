import React, { useState, useEffect } from 'react';
import ApartmentForm from '../components/ApartmentForm';
import BookingForm from '../components/BookingForm';
import BookingCalendar from '../components/BookingCalendar';
import { apartmentApi, bookingApi } from '../utils/api';
import { exportToExcel, exportToPDF, exportStatistics } from '../utils/export';
import { initializeReminders, startReminderScheduler } from '../utils/reminders';
import { showNotification } from '../utils/helpers';
import type { Apartment, Booking } from '../types';

const AdminPage: React.FC = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showApartmentForm, setShowApartmentForm] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const [editingApartment, setEditingApartment] = useState<Apartment | undefined>(undefined);
  const [editingBooking, setEditingBooking] = useState<Booking | undefined>(undefined);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'apartments' | 'bookings' | 'calendar'>('apartments');

  useEffect(() => {
    loadData();
    initializeReminders(bookings, apartments);
    
    // Запускаем планировщик напоминаний
    const stopScheduler = startReminderScheduler(bookings, apartments);
    
    return () => stopScheduler();
  }, []);

  const loadData = async () => {
    try {
      const [apartmentsData, bookingsData] = await Promise.all([
        apartmentApi.getAll(),
        bookingApi.getAll()
      ]);
      setApartments(apartmentsData);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      showNotification('Ошибка загрузки данных', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApartmentSave = async (_apartment: Apartment) => {
    await loadData();
    setShowApartmentForm(false);
    setEditingApartment(undefined);
    showNotification('Апартамент сохранен', 'success');
  };

  const handleBookingSave = async (_booking: Booking | Omit<Booking, 'id'>) => {
    await loadData();
    setShowBookingForm(false);
    setEditingBooking(undefined);
    showNotification('Бронирование сохранено', 'success');
  };

  const handleEditApartment = (apartment: Apartment) => {
    setEditingApartment(apartment);
    setShowApartmentForm(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setShowBookingForm(true);
  };

  const handleDeleteApartment = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот апартамент?')) {
      try {
        await apartmentApi.delete(id);
        await loadData();
        showNotification('Апартамент удален', 'success');
      } catch (error) {
        console.error('Ошибка удаления апартамента:', error);
        showNotification('Ошибка удаления апартамента', 'error');
      }
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить это бронирование?')) {
      try {
        await bookingApi.delete(id);
        await loadData();
        showNotification('Бронирование удалено', 'success');
      } catch (error) {
        console.error('Ошибка удаления бронирования:', error);
        showNotification('Ошибка удаления бронирования', 'error');
      }
    }
  };

  const handleExport = async (format: 'excel' | 'pdf' | 'statistics') => {
    try {
      const data = { bookings, apartments };
      
      switch (format) {
        case 'excel':
          await exportToExcel(data, `morent-data-${new Date().toISOString().split('T')[0]}`);
          showNotification('Данные экспортированы в Excel', 'success');
          break;
        case 'pdf':
          await exportToPDF(data, `morent-data-${new Date().toISOString().split('T')[0]}`);
          showNotification('Данные экспортированы в PDF', 'success');
          break;
        case 'statistics':
          await exportStatistics(data, `morent-statistics-${new Date().toISOString().split('T')[0]}`);
          showNotification('Статистика экспортирована', 'success');
          break;
      }
    } catch (error) {
      console.error('Ошибка экспорта:', error);
      showNotification('Ошибка экспорта данных', 'error');
    }
  };

  const handleBookingSelect = (booking: Booking) => {
    setSelectedBooking(booking);
    setActiveTab('bookings');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0e2a3b]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Заголовок */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                Morent Guide - Админ-панель
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Управление апартаментами и бронированиями
              </p>
            </div>
            
            {/* Кнопки экспорта */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport('excel')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                📊 Excel
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                📄 PDF
              </button>
              <button
                onClick={() => handleExport('statistics')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                📈 Статистика
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Навигационные вкладки */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('apartments')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'apartments'
                  ? 'border-[#0e2a3b] text-[#0e2a3b] dark:text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🏠 Апартаменты ({apartments.length})
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-[#0e2a3b] text-[#0e2a3b] dark:text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📅 Бронирования ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'calendar'
                  ? 'border-[#0e2a3b] text-[#0e2a3b] dark:text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Календарь
            </button>
          </nav>
        </div>

        {/* Контент вкладок */}
        {activeTab === 'apartments' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-white">
                Апартаменты
              </h2>
              <button
                onClick={() => setShowApartmentForm(true)}
                className="bg-[#0e2a3b] text-white px-4 py-2 rounded-lg hover:bg-[#0a1f2b] transition-colors"
              >
                ➕ Добавить апартамент
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apartments.map((apartment) => (
                <div key={apartment.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {apartment.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {apartment.base_address}, корпус {apartment.building_number}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditApartment(apartment)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                    >
                      ✏️ Редактировать
                    </button>
                    <button
                      onClick={() => handleDeleteApartment(apartment.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                    >
                      🗑️ Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-white">
                Бронирования
              </h2>
              <button
                onClick={() => setShowBookingForm(true)}
                className="bg-[#0e2a3b] text-white px-4 py-2 rounded-lg hover:bg-[#0a1f2b] transition-colors"
              >
                ➕ Добавить бронирование
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Гость
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Апартамент
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Даты
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Ссылка
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {bookings.map((booking) => {
                      const apartment = apartments.find(apt => apt.id === booking.apartment_id);
                      return (
                        <tr key={booking.id} className={selectedBooking?.id === booking.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {booking.guest_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {apartment?.title || 'Не указан'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {booking.checkin_date} - {booking.checkout_date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <a
                              href={`/booking/${booking.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0e2a3b] hover:underline"
                            >
                              Открыть
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditBooking(booking)}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteBooking(booking.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-white">
                Календарь бронирований
              </h2>
            </div>
            <BookingCalendar onBookingSelect={handleBookingSelect} />
          </div>
        )}

        {/* Модальные окна */}
        {showApartmentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <ApartmentForm
                apartment={editingApartment}
                onSave={handleApartmentSave}
                onCancel={() => {
                  setShowApartmentForm(false);
                  setEditingApartment(undefined);
                }}
              />
            </div>
          </div>
        )}

        {showBookingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <BookingForm
                booking={editingBooking}
                onSave={handleBookingSave}
                onCancel={() => {
                  setShowBookingForm(false);
                  setEditingBooking(undefined);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;