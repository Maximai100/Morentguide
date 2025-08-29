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
  }, [apartments, bookings]);

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
        <div className="text-center">
          <div className="spinner spinner-lg mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Загрузка данных...</p>
        </div>
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Morent Guide
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Панель управления апартаментами
              </p>
            </div>
            
            {/* Кнопки экспорта */}
            <div className="flex space-x-3">
              <button
                onClick={() => handleExport('excel')}
                className="btn btn-success btn-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Excel</span>
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="btn btn-danger btn-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>PDF</span>
              </button>
              <button
                onClick={() => handleExport('statistics')}
                className="btn btn-primary btn-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Статистика</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Навигационные вкладки */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('apartments')}
              className={`nav-link ${
                activeTab === 'apartments' ? 'nav-link-active' : 'nav-link-inactive'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Апартаменты
              <span className="counter ml-2">{apartments.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`nav-link ${
                activeTab === 'bookings' ? 'nav-link-active' : 'nav-link-inactive'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Бронирования
              <span className="counter ml-2">{bookings.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`nav-link ${
                activeTab === 'calendar' ? 'nav-link-active' : 'nav-link-inactive'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Календарь
            </button>
          </nav>
        </div>

        {/* Контент вкладок */}
        {activeTab === 'apartments' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Управление апартаментами
              </h2>
              <button
                onClick={() => setShowApartmentForm(true)}
                className="btn btn-primary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Добавить апартамент
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apartments.map((apartment) => (
                <div key={apartment.id} className="card hover:shadow-lg transition-shadow duration-200">
                  <div className="card-body">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {apartment.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                      {apartment.base_address}, корпус {apartment.building_number}
                    </p>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditApartment(apartment)}
                        className="btn btn-secondary btn-sm"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Редактировать
                      </button>
                      <button 
                        onClick={() => handleDeleteApartment(apartment.id)}
                        className="btn btn-danger btn-sm"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Управление бронированиями
              </h2>
              <button
                onClick={() => setShowBookingForm(true)}
                className="btn btn-primary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Добавить бронирование
              </button>
            </div>

            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Гость</th>
                      <th>Апартамент</th>
                      <th>Даты</th>
                      <th>Ссылка</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => {
                      const apartment = apartments.find(apt => apt.id === booking.apartment_id);
                      return (
                        <tr key={booking.id} className={selectedBooking?.id === booking.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}>
                          <td className="font-medium text-gray-900 dark:text-white">
                            {booking.guest_name}
                          </td>
                          <td className="text-gray-500 dark:text-gray-400">
                            {apartment?.title || 'Не указан'}
                          </td>
                          <td className="text-gray-500 dark:text-gray-400">
                            {booking.checkin_date} - {booking.checkout_date}
                          </td>
                          <td className="text-gray-500 dark:text-gray-400">
                            <a
                              href={`/booking/${booking.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0e2a3b] hover:underline"
                            >
                              Открыть
                            </a>
                          </td>
                          <td className="font-medium">
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
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
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