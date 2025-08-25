import React, { useState } from 'react';
import type { Apartment, Booking } from '../types';
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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCancel = () => {
    setViewMode('list');
    setEditingApartment(undefined);
    setEditingBooking(undefined);
  };

  const handleApartmentSave = async (_apartment: Apartment) => {
    setViewMode('list');
    setEditingApartment(undefined);
    setRefreshTrigger(x => x + 1);
  };

  const handleBookingSave = async (_booking: Booking | Omit<Booking, 'id'>) => {
    setViewMode('list');
    setEditingBooking(undefined);
    setRefreshTrigger(x => x + 1);
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
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">Добавить апартамент</span>
                  </nav>
                </div>
                <ApartmentForm
                  onSave={handleApartmentSave}
                  onCancel={handleCancel}
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
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">Редактировать апартамент</span>
                  </nav>
                </div>
                <ApartmentForm
                  apartment={editingApartment}
                  onSave={handleApartmentSave}
                  onCancel={handleCancel}
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
                    Добавить бронирование
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
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">Добавить бронирование</span>
                  </nav>
                </div>
                <BookingForm
                  onSave={handleBookingSave}
                  onCancel={handleCancel}
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
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">Редактировать бронирование</span>
                  </nav>
                </div>
                <BookingForm
                  booking={editingBooking}
                  onSave={handleBookingSave}
                  onCancel={handleCancel}
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