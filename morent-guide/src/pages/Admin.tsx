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
      <header className="bg-[#0D2A3F] text-white border-b-4 border-gray-800">
        <div className="container-simple py-6">
          <div className="text-left pl-8">
            <h1 className="text-3xl logo-morent">MORENT</h1>
            <div className="logo-line ml-0 mr-auto w-20"></div>
            <p className="text-sm text-gray-300 font-body mt-3">Система управления бронированием</p>
          </div>
        </div>
      </header>

      {/* Навигация */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container-simple">
          <div className="flex">
            <button
              onClick={() => {
                setActiveTab('apartments');
                setViewMode('list');
                setEditingApartment(undefined);
              }}
              className={`tab-simple ${activeTab === 'apartments' ? 'active' : ''}`}
            >
              Апартаменты
            </button>
            <button
              onClick={() => {
                setActiveTab('bookings');
                setViewMode('list');
                setEditingBooking(undefined);
              }}
              className={`tab-simple ${activeTab === 'bookings' ? 'active' : ''}`}
            >
              Бронирования
            </button>
          </div>
        </div>
      </nav>

      {/* Основной контент */}
      <main className="container-simple py-6">
        {activeTab === 'apartments' && (
          <div>
            {viewMode === 'list' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-heading font-semibold">Апартаменты</h2>
                  <button
                    onClick={() => setViewMode('create')}
                    className="btn-primary"
                  >
                    Добавить апартамент
                  </button>
                </div>
                <ApartmentsList
                  onEdit={apt => {
                    setEditingApartment(apt);
                    setViewMode('edit');
                  }}
                  onRefresh={() => setRefreshTrigger(x => x + 1)}
                  refreshTrigger={refreshTrigger}
                />
              </>
            )}
            {viewMode === 'create' && (
              <>
                <div className="mb-4">
                  <nav className="text-sm text-gray-600">
                    <button 
                      onClick={() => setViewMode('list')}
                      className="hover:text-gray-900"
                    >
                      Апартаменты
                    </button>
                    <span className="mx-2">›</span>
                    <span>Добавить апартамент</span>
                  </nav>
                </div>
                <ApartmentForm
                  onSave={async (apt) => {
                    setIsLoading(true);
                    try {
                      await apartmentApi.create(apt);
                    } catch (error) {
                      console.error('Error creating apartment:', error);
                    }
                    setIsLoading(false);
                    setViewMode('list');
                    setRefreshTrigger(x => x + 1);
                  }}
                  onCancel={handleCancel}
                  isLoading={isLoading}
                />
              </>
            )}
            {viewMode === 'edit' && editingApartment && (
              <>
                <div className="mb-4">
                  <nav className="text-sm text-gray-600">
                    <button 
                      onClick={() => setViewMode('list')}
                      className="hover:text-gray-900"
                    >
                      Апартаменты
                    </button>
                    <span className="mx-2">›</span>
                    <span>Редактировать апартамент</span>
                  </nav>
                </div>
                <ApartmentForm
                  apartment={editingApartment}
                  onSave={async (apt) => {
                    setIsLoading(true);
                    try {
                      const apartmentData = apt as Apartment;
                      await apartmentApi.update(apartmentData.id, apartmentData);
                    } catch (error) {
                      console.error('Error updating apartment:', error);
                    }
                    setIsLoading(false);
                    setViewMode('list');
                    setEditingApartment(undefined);
                    setRefreshTrigger(x => x + 1);
                  }}
                  onCancel={handleCancel}
                  isLoading={isLoading}
                />
              </>
            )}
          </div>
        )}
        {activeTab === 'bookings' && (
          <div>
            {viewMode === 'list' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-heading font-semibold">Бронирования</h2>
                  <button
                    onClick={() => setViewMode('create')}
                    className="btn-primary"
                  >
                    Создать бронирование
                  </button>
                </div>
                <BookingsList
                  onEdit={booking => {
                    setEditingBooking(booking);
                    setViewMode('edit');
                  }}
                  onRefresh={() => setRefreshTrigger(x => x + 1)}
                  refreshTrigger={refreshTrigger}
                />
              </>
            )}
            {viewMode === 'create' && (
              <>
                <div className="mb-4">
                  <nav className="text-sm text-gray-600">
                    <button 
                      onClick={() => setViewMode('list')}
                      className="hover:text-gray-900"
                    >
                      Бронирования
                    </button>
                    <span className="mx-2">›</span>
                    <span>Создать бронирование</span>
                  </nav>
                </div>
                <BookingForm
                  onSave={async (booking) => {
                    setIsLoading(true);
                    try {
                      await bookingApi.create(booking);
                    } catch (error) {
                      console.error('Error creating booking:', error);
                    }
                    setIsLoading(false);
                    setViewMode('list');
                    setRefreshTrigger(x => x + 1);
                  }}
                  onCancel={handleCancel}
                  isLoading={isLoading}
                />
              </>
            )}
            {viewMode === 'edit' && editingBooking && (
              <>
                <div className="mb-4">
                  <nav className="text-sm text-gray-600">
                    <button 
                      onClick={() => setViewMode('list')}
                      className="hover:text-gray-900"
                    >
                      Бронирования
                    </button>
                    <span className="mx-2">›</span>
                    <span>Редактировать бронирование</span>
                  </nav>
                </div>
                <BookingForm
                  booking={editingBooking}
                  onSave={async (booking) => {
                    setIsLoading(true);
                    try {
                      const bookingData = booking as Booking;
                      await bookingApi.update(bookingData.id, bookingData);
                    } catch (error) {
                      console.error('Error updating booking:', error);
                    }
                    setIsLoading(false);
                    setViewMode('list');
                    setEditingBooking(undefined);
                    setRefreshTrigger(x => x + 1);
                  }}
                  onCancel={handleCancel}
                  isLoading={isLoading}
                />
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;