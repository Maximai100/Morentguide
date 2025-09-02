import React, { useState, useEffect } from 'react';
import ApartmentForm from '../components/ApartmentForm';
import BookingForm from '../components/BookingForm';

import ApartmentsList from '../components/ApartmentsList';
import BookingsList from '../components/BookingsList';
import { apartmentApi, bookingApi } from '../utils/api';

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

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'apartments' | 'bookings'>('apartments');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
    setRefreshTrigger(prev => prev + 1);
  };

  const handleBookingSave = async (booking: Booking | Omit<Booking, 'id'>) => {
    try {
      if ('id' in booking && booking.id) {
        // Update existing booking
        await bookingApi.update(booking.id, booking);
      } else {
        // Create new booking
        await bookingApi.create(booking);
      }
      await loadData();
      setShowBookingForm(false);
      setEditingBooking(undefined);
      showNotification('Бронирование сохранено', 'success');
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Ошибка сохранения бронирования:', error);
      showNotification('Ошибка сохранения бронирования', 'error');
    }
  };

  const handleEditApartment = (apartment: Apartment) => {
    setEditingApartment(apartment);
    setShowApartmentForm(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setShowBookingForm(true);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Улучшенный заголовок */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="animate-fade-in">
              <h1 className="text-display text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-600 bg-clip-text text-transparent dark:from-slate-100 dark:to-blue-400">
                Morent Guide
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium">
                Премиум панель управления апартаментами
              </p>
            </div>
            

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Современные навигационные вкладки */}
        <div className="mb-10 animate-slide-up">
          <nav className="flex flex-wrap gap-2 p-2 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <button
              onClick={() => setActiveTab('apartments')}
              className={`nav-link group ${
                activeTab === 'apartments' ? 'nav-link-active' : 'nav-link-inactive'
              }`}
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Апартаменты</span>
              <span className="counter">{apartments.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`nav-link group ${
                activeTab === 'bookings' ? 'nav-link-active' : 'nav-link-inactive'
              }`}
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Бронирования</span>
              <span className="counter">{bookings.length}</span>
            </button>

          </nav>
        </div>

        {/* Улучшенный контент вкладок */}
        {activeTab === 'apartments' && (
          <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Управление апартаментами
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Создавайте, редактируйте и управляйте апартаментами
                </p>
              </div>
              <button
                onClick={() => setShowApartmentForm(true)}
                className="btn btn-primary group hover:shadow-colored-lg"
              >
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Добавить апартамент</span>
              </button>
            </div>

            <div className="animate-slide-up">
              <ApartmentsList onEdit={handleEditApartment} onRefresh={() => setRefreshTrigger(prev => prev + 1)} refreshTrigger={refreshTrigger} />
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Управление бронированиями
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Отслеживайте и управляйте всеми бронированиями
                </p>
              </div>
              <button
                onClick={() => setShowBookingForm(true)}
                className="btn btn-primary group hover:shadow-colored-lg"
              >
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Добавить бронирование</span>
              </button>
            </div>

            <div className="card-enhanced animate-slide-up">
              <BookingsList onEdit={handleEditBooking} onRefresh={() => setRefreshTrigger(prev => prev + 1)} refreshTrigger={refreshTrigger} />
            </div>
          </div>
        )}



        {/* Улучшенные модальные окна */}
        {showApartmentForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl">
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl">
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