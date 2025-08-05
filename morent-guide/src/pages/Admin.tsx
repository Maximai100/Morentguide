import React, { useState } from 'react';
import type { Apartment, Booking } from '../types';
import { apartmentApi, bookingApi } from '../utils/api';
import ApartmentForm from '../components/ApartmentForm';
import ApartmentsList from '../components/ApartmentsList';
import BookingForm from '../components/BookingForm';
import BookingsList from '../components/BookingsList';

type ViewMode = 'list' | 'create' | 'edit';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'apartments' | 'bookings'>('apartments');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingApartment, setEditingApartment] = useState<Apartment | undefined>(undefined);
  const [editingBooking, setEditingBooking] = useState<Booking | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCancel = () => {
    setViewMode('list');
    setEditingApartment(undefined);
    setEditingBooking(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок */}
      <header className="bg-morent-navy text-white shadow-lg">
        <div className="container-morent py-6">
          <h1 className="text-3xl font-heading font-bold">
            MORENT
          </h1>
          <p className="text-blue-100 mt-2">Панель управления</p>
        </div>
      </header>

      {/* Навигация */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container-morent">
          <div className="flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('apartments');
                setViewMode('list');
                setEditingApartment(undefined);
              }}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'apartments'
                  ? 'border-morent-navy text-morent-navy'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Апартаменты
            </button>
            <button
              onClick={() => {
                setActiveTab('bookings');
                setViewMode('list');
                setEditingBooking(undefined);
              }}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-morent-navy text-morent-navy'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Бронирования
            </button>
          </div>
        </div>
      </nav>

      {/* Основной контент */}
      <main className="container-morent py-8">
        {activeTab === 'apartments' && (
          <div className="space-y-6">
            {viewMode === 'list' && (
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-heading font-semibold text-gray-900">
                  Апартаменты
                </h2>
                <button 
                  onClick={() => setViewMode('create')}
                  className="btn-primary"
                >
                  Добавить апартамент
                </button>
              </div>
            )}

            {(viewMode === 'create' || viewMode === 'edit') && activeTab === 'apartments' && (
              <div className="mb-6">
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-4">
                    <li>
                      <button
                        onClick={() => setViewMode('list')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Апартаменты
                      </button>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="ml-4 text-sm font-medium text-gray-500">
                          {viewMode === 'create' ? 'Добавить апартамент' : 'Редактировать апартамент'}
                        </span>
                      </div>
                    </li>
                  </ol>
                </nav>
              </div>
            )}

            {viewMode === 'list' && activeTab === 'apartments' && (
              <ApartmentsList
                onEdit={(apartment) => {
                  setEditingApartment(apartment);
                  setViewMode('edit');
                }}
                onRefresh={() => setRefreshTrigger(prev => prev + 1)}
                refreshTrigger={refreshTrigger}
              />
            )}

            {(viewMode === 'create' || viewMode === 'edit') && activeTab === 'apartments' && (
              <ApartmentForm
                apartment={editingApartment}
                onSave={async (apartmentData) => {
                  setIsLoading(true);
                  try {
                    if (editingApartment) {
                      await apartmentApi.update(editingApartment.id, apartmentData);
                    } else {
                      await apartmentApi.create(apartmentData);
                    }
                    setViewMode('list');
                    setEditingApartment(undefined);
                    setRefreshTrigger(prev => prev + 1);
                  } catch (error) {
                    console.error('Error saving apartment:', error);
                    const errorMessage = error.response?.data?.message || error.message || 'Неизвестная ошибка';
                    alert(`Ошибка при сохранении апартамента: ${errorMessage}`);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                onCancel={handleCancel}
                isLoading={isLoading}
              />
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {viewMode === 'list' && (
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-heading font-semibold text-gray-900">
                  Бронирования
                </h2>
                <button 
                  onClick={() => setViewMode('create')}
                  className="btn-primary"
                >
                  Создать бронирование
                </button>
              </div>
            )}

            {(viewMode === 'create' || viewMode === 'edit') && activeTab === 'bookings' && (
              <div className="mb-6">
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-4">
                    <li>
                      <button
                        onClick={() => setViewMode('list')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Бронирования
                      </button>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="ml-4 text-sm font-medium text-gray-500">
                          {viewMode === 'create' ? 'Создать бронирование' : 'Редактировать бронирование'}
                        </span>
                      </div>
                    </li>
                  </ol>
                </nav>
              </div>
            )}

            {viewMode === 'list' && activeTab === 'bookings' && (
              <BookingsList
                onEdit={(booking) => {
                  setEditingBooking(booking);
                  setViewMode('edit');
                }}
                onRefresh={() => setRefreshTrigger(prev => prev + 1)}
                refreshTrigger={refreshTrigger}
              />
            )}

            {(viewMode === 'create' || viewMode === 'edit') && activeTab === 'bookings' && (
              <BookingForm
                booking={editingBooking}
                onSave={async (bookingData) => {
                  setIsLoading(true);
                  try {
                    console.log('Admin: Saving booking data:', bookingData);
                    if (editingBooking) {
                      console.log('Admin: Updating existing booking');
                      await bookingApi.update(editingBooking.id, bookingData);
                    } else {
                      console.log('Admin: Creating new booking');
                      await bookingApi.create(bookingData);
                    }
                    console.log('Admin: Booking saved successfully');
                    setViewMode('list');
                    setEditingBooking(undefined);
                    setRefreshTrigger(prev => prev + 1);
                  } catch (error) {
                    console.error('Error saving booking:', error);
                    alert(`Ошибка при сохранении бронирования: ${error.message || error}`);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                onCancel={() => {
                  setViewMode('list');
                  setEditingBooking(undefined);
                }}
                isLoading={isLoading}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage; 