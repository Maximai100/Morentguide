import React, { useState } from 'react';
import type { Apartment, Booking } from '../types';
import { apartmentApi, bookingApi } from '../utils/api';
import ApartmentForm from '../components/ApartmentForm';
import ApartmentsList from '../components/ApartmentsList';
import BookingForm from '../components/BookingForm';
import BookingsList from '../components/BookingsList';
import ThemeToggle from '../components/ThemeToggle';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Заголовок */}
      <header className="bg-gradient-morent text-white shadow-2xl">
        <div className="container-morent py-8">
          <div className="flex items-center justify-between">
            <div className="glass-effect rounded-2xl p-6 inline-block animate-fade-in">
              <h1 className="text-4xl font-heading font-bold mb-2">
                MORENT
              </h1>
              <p className="text-blue-100">Панель управления</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="glass-effect rounded-xl p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-morent-coral rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <span className="text-white font-medium">Админ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Навигация */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container-morent">
          <div className="flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('apartments');
                setViewMode('list');
                setEditingApartment(undefined);
              }}
              className={`tab-enhanced ${activeTab === 'apartments' ? 'active' : ''}`}
            >
              🏠 Апартаменты
            </button>
            <button
              onClick={() => {
                setActiveTab('bookings');
                setViewMode('list');
                setEditingBooking(undefined);
              }}
              className={`tab-enhanced ${activeTab === 'bookings' ? 'active' : ''}`}
            >
              📅 Бронирования
            </button>
          </div>
        </div>
      </nav>

      {/* Основной контент */}
      <main className="container-morent py-8">
        {activeTab === 'apartments' && (
          <div className="space-y-6">
            {viewMode === 'list' && (
              <ApartmentsList
                onEdit={apt => {
                  setEditingApartment(apt);
                  setViewMode('edit');
                }}
                onRefresh={() => setRefreshTrigger(x => x + 1)}
                refreshTrigger={refreshTrigger}
              />
            )}
            {viewMode === 'create' && (
              <ApartmentForm
                onSave={async (apt) => {
                  setIsLoading(true);
                  await apartmentApi.create(apt as Apartment);
                  setIsLoading(false);
                  setViewMode('list');
                  setRefreshTrigger(x => x + 1);
                }}
                onCancel={handleCancel}
                isLoading={isLoading}
              />
            )}
            {viewMode === 'edit' && editingApartment && (
              <ApartmentForm
                apartment={editingApartment}
                onSave={async (apt) => {
                  setIsLoading(true);
                  await apartmentApi.update(apt as Apartment);
                  setIsLoading(false);
                  setViewMode('list');
                  setEditingApartment(undefined);
                  setRefreshTrigger(x => x + 1);
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
              <BookingsList
                onEdit={booking => {
                  setEditingBooking(booking);
                  setViewMode('edit');
                }}
                onRefresh={() => setRefreshTrigger(x => x + 1)}
                refreshTrigger={refreshTrigger}
              />
            )}
            {viewMode === 'create' && (
              <BookingForm
                onSave={async (booking) => {
                  setIsLoading(true);
                  await bookingApi.create(booking as Booking);
                  setIsLoading(false);
                  setViewMode('list');
                  setRefreshTrigger(x => x + 1);
                }}
                onCancel={handleCancel}
                isLoading={isLoading}
              />
            )}
            {viewMode === 'edit' && editingBooking && (
              <BookingForm
                booking={editingBooking}
                onSave={async (booking) => {
                  setIsLoading(true);
                  await bookingApi.update(booking as Booking);
                  setIsLoading(false);
                  setViewMode('list');
                  setEditingBooking(undefined);
                  setRefreshTrigger(x => x + 1);
                }}
                onCancel={handleCancel}
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
